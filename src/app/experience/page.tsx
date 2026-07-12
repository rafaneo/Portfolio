import type { Metadata } from "next";
import { Container } from "@/components/container";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { ProjectsPreview } from "@/components/projects-preview";
import { PageHeader } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "",
};

export default function ExperiencePage() {
  return (
    <main className="flex-1">
      <Container className="py-14 pb-10 md:py-16">
        <PageHeader kicker="" title="Timeline">
          {" "}
          {/* <span className="font-mono text-xs text-accent">
            CLICK A ROLE TO OPEN ITS CHAPTER.
          </span> */}
        </PageHeader>
      </Container>

      <Container className="pb-10">
        <ExperienceTimeline />
      </Container>

      <ProjectsPreview kicker="SOME PROJECTS I'VE WORKED ON" />

      <SiteFooter />
    </main>
  );
}
