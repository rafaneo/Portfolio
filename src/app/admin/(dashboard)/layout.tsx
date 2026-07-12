import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Admin" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect("/admin/login");

  const user = await getCurrentUser();
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-4">
        <div className="max-w-md border border-line bg-white p-8 text-center">
          <div className="font-mono text-xs font-bold text-accent">
            ACCESS DENIED
          </div>
          <p className="mt-3 text-sm leading-relaxed text-body">
            Your account ({authUser.email}) has no role assigned. Add a row to
            the user_roles table with role &quot;admin&quot;.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <AdminNav email={user.email} />
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 py-10 md:px-10">
        {children}
      </main>
    </div>
  );
}
