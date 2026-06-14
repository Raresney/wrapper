# Deploy to Vercel

## Step 1 - GitHub OAuth App (production)

1. Go to [github.com/settings/applications/new](https://github.com/settings/applications/new)
2. Application name: `GitHub Wrapped`
3. Homepage URL: `https://your-domain.vercel.app`
4. Authorization callback URL: `https://your-domain.vercel.app/api/auth/callback/github`
5. Copy **Client ID** and **Client Secret**

## Step 2 - Vercel deploy

1. Push project to a GitHub repo
2. Go to [vercel.com](https://vercel.com), select **New Project**, then import the repo
3. Add all environment variables from `.env.local.example`
4. Set `NEXTAUTH_URL` to `https://your-domain.vercel.app`
5. Click **Deploy**

## Step 3 - Supabase production

1. Run `supabase/schema.sql` in your Supabase project SQL Editor
2. Add the three Supabase env vars to Vercel **Project Settings > Environment Variables**
3. Trigger a redeploy

## Step 4 - Verify

- [ ] Landing page loads
- [ ] Public wrapped works without OAuth
- [ ] GitHub OAuth connect works
- [ ] Private repos are visible when authenticated
- [ ] Narrative generates when `GROQ_API_KEY` is set
- [ ] PNG export works
- [ ] Supabase cache populates when Supabase env vars are set
