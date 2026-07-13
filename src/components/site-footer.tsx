import { getProfile } from "@/lib/data";

export async function SiteFooter({
  variant = "default",
}: {
  variant?: "default" | "colophon";
}) {
  const profile = await getProfile();

  if (variant === "colophon") {
    return (
      <footer className="border-t border-line font-mono text-xs text-muted">
        <div className="px-6 py-[18px]">© 2026 {profile.name.toUpperCase()}</div>
      </footer>
    );
  }
  return (
    <footer className="grid grid-cols-1 border-t border-line font-mono text-xs text-muted sm:grid-cols-2 md:grid-cols-4">
      <a
        href={`mailto:${profile.email}`}
        className="border-b border-line px-6 py-[18px] transition-colors hover:text-accent sm:border-r md:border-b-0"
      >
        {profile.email}
      </a>
      <a
        href={profile.github}
        target="_blank"
        rel="noopener noreferrer"
        className="border-b border-line px-6 py-[18px] transition-colors hover:text-accent md:border-b-0 md:border-r"
      >
        {profile.githubLabel}
      </a>
      <div className="border-b border-line px-6 py-[18px] sm:border-b-0 sm:border-r">
        {profile.phoneNl}
      </div>
      <div className="px-6 py-[18px]">{profile.locationFull}</div>
    </footer>
  );
}
