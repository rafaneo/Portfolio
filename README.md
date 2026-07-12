# Rafael Neocleous — Portfolio

Swiss-grid portfolio built with Next.js 16, Tailwind 4 and a Supabase-backed CMS.

## Running locally

```bash
npm install
npm run dev
```

Without Supabase credentials the site renders from the static content files in
`src/content/` — everything works except `/admin`.

## Connecting the CMS (Supabase)

1. Create a Supabase project, then copy `.env.local.example` → `.env.local`
   and fill in the URL, anon key and service-role key.
2. Apply the schema: paste `supabase/migrations/001_initial.sql` into the
   Supabase SQL editor (or `supabase db push` with the CLI).
3. Seed the current site content into the database:
   ```bash
   npx tsx --env-file=.env.local scripts/seed.ts
   ```
4. Create your admin user: Supabase dashboard → Authentication → Add user
   (email + password), then grant the role in the SQL editor:
   ```sql
   INSERT INTO user_roles (user_id, role)
   SELECT id, 'admin' FROM auth.users WHERE email = 'you@example.com';
   ```
5. Restart the dev server and sign in at `/admin`.

Once the env vars exist, the public pages read from Supabase instead of the
static files, and every admin save republishes the site via `revalidatePath`.

## Architecture

- `src/content/` — static content + shared types. Acts as the fallback when
  Supabase is not configured, and as the seed source.
- `src/lib/data.ts` — content access layer (Supabase with static fallback).
- `src/lib/supabase/` — browser/server/public/admin clients + middleware.
- `src/app/admin/` — CMS: projects, experience, writing (Tiptap rich text),
  about (skills/radar/achievements/education), settings (profile, CV upload).
- `supabase/migrations/` — schema, RLS policies, storage bucket.
- Storage: public `site-assets` bucket (achievement/role images, CV pdf).
