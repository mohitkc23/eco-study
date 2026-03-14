import { NextResponse } from 'next/server';
import { getAdminClient, supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lectureId = searchParams.get('lecture');
  if (!lectureId) return NextResponse.json([]);
  const { data, error } = await supabase
    .from('session_media')
    .select('*')
    .eq('lecture_id', lectureId)
    .order('sort_order');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { data, error } = await getAdminClient()
    .from('session_media')
    .insert(body)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
