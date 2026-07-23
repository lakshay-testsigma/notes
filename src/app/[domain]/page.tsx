import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicList } from "@/components/topic-row";
import { DOMAINS, getDomain, getTopicsByDomain } from "@/lib/content";

export function generateStaticParams() {
  return DOMAINS.map((d) => ({ domain: d.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>;
}): Promise<Metadata> {
  const { domain } = await params;
  const meta = getDomain(domain);
  return { title: meta?.label, description: meta?.blurb };
}

export default async function DomainPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const meta = getDomain(domain);
  if (!meta) notFound();

  const topics = getTopicsByDomain(domain);

  return (
    <div
      className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6"
      style={{ "--domain": `var(${meta.accentVar})` } as React.CSSProperties}
    >
      <header className="mb-10">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-(--domain)">
          Domain
        </p>
        <h1 className="flex items-center gap-3 text-balance font-serif text-4xl/[1.15] font-semibold tracking-tight">
          <span
            aria-hidden
            className="flex size-11 items-center justify-center rounded-lg bg-(--domain)/10 text-xl"
          >
            {meta.icon}
          </span>
          {meta.label}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {meta.blurb} · {topics.length} {topics.length === 1 ? "topic" : "topics"}
        </p>
      </header>

      {topics.length === 0 ? (
        <div className="rounded-lg border border-dashed px-6 py-12 text-center text-muted-foreground">
          No topics here yet. Drop a brief in <code className="font-mono text-sm">spec/</code> and
          ask Claude to author one.
        </div>
      ) : (
        <TopicList topics={topics} />
      )}
    </div>
  );
}
