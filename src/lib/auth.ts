import { createClient } from "@/lib/supabase/server";

export type UserRole = "admin" | "viewer";

export type CurrentUser = {
  id: string;
  email: string;
  role: UserRole;
};

/** Signed-in user + role, or null. Gates admin UI and mutations. */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!roleRow) return null;

  return {
    id: user.id,
    email: user.email ?? "",
    role: roleRow.role as UserRole,
  };
}

export async function requireAdmin(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    throw new Error("Forbidden");
  }
  return user;
}
