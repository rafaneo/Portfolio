"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm border border-line bg-white">
        <div className="border-b border-line px-6 py-4 font-mono text-xs">
          <span className="font-bold text-accent">RN – ADMIN</span>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-4 p-6">
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[11px] text-muted">EMAIL</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[11px] text-muted">PASSWORD</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
          </label>
          {error && (
            <p className="font-mono text-[11px] text-[#c0392b]">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer bg-ink px-6 py-3 font-mono text-[13px] font-bold text-paper transition-colors hover:bg-accent disabled:cursor-default disabled:opacity-50"
          >
            {loading ? "SIGNING IN…" : "SIGN IN →"}
          </button>
        </form>
      </div>
    </div>
  );
}
