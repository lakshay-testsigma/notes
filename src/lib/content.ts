import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

import { DOMAINS, getDomain, type TopicMeta } from "@/lib/domains";

export { DOMAINS, getDomain };
export type { TopicMeta, DomainSlug } from "@/lib/domains";

const CONTENT_DIR = path.join(process.cwd(), "src", "content");

export function getAllTopics(): TopicMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((entry) => fs.statSync(path.join(CONTENT_DIR, entry)).isDirectory())
    .flatMap((domain) =>
      fs
        .readdirSync(path.join(CONTENT_DIR, domain))
        .filter((file) => file.endsWith(".mdx"))
        .map((file) => {
          const raw = fs.readFileSync(path.join(CONTENT_DIR, domain, file), "utf8");
          const { data } = matter(raw);
          return {
            title: String(data.title ?? file),
            summary: String(data.summary ?? ""),
            tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
            difficulty: (data.difficulty ?? "beginner") as TopicMeta["difficulty"],
            // unquoted YAML dates parse as Date objects — normalize to string
            updated: String(data.updated ?? "").slice(0, 10),
            icon: String(data.icon ?? "📄"),
            domain,
            slug: file.replace(/\.mdx$/, ""),
          } satisfies TopicMeta;
        }),
    )
    .sort((a, b) => b.updated.localeCompare(a.updated));
}

export function getTopicsByDomain(domain: string): TopicMeta[] {
  return getAllTopics().filter((t) => t.domain === domain);
}

export function getTopic(domain: string, slug: string): TopicMeta | null {
  return getAllTopics().find((t) => t.domain === domain && t.slug === slug) ?? null;
}
