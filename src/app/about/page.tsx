import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHeader, SectionKicker } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SkillsGrid } from "@/components/skills-grid";
import { SkillsRadar } from "@/components/skills-radar";
import { TerminalCard } from "@/components/terminal-card";
import {
  getAchievements,
  getEducation,
  getProfile,
  getRadarAxes,
  getSkillGroups,
} from "@/lib/data";
import { AchievementsSection } from "@/components/achievements-section";

export const metadata: Metadata = {
  title: "About",
  description:
    "Software engineer and co-founder with 6+ years building backend systems, web platforms and mobile applications.",
};

export default async function AboutPage() {
  const [profile, skillGroups, radarAxes, achievements, education] =
    await Promise.all([
      getProfile(),
      getSkillGroups(),
      getRadarAxes(),
      getAchievements(),
      getEducation(),
    ]);
  return (
    <main className="flex-1">
      {/* HEADER + INTRO */}
      <Container className="grid gap-12 py-14 md:grid-cols-[1fr_360px] md:py-16">
        <div>
          <PageHeader kicker="02 – ABOUT" title="About me" />
          <div className="mt-6 flex max-w-[620px] flex-col gap-4 text-base leading-[1.7] text-body">
            {profile.aboutIntro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <TerminalCard lines={profile.terminal} />
      </Container>

      {/* SKILLS */}
      <section className="border-t border-line">
        <Container className="py-11 pb-13">
          <div className="mb-6">
            <SectionKicker>SKILLS &amp; STACK</SectionKicker>
          </div>
          <div className="grid items-stretch gap-6 lg:grid-cols-2">
            <SkillsRadar axes={radarAxes} />
            <SkillsGrid groups={skillGroups} />
          </div>
        </Container>
      </section>

      {/* ACHIEVEMENTS */}
      <AchievementsSection
        kicker="ACHIEVEMENTS"
        variant="full"
        achievements={achievements}
      />

      {/* EDUCATION */}
      <section className="border-t border-line">
        <Container className="grid gap-10 py-11 pb-14 md:grid-cols-2">
          <div>
            <div className="mb-6">
              <SectionKicker>EDUCATION</SectionKicker>
            </div>
            <div className="border border-line bg-white p-[26px]">
              <div className="mb-2.5 font-mono text-[11px] text-accent">
                {education.years}
              </div>
              <div className="text-lg font-semibold md:text-[19px]">
                {education.degree}
              </div>
              <div className="mt-1 text-sm text-muted">{education.school}</div>
              <p className="mt-3.5 text-[13.5px] leading-relaxed text-body">
                {education.description}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <SiteFooter />
    </main>
  );
}
