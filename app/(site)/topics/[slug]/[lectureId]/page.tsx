import { notFound } from 'next/navigation';
import { getTopicBySlug, getLectureById, getSessionMedia } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import type { Question } from '@/lib/types';
import LectureClient from './LectureClient';

export default async function LecturePage({
  params,
}: {
  params: Promise<{ slug: string; lectureId: string }>;
}) {
  const { slug, lectureId } = await params;

  const [topic, lecture] = await Promise.all([
    getTopicBySlug(slug),
    getLectureById(lectureId),
  ]);

  if (!topic || !lecture) notFound();

  const [{ data: questions }, media] = await Promise.all([
    supabase.from('questions').select('*').eq('lecture_id', lectureId).order('created_at'),
    getSessionMedia(lectureId),
  ]);

  return (
    <LectureClient
      topic={topic}
      lecture={lecture}
      questions={(questions as Question[]) ?? []}
      media={media}
    />
  );
}
