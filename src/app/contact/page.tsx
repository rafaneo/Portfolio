import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHeader, SectionKicker } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { WireframeCube } from "@/components/wireframe-cube";
import { getProfile } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Open to interesting engineering problems, collaborations and conversations.",
};

export default async function ContactPage() {
  const profile = await getProfile();
  return (
    <main className="flex flex-1 flex-col">
      {/* HERO */}
      <Container className="grid items-center gap-8 py-14 md:grid-cols-[1fr_240px] md:py-[72px]">
        <div>
          <PageHeader kicker="08 – CONTACT" title="Let's talk">
            Open to interesting engineering problems, collaborations and
            conversations. The fastest way to reach me is email.
          </PageHeader>
          <a
            href={`mailto:${profile.email}`}
            className="mt-[30px] inline-block bg-ink px-7 py-4 font-mono text-sm font-bold text-paper transition-colors hover:bg-accent"
          >
            {profile.email} →
          </a>
        </div>
        <div className="hidden md:block">
          <WireframeCube size={96} height={200} />
        </div>
      </Container>

      {/* CHANNELS */}
      <section className="flex-1 border-t border-line">
        <Container className="py-11 pb-16">
          <div className="mb-6">
            <SectionKicker>ALL CHANNELS</SectionKicker>
          </div>
          <div className="grid gap-px border border-line bg-line sm:grid-cols-2 md:grid-cols-3">
            {profile.channels.map((channel) => {
              const inner = (
                <>
                  <div className="mb-2 font-mono text-[11px] text-accent">
                    {channel.label.toUpperCase()}
                  </div>
                  <div className="text-[15px] font-semibold">
                    {channel.value}
                  </div>
                </>
              );
              return channel.href ? (
                <a
                  key={channel.key}
                  href={channel.href}
                  target={channel.external ? "_blank" : undefined}
                  rel={channel.external ? "noopener noreferrer" : undefined}
                  className="block bg-white p-6 transition-colors hover:text-accent"
                >
                  {inner}
                </a>
              ) : (
                <div key={channel.key} className="bg-white p-6">
                  {inner}
                </div>
              );
            })}
          </div>
          <a
            href={profile.cvPath}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block border border-ink px-6 py-3.5 font-mono text-[13px] font-bold text-ink transition-colors hover:border-accent hover:text-accent"
          >
            DOWNLOAD CV (PDF)
          </a>
        </Container>
      </section>

      <SiteFooter variant="colophon" />
    </main>
  );
}
