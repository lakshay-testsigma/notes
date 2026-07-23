import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getAllTopics, getDomain, getTopic } from "@/lib/content";
import { formatDate } from "@/lib/format";

export function generateStaticParams() {
  return getAllTopics().map((t) => ({ domain: t.domain, topic: t.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string; topic: string }>;
}): Promise<Metadata> {
  const { domain, topic } = await params;
  const meta = getTopic(domain, topic);
  return { title: meta?.title, description: meta?.summary };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ domain: string; topic: string }>;
}) {
  const { domain, topic } = await params;
  const meta = getTopic(domain, topic);
  if (!meta) notFound();

  const domainMeta = getDomain(domain);
  const { default: MDXContent } = await import(`@/content/${domain}/${topic}.mdx`);

  return (
    <article
      className="mx-auto w-full max-w-180 px-4 py-14 sm:px-6"
      style={{ "--domain": `var(${domainMeta?.accentVar ?? "--primary"})` } as React.CSSProperties}
    >
      <header className="mb-10">
        <Breadcrumb className="mb-6">
          <BreadcrumbList className="text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>Notes</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href={`/${domain}`} />}>
                {domainMeta?.label ?? domain}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-56 truncate">{meta.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-(--domain)">
          {domainMeta?.label ?? domain} · {meta.difficulty}
        </p>
        <h1 className="text-balance font-serif text-4xl/[1.15] font-semibold tracking-tight">
          {meta.title}
        </h1>
        <p className="mt-4 text-pretty font-serif text-lg/relaxed italic text-muted-foreground">
          {meta.summary}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-1.5">
          {meta.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
          <span className="ml-auto text-xs tabular-nums text-muted-foreground">
            Updated {formatDate(meta.updated)}
          </span>
        </div>
        <hr className="mt-8" />
      </header>

      <MDXContent />

      <footer className="mt-12 border-t pt-6">
        <Link
          href={`/${domain}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Back to {domainMeta?.label ?? domain}
        </Link>
      </footer>
    </article>
  );
}
