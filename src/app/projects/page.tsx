import type { Metadata } from "next";
import { Container } from "@/components/container";
import { ProjectsGrid } from "@/components/projects-grid";
import { PageHeader } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { getProfile, getProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Platforms and products I've architected, built or led",
};

export default async function ProjectsPage() {
  const [profile, projects] = await Promise.all([getProfile(), getProjects()]);
  return (
    <main className="flex-1">
      <Container className="py-14 pb-10 md:py-16">
        <PageHeader kicker="" title="Selected work"></PageHeader>
      </Container>

      <Container className="pb-14">
        <ProjectsGrid projects={projects} />
        <div className="mt-6 font-mono text-xs text-muted">
          MORE ON{" "}
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-accent hover:underline"
          >
            GITHUB →
          </a>
        </div>
      </Container>

      <SiteFooter />
    </main>
  );
}
