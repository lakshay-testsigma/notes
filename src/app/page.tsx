import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchTrigger } from "@/components/command-palette";
import { TopicList } from "@/components/topic-row";
import { DOMAINS, getAllTopics } from "@/lib/content";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
      {children}
    </h2>
  );
}

export default function Home() {
  const topics = getAllTopics();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
      <section className="mb-16 flex max-w-2xl flex-col items-start gap-5">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Visual-first learning notebook
        </p>
        <h1 className="text-balance font-serif text-4xl/[1.15] font-semibold tracking-tight sm:text-5xl/[1.12]">
          Grasp a topic in seconds.
        </h1>
        <p className="text-lg text-muted-foreground">
          Every concept gets a diagram, chart, or code example — prose is just the caption.
        </p>
        <SearchTrigger />
      </section>

      <section className="mb-16">
        <SectionLabel>Domains</SectionLabel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DOMAINS.map((domain) => {
            const count = topics.filter((t) => t.domain === domain.slug).length;
            return (
              <Link
                key={domain.slug}
                href={`/${domain.slug}`}
                style={{ "--domain": `var(${domain.accentVar})` } as React.CSSProperties}
                className="group rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--domain)"
              >
                <Card className="h-full transition-colors group-hover:border-(--domain)/40">
                  <CardHeader>
                    <span
                      aria-hidden
                      className="mb-1 flex size-10 items-center justify-center rounded-lg bg-(--domain)/10 text-lg"
                    >
                      {domain.icon}
                    </span>
                    <CardTitle className="text-base">{domain.label}</CardTitle>
                    <CardDescription className="flex flex-col gap-1.5">
                      {domain.blurb}
                      <span className="text-xs">
                        {count} {count === 1 ? "topic" : "topics"}
                      </span>
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {topics.length > 0 && (
        <section>
          <SectionLabel>Latest topics</SectionLabel>
          <TopicList topics={topics} />
        </section>
      )}
    </div>
  );
}
