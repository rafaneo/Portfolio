import Link from "next/link";

export function SectionKicker({ children }: { children: React.ReactNode }) {
  return <div className="font-mono text-xs text-muted">{children}</div>;
}

export function SectionRow({
  kicker,
  link,
}: {
  kicker: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="mb-7 flex items-baseline justify-between">
      <SectionKicker>{kicker}</SectionKicker>
      {link && (
        <Link
          href={link.href}
          className="font-mono text-xs font-bold text-accent hover:underline"
        >
          {link.label}
        </Link>
      )}
    </div>
  );
}

export function PageHeader({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-4 font-mono text-xs text-accent">{kicker}</div>
      <h1 className="text-4xl font-bold uppercase leading-none tracking-[-0.03em] md:text-6xl">
        {title}
      </h1>
      {children && (
        <div className="mt-[18px] max-w-[600px] text-[15px] leading-relaxed text-body">
          {children}
        </div>
      )}
    </div>
  );
}
