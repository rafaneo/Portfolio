import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Cookie-aware client for auth-sensitive server code (admin pages/actions). */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component where cookies cannot be set.
            // Safe to ignore when just reading.
          }
        },
      },
    }
  );
}
