-- Narrative cache table
CREATE TABLE IF NOT EXISTS narrative_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cache_key TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  narrative JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast cache lookup
CREATE INDEX IF NOT EXISTS idx_narrative_cache_key
  ON narrative_cache(cache_key);

-- Index for cleanup queries
CREATE INDEX IF NOT EXISTS idx_narrative_cache_created
  ON narrative_cache(created_at);

-- Auto-delete cache entries older than 24 hours
-- Run this as a Supabase cron job or handle in application
-- (handled in application layer via created_at check in lib/groq.ts)

-- Optional: wrapped_profiles for analytics (no PII)
CREATE TABLE IF NOT EXISTS wrapped_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  period_type TEXT NOT NULL,
  archetype_primary TEXT,
  total_commits INTEGER,
  theme_id TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wrapped_profiles_username
  ON wrapped_profiles(username);
