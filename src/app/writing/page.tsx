import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { posts } from "@/content/posts";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Occasional notes on backend architecture, delivery and building products end-to-end.",
};

export default function WritingPage() {
  return (
    <main className="flex flex-1 flex-col">
      <Container className="py-14 pb-10 md:py-16">
        <PageHeader kicker="WRITING" title="Notes & writing">
          Occasional notes on backend architecture, delivery and building
          products end-to-end.
        </PageHeader>
      </Container>

      <Container className="flex-1 pb-16">
        {posts.length === 0 ? (
          <div className="border border-dashed border-[#b9bec3] px-10 py-14 text-center">
            <div className="font-mono text-xs text-muted">
              FIRST POST COMING SOON
            </div>
            <p className="mx-auto mt-2.5 max-w-[440px] text-sm leading-relaxed text-muted">
              In the meantime you can find my activity on {" "}
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
          <div className="grid gap-px border border-line bg-line">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/writing/${post.slug}`}
                className="group bg-white p-7"
              >
                <div className="mb-3 font-mono text-[11px] text-accent">
                  {new Date(post.publishedAt)
                    .toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    .toUpperCase()}
                </div>
                <h2 className="text-xl font-semibold group-hover:text-accent md:text-[22px]">
                  {post.title}
                </h2>
                <p className="mt-2 max-w-[640px] text-sm leading-relaxed text-body">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        )}
      </Container>

      <SiteFooter />
    </main>
  );
}
