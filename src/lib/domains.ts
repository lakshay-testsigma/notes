// Pure data + types — safe to import from client components
// (lib/content.ts uses node:fs and is server-only).

export interface NoteMeta {
  title: string;
  summary: string;
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  updated: string;
  icon: string;
}

// Flat, serializable note reference — safe to pass to client components
// (command palette, topic rows, home lists).
export interface NoteItem extends NoteMeta {
  slugPath: string[]; // ["data-science", "ml", "regression", "simple-linear-regression"]
  href: string; // "/" + slugPath.join("/")
  domain: string; // slugPath[0] — grouping + accent color
}

export interface DomainInfo {
  slug: string;
  label: string;
  icon: string;
  blurb: string;
  accentVar: string;
}

// Known domains keep curated metadata; any other top-level content
// directory falls back to a humanized label via getDomainInfo().
export const DOMAIN_REGISTRY: Record<string, Omit<DomainInfo, "slug">> = {
  web: { label: "Web", icon: "🌐", blurb: "Browsers, frameworks, performance", accentVar: "--domain-web" },
  mobile: { label: "Mobile", icon: "📱", blurb: "iOS, Android, cross-platform", accentVar: "--domain-mobile" },
  "data-science": { label: "Data Science", icon: "🔬", blurb: "Stats, ML, experiments", accentVar: "--domain-data-science" },
  "data-analytics": { label: "Data Analytics", icon: "📊", blurb: "Metrics, dashboards, SQL", accentVar: "--domain-data-analytics" },
  "ai-engineering": { label: "AI Engineering", icon: "🤖", blurb: "LLMs, agents, evals", accentVar: "--domain-ai-engineering" },
};

const ACRONYMS = new Set(["ml", "dl", "cv", "nlp", "ai", "llm", "llms", "sql", "api", "css", "html", "js", "ts"]);

export function humanize(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => (ACRONYMS.has(w) ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

export function getDomainInfo(slug: string): DomainInfo {
  const known = DOMAIN_REGISTRY[slug];
  if (known) return { slug, ...known };
  return { slug, label: humanize(slug), icon: "📁", blurb: "", accentVar: "--primary" };
}
