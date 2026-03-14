import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topicId = searchParams.get('topic');

  let query = supabase
    .from('questions')
    .select('*, topics(name, color)')
    .order('created_at');
  if (topicId) query = query.eq('topic_id', topicId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const admin = getAdminClient();
  const { data, error } = await admin.from('questions').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
