export type Topic = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sessions: string | null;
  color: string;
  sort_order: number;
  created_at: string;
};

export type Lecture = {
  id: string;
  topic_id: string;
  title: string;
  session_number: number | null;
  pdf_filename: string | null;
  notes_md: string | null;
  sort_order: number;
  created_at: string;
};

export type SessionMedia = {
  id: string;
  lecture_id: string;
  media_type: 'youtube' | 'image';
  url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
};

export type Question = {
  id: string;
  topic_id: string;
  lecture_id: string | null;
  question_text: string;
  model_answer: string;
  question_type: 'short_answer' | 'long_answer';
  marks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  created_at: string;
};

export type TopicWithCounts = Topic & {
  lecture_count: number;
  question_count: number;
};
