import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function hasSupabase() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Cookie-free anon client for public content reads. Unlike the SSR client it
 * never touches cookies(), so public pages stay statically renderable and are
 * refreshed via revalidatePath() from admin server actions.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
