import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NoteBreadcrumb } from "@/components/note-breadcrumb";
import { BranchRow, TopicRow } from "@/components/topic-row";
import {
  countLeaves,
  getAllParams,
  getBreadcrumbs,
  getDomainInfo,
  getNode,
  type NoteNode,
} from "@/lib/content";
import { formatDate } from "@/lib/format";

export function generateStaticParams() {
  return getAllParams();
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const node = getNode(slug);
  return { title: node?.meta.title, description: node?.meta.summary || undefined };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const node = getNode(slug);
  if (!node) notFound();

  return node.type === "leaf" ? <LeafView node={node} /> : <BranchView node={node} />;
}

function accentStyle(slugPath: string[]) {
  return {
    "--domain": `var(${getDomainInfo(slugPath[0]).accentVar})`,
  } as React.CSSProperties;
}

async function LeafView({ node }: { node: NoteNode }) {
  const crumbs = getBreadcrumbs(node.slugPath);
  const parent = crumbs[crumbs.length - 2];
  const domainInfo = getDomainInfo(node.slugPath[0]);
  const { default: MDXContent } = await import(`@/content/${node.slugPath.join("/")}.mdx`);

  return (
    <article className="mx-auto w-full max-w-180 px-4 py-14 sm:px-6" style={accentStyle(node.slugPath)}>
      <header className="mb-10">
        <NoteBreadcrumb crumbs={crumbs} className="mb-6" />
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-(--domain)">
          {domainInfo.label} · {node.meta.difficulty}
        </p>
        <h1 className="text-balance font-serif text-4xl/[1.15] font-semibold tracking-tight">
          {node.meta.title}
        </h1>
        {node.meta.summary && (
          <p className="mt-4 text-pretty font-serif text-lg/relaxed italic text-muted-foreground">
            {node.meta.summary}
          </p>
        )}
        <div className="mt-5 flex flex-wrap items-center gap-1.5">
          {node.meta.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
          <span className="ml-auto text-xs tabular-nums text-muted-foreground">
            Updated {formatDate(node.meta.updated)}
          </span>
        </div>
        <hr className="mt-8" />
      </header>

      <MDXContent />

      <footer className="mt-12 border-t pt-6">
        <Link
          href={parent.href}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Back to {parent.label}
        </Link>
      </footer>
    </article>
  );
}

async function BranchView({ node }: { node: NoteNode }) {
  const crumbs = getBreadcrumbs(node.slugPath);
  const isDomain = node.slugPath.length === 1;
  const domainInfo = getDomainInfo(node.slugPath[0]);
  const noteCount = countLeaves(node);

  const branches = node.children.filter((c) => c.type === "branch");
  const leaves = node.children.filter((c) => c.type === "leaf");

  const IndexContent = node.hasIndex
    ? (await import(`@/content/${node.slugPath.join("/")}/index.mdx`)).default
    : null;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6" style={accentStyle(node.slugPath)}>
      <header className="mb-10">
        {!isDomain && <NoteBreadcrumb crumbs={crumbs} className="mb-6" />}
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-(--domain)">
          {isDomain ? "Domain" : domainInfo.label}
        </p>
        <h1 className="flex items-center gap-3 text-balance font-serif text-4xl/[1.15] font-semibold tracking-tight">
          <span
            aria-hidden
            className="flex size-11 items-center justify-center rounded-lg bg-(--domain)/10 text-xl"
          >
            {node.meta.icon}
          </span>
          {node.meta.title}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {(isDomain ? domainInfo.blurb : node.meta.summary) &&
            `${isDomain ? domainInfo.blurb : node.meta.summary} · `}
          {noteCount} {noteCount === 1 ? "note" : "notes"}
        </p>
      </header>

      {IndexContent && (
        <div className="mx-auto mb-10 max-w-180">
          <IndexContent />
          <hr className="mt-10" />
        </div>
      )}

      {node.children.length === 0 ? (
        <div className="rounded-lg border border-dashed px-6 py-12 text-center text-muted-foreground">
          No notes here yet. Drop a brief in <code className="font-mono text-sm">spec/</code> and
          ask Claude to author one.
        </div>
      ) : (
        <div className="flex flex-col divide-y">
          {branches.map((child) => (
            <BranchRow
              key={child.href}
              item={{
                title: child.meta.title,
                summary: child.meta.summary,
                icon: child.meta.icon,
                href: child.href,
                domain: child.slugPath[0],
                count: countLeaves(child),
              }}
            />
          ))}
          {leaves.map((child) => (
            <TopicRow
              key={child.href}
              item={{
                ...child.meta,
                slugPath: child.slugPath,
                href: child.href,
                domain: child.slugPath[0],
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
