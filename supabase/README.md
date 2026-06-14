# Supabase Setup

Supabase is optional. The app works without it, but AI narratives will not be cached between requests.

## Steps

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** > **New Query**
3. Paste the contents of `schema.sql`, then click **Run**
4. Go to **Project Settings** > **API**
5. Copy the following values into your `.env.local`:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon / public key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key (keep secret) |

## Tables created

- **`narrative_cache`** - stores AI-generated narratives keyed by a djb2 hash; TTL is enforced in `lib/groq.ts` via `created_at`.
- **`wrapped_profiles`** - optional analytics table.
