import { supabase } from './supabase';
import type { Topic, Lecture, Question, TopicWithCounts, SessionMedia } from './types';

export async function getTopics(): Promise<Topic[]> {
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .order('sort_order');
  if (error) throw error;
  return data ?? [];
}

export async function getTopicsWithCounts(): Promise<TopicWithCounts[]> {
  const topics = await getTopics();
  const results = await Promise.all(
    topics.map(async (topic) => {
      const [{ count: lc }, { count: qc }] = await Promise.all([
        supabase.from('lectures').select('*', { count: 'exact', head: true }).eq('topic_id', topic.id),
        supabase.from('questions').select('*', { count: 'exact', head: true }).eq('topic_id', topic.id),
      ]);
      return { ...topic, lecture_count: lc ?? 0, question_count: qc ?? 0 };
    })
  );
  return results;
}

export async function getTopicBySlug(slug: string): Promise<Topic | null> {
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) return null;
  return data;
}

export async function getLecturesByTopic(topicId: string): Promise<Lecture[]> {
  const { data, error } = await supabase
    .from('lectures')
    .select('*')
    .eq('topic_id', topicId)
    .order('sort_order');
  if (error) throw error;
  return data ?? [];
}

export async function getLectureById(id: string): Promise<Lecture | null> {
  const { data, error } = await supabase
    .from('lectures')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
}

export async function getSessionMedia(lectureId: string): Promise<SessionMedia[]> {
  const { data, error } = await supabase
    .from('session_media')
    .select('*')
    .eq('lecture_id', lectureId)
    .order('sort_order');
  if (error) return [];
  return data ?? [];
}

export async function getQuestionsByTopic(topicId: string): Promise<Question[]> {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('topic_id', topicId)
    .order('created_at');
  if (error) throw error;
  return data ?? [];
}

export async function getAllQuestionsWithTopic(): Promise<(Question & { topics: { name: string; color: string } })[]> {
  const { data, error } = await supabase
    .from('questions')
    .select('*, topics(name, color)')
    .order('created_at');
  if (error) throw error;
  return (data ?? []) as (Question & { topics: { name: string; color: string } })[];
}
