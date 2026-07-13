import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { WritingList } from "@/components/writing-list";
import { getPosts, getProfile } from "@/lib/data";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Occasional notes on backend architecture, delivery and building products end-to-end.",
};

export default async function WritingPage() {
  const [posts, profile] = await Promise.all([getPosts(), getProfile()]);
  return (
    <main className="flex flex-1 flex-col">
      <Container className="py-14 pb-10 md:py-16">
        <PageHeader kicker="" title="BLOG"></PageHeader>
      </Container>

      <Container className="flex-1 pb-16">
        {posts.length === 0 ? (
          <div className="border border-dashed border-[#b9bec3] px-10 py-14 text-center">
            <div className="font-mono text-xs text-muted">
              FIRST POST COMING SOON
            </div>
            <p className="mx-auto mt-2.5 max-w-[440px] text-sm leading-relaxed text-muted">
              In the meantime you can find my activity on{" "}
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-accent hover:underline"
              >
                GitHub
              </a>
              .
            </p>
          </div>
        ) : (
          <WritingList posts={posts} />
        )}
      </Container>

      <SiteFooter />
    </main>
  );
}
