-- ============================================================
-- International Economics Study Site — Supabase Schema
-- Run this SQL in your Supabase project's SQL Editor
-- ============================================================

-- Topics table
CREATE TABLE IF NOT EXISTS topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  sessions TEXT,           -- display label e.g. "Sessions 1-2"
  color TEXT DEFAULT 'teal',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions / Lectures table
CREATE TABLE IF NOT EXISTS lectures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  session_number INTEGER,  -- e.g. 1, 2, 3 (displayed as "Session 1")
  pdf_filename TEXT,
  notes_md TEXT,           -- Markdown content
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE NOT NULL,
  lecture_id UUID REFERENCES lectures(id) ON DELETE SET NULL,
  question_text TEXT NOT NULL,
  model_answer TEXT NOT NULL,
  question_type TEXT DEFAULT 'long_answer' CHECK (question_type IN ('short_answer', 'long_answer')),
  marks INTEGER DEFAULT 5,
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Session media table (YouTube embeds + images)
CREATE TABLE IF NOT EXISTS session_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lecture_id UUID REFERENCES lectures(id) ON DELETE CASCADE NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('youtube', 'image')),
  url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_lectures_topic ON lectures(topic_id);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_questions_lecture ON questions(lecture_id);
CREATE INDEX IF NOT EXISTS idx_session_media_lecture ON session_media(lecture_id);

-- Row Level Security (admin auth is handled by app middleware)
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on topics" ON topics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on lectures" ON lectures FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on questions" ON questions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on session_media" ON session_media FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- Seed data: 8 course topics
-- ============================================================

INSERT INTO topics (name, slug, description, sessions, color, sort_order) VALUES
  ('Balance of Payments', 'balance-of-payments', 'Open economy national accounts, current account, capital account, and BOP equilibrium.', 'Sessions 1-2', 'blue', 1),
  ('History of Trade & Mercantilism', 'history-trade-mercantilism', 'Historical origins of international trade, mercantilist doctrine, and colonization.', 'Sessions 3-4', 'amber', 2),
  ('Basis for Trade', 'basis-for-trade', 'Absolute advantage (Smith), comparative advantage (Ricardo), and the Heckscher-Ohlin model.', 'Sessions 5-7', 'emerald', 3),
  ('Empirical & Alternate Trade Theories', 'empirical-trade-theories', 'Balassa RCA, intra-industry trade, gravity model, economies of scale.', 'Sessions 8-9', 'violet', 4),
  ('Gains from Trade & Terms of Trade', 'gains-terms-of-trade', 'Growth effects of free trade, terms of trade, Dutch disease.', 'Session 10', 'teal', 5),
  ('Tariffs, Quotas & Trade Policy', 'tariffs-quotas-trade-policy', 'Political economy of trade: tariffs, import quotas, non-tariff barriers.', 'Sessions 11-12', 'rose', 6),
  ('Capital Flows & Crises', 'capital-flows-crises', 'International capital flows, dollar as reserve currency, financial crises.', 'Sessions 13-14', 'orange', 7),
  ('Exchange Rates & Open Economy Macro', 'exchange-rates-open-economy', 'Forex, UIP, PPP, open economy macro, impossible trinity.', 'Sessions 15-18', 'cyan', 8)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- MIGRATION: If you already ran the old schema, run this block
-- to add the new columns/tables without losing existing data:
-- ============================================================
--
-- ALTER TABLE lectures
--   ADD COLUMN IF NOT EXISTS session_number INTEGER,
--   ADD COLUMN IF NOT EXISTS notes_md TEXT;
--
-- UPDATE lectures SET notes_md = notes_text WHERE notes_md IS NULL AND notes_text IS NOT NULL;
--
-- CREATE TABLE IF NOT EXISTS session_media (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   lecture_id UUID REFERENCES lectures(id) ON DELETE CASCADE NOT NULL,
--   media_type TEXT NOT NULL CHECK (media_type IN ('youtube', 'image')),
--   url TEXT NOT NULL,
--   caption TEXT,
--   sort_order INTEGER DEFAULT 0,
--   created_at TIMESTAMPTZ DEFAULT NOW()
-- );
-- ALTER TABLE session_media ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all on session_media" ON session_media FOR ALL USING (true) WITH CHECK (true);
--
-- ============================================================
