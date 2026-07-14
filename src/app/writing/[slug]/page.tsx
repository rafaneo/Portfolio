import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { SiteFooter } from "@/components/site-footer";
import { getPost, getPosts } from "@/lib/data";
import { htmlToExcerpt, sanitizeRichText } from "@/lib/sanitize";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt || htmlToExcerpt(post.content),
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const dateLabel = new Date(post.publishedAt)
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();

  return (
    <main className="flex flex-1 flex-col">
      <Container className="grid items-center gap-8 py-14 md:grid-cols-[1fr_auto] md:py-16">
        <div>
          <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs">
            <span className="text-accent">WRITING – {dateLabel}</span>
            {post.tags.map((tag) => (
              <span key={tag} className="uppercase text-muted">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="max-w-[820px] text-4xl font-bold uppercase leading-none tracking-[-0.03em] md:text-6xl">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-[18px] max-w-[600px] text-[15px] leading-relaxed text-body">
              {post.excerpt}
            </p>
          )}
        </div>
        {post.thumbnailUrl && (
          <Image
            src={post.thumbnailUrl}
            alt=""
            width={1000}
            height={800}
            className="hidden h-[360px] w-auto max-w-[480px] border border-line object-cover md:block"
          />
        )}
      </Container>

      <section className="flex-1 border-t border-line">
        <Container className="py-11 pb-16">
          <article
            className="post-content max-w-[720px]"
            dangerouslySetInnerHTML={{
              __html: sanitizeRichText(post.content),
            }}
          />
        </Container>
      </section>

      <SiteFooter />
    </main>
  );
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}
