import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getDomain } from "@/lib/domains";
import type { TopicMeta } from "@/lib/domains";
import { formatDate } from "@/lib/format";

export function TopicRow({ topic }: { topic: TopicMeta }) {
  const domain = getDomain(topic.domain);
  return (
    <Link
      href={`/${topic.domain}/${topic.slug}`}
      style={{ "--domain": `var(${domain?.accentVar ?? "--primary"})` } as React.CSSProperties}
      className="group flex items-stretch gap-4 rounded-md px-3 py-4 transition-colors hover:bg-muted/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--domain)"
    >
      <span aria-hidden className="w-0.5 shrink-0 rounded-full bg-(--domain)/70" />
      <span className="min-w-0 flex-1">
        <span className="block font-medium leading-snug group-hover:underline group-hover:underline-offset-4">
          {topic.title}
        </span>
        <span className="mt-1 block truncate text-sm text-muted-foreground">
          {topic.summary}
        </span>
      </span>
      <span className="hidden shrink-0 flex-col items-end justify-center gap-1 sm:flex">
        <Badge variant="outline" className="capitalize">
          {topic.difficulty}
        </Badge>
        <span className="text-xs tabular-nums text-muted-foreground">
          {formatDate(topic.updated)}
        </span>
      </span>
    </Link>
  );
}

export function TopicList({ topics }: { topics: TopicMeta[] }) {
  return (
    <div className="flex flex-col divide-y">
      {topics.map((topic) => (
        <TopicRow key={`${topic.domain}/${topic.slug}`} topic={topic} />
      ))}
    </div>
  );
}
