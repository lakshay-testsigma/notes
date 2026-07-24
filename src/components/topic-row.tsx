import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getDomainInfo, type NoteItem } from "@/lib/domains";
import { formatDate } from "@/lib/format";

export function TopicRow({ item }: { item: NoteItem }) {
  const domain = getDomainInfo(item.domain);
  return (
    <Link
      href={item.href}
      style={{ "--domain": `var(${domain.accentVar})` } as React.CSSProperties}
      className="group flex items-stretch gap-4 rounded-md px-3 py-4 transition-colors hover:bg-muted/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--domain)"
    >
      <span aria-hidden className="flex w-9 shrink-0 justify-center">
        <span className="w-0.5 rounded-full bg-(--domain)/70" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-medium leading-snug group-hover:underline group-hover:underline-offset-4">
          {item.title}
        </span>
        <span className="mt-1 block truncate text-sm text-muted-foreground">
          {item.summary}
        </span>
      </span>
      <span className="hidden shrink-0 flex-col items-end justify-center gap-1 sm:flex">
        <Badge variant="outline" className="capitalize">
          {item.difficulty}
        </Badge>
        <span className="text-xs tabular-nums text-muted-foreground">
          {formatDate(item.updated)}
        </span>
      </span>
    </Link>
  );
}

export interface BranchRowItem {
  title: string;
  summary: string;
  icon: string;
  href: string;
  domain: string; // top-level slug, for accent
  count: number; // notes under this folder (all descendants)
}

export function BranchRow({ item }: { item: BranchRowItem }) {
  const domain = getDomainInfo(item.domain);
  return (
    <Link
      href={item.href}
      style={{ "--domain": `var(${domain.accentVar})` } as React.CSSProperties}
      className="group flex items-center gap-4 rounded-md px-3 py-4 transition-colors hover:bg-muted/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--domain)"
    >
      <span
        aria-hidden
        className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-(--domain)/10 text-base"
      >
        {item.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-medium leading-snug group-hover:underline group-hover:underline-offset-4">
          {item.title}
        </span>
        <span className="mt-1 block truncate text-sm text-muted-foreground">
          {item.summary || `${item.count} ${item.count === 1 ? "note" : "notes"} inside`}
        </span>
      </span>
      <span className="hidden shrink-0 items-center gap-2 text-xs tabular-nums text-muted-foreground sm:flex">
        {item.count} {item.count === 1 ? "note" : "notes"}
        <ChevronRight className="size-3.5 opacity-50" aria-hidden />
      </span>
    </Link>
  );
}

export function TopicList({ items }: { items: NoteItem[] }) {
  return (
    <div className="flex flex-col divide-y">
      {items.map((item) => (
        <TopicRow key={item.href} item={item} />
      ))}
    </div>
  );
}
