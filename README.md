# GitHub Wrapped

GitHub Wrapped turns a GitHub profile into a shareable developer recap. It pulls GitHub activity, calculates developer metrics, assigns an archetype, optionally generates an AI narrative, and presents the result as animated slides.

## Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- NextAuth with GitHub OAuth
- Groq for optional narrative generation
- Supabase for optional narrative caching

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template:

```bash
cp .env.local.example .env.local
```

3. Fill in the required GitHub OAuth values. Groq and Supabase are optional, but narrative generation and caching need them.

4. Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Main Flow

1. The home page collects a username, period, and narrative tone.
2. `/api/github` fetches raw GitHub data.
3. `/api/analyze` calculates metrics, achievements, insights, archetypes, and visual theme.
4. `/wrapped/[username]` renders the slide experience from `sessionStorage`.
5. `/api/narrative` optionally generates and caches AI copy.

## Notes

- Public GitHub data works without OAuth, but contribution history and private repos need GitHub login.
- The app uses local system font stacks so production builds do not need to fetch Google Fonts.
- Supabase cache setup is documented in `supabase/README.md`.
