import Link from "next/link";
import { AchievementsSection } from "@/components/achievements-section";
import { Container } from "@/components/container";
import { ProjectsPreview } from "@/components/projects-preview";
import { SectionRow } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { WireframeCube } from "@/components/wireframe-cube";
import { roles } from "@/content/experience";
import { profile } from "@/content/profile";
import { cn } from "@/lib/utils";

export default function Home() {
  const previewRoles = roles.slice(0, 3);

  return (
    <main className="flex-1">
      {/* HERO */}
      <Container className="grid items-center gap-6 py-14 md:grid-cols-[1fr_320px] md:py-20">
        <div>
          <div className="mb-5 animate-rise font-mono text-[13px] uppercase text-accent">
            {profile.heroKicker}
          </div>
          <h1 className="animate-rise text-5xl font-bold uppercase leading-[0.98] tracking-[-0.03em] [animation-delay:.08s] sm:text-7xl md:text-[84px]">
            Rafael
            <br />
            Neocleous
          </h1>
          <div className="mt-8 grid animate-rise gap-7 [animation-delay:.16s] md:mt-11 md:grid-cols-[2fr_1fr]">
            <p className="text-[15px] leading-relaxed text-body">
              {profile.heroBlurb}
            </p>
            <div className="font-mono text-xs leading-[1.8] text-muted">
              {profile.heroStack.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>
          </div>
          <div className="mt-8 flex animate-rise flex-wrap gap-3.5 [animation-delay:.24s] md:mt-10">
            <Link
              href="/projects"
              className="bg-ink px-6 py-[15px] font-mono text-[13px] font-bold text-paper transition-colors hover:bg-accent"
            >
              SEE WORK →
            </Link>
            <a
              href={profile.cvPath}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-ink px-6 py-[15px] font-mono text-[13px] font-bold text-ink transition-colors hover:border-accent hover:text-accent"
            >
              DOWNLOAD CV
            </a>
          </div>
        </div>
        <div className="hidden md:block">
          <WireframeCube size={150} height={300} />
        </div>
      </Container>

      {/* EXPERIENCE PREVIEW */}
      <section className="border-t border-line">
        <Container className="py-11 pb-13">
          <SectionRow
            kicker=""
            link={{ href: "/experience", label: "FULL TIMELINE →" }}
          />
          <div className="grid grid-cols-[8px_1fr] gap-x-5 md:grid-cols-[160px_2px_1fr] md:gap-x-[30px]">
            {previewRoles.map((role, i) => (
              <div key={role.id} className="contents">
                <div
                  className={cn(
                    "hidden pt-0.5 font-mono text-xs md:block",
                    i === 0 ? "text-accent" : "text-muted"
                  )}
                >
                  {role.dates}
                </div>
                <div
                  className={cn(
                    "relative w-0.5",
                    i === 0
                      ? "bg-gradient-to-b from-accent to-accent-soft"
                      : "bg-accent-soft"
                  )}
                >
                  <div
                    className={cn(
                      "absolute -left-1 top-0 size-2.5",
                      i === 0
                        ? "bg-accent"
                        : "border-2 border-accent bg-paper"
                    )}
                  />
                </div>
                <div
                  className={cn(
                    i === previewRoles.length - 1 ? "pb-1.5" : "pb-[30px]"
                  )}
                >
                  <div className="mb-1 font-mono text-xs text-muted md:hidden">
                    {role.dates}
                  </div>
                  <div className="text-lg font-semibold md:text-xl">
                    {role.title} · {role.org}
                  </div>
                  <p className="mt-1.5 max-w-[600px] text-sm leading-relaxed text-muted">
                    {role.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* PROJECTS PREVIEW */}
      <ProjectsPreview kicker="PROJECTS" />

      {/* ACHIEVEMENTS */}
      <AchievementsSection kicker="ACTIVITIES" />

      <SiteFooter />
    </main>
  );
}
