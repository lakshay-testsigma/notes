// Pure data + types — safe to import from client components
// (lib/content.ts uses node:fs and is server-only).

export const DOMAINS = [
  { slug: "web", label: "Web", icon: "🌐", blurb: "Browsers, frameworks, performance", accentVar: "--domain-web" },
  { slug: "mobile", label: "Mobile", icon: "📱", blurb: "iOS, Android, cross-platform", accentVar: "--domain-mobile" },
  { slug: "data-science", label: "Data Science", icon: "🔬", blurb: "Stats, ML, experiments", accentVar: "--domain-data-science" },
  { slug: "data-analytics", label: "Data Analytics", icon: "📊", blurb: "Metrics, dashboards, SQL", accentVar: "--domain-data-analytics" },
  { slug: "ai-engineering", label: "AI Engineering", icon: "🤖", blurb: "LLMs, agents, evals", accentVar: "--domain-ai-engineering" },
] as const;

export type DomainSlug = (typeof DOMAINS)[number]["slug"];

export function getDomain(slug: string) {
  return DOMAINS.find((d) => d.slug === slug) ?? null;
}

export interface TopicMeta {
  title: string;
  domain: string;
  slug: string;
  summary: string;
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  updated: string;
  icon: string;
}
