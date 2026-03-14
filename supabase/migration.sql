-- ============================================================
-- Migration: Add notes_md and session_number columns to lectures
-- Run this in Supabase SQL Editor if you set up the DB before
-- these columns were added to the schema.
-- ============================================================

ALTER TABLE lectures
  ADD COLUMN IF NOT EXISTS session_number INTEGER,
  ADD COLUMN IF NOT EXISTS notes_md TEXT;

-- Notify PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';
