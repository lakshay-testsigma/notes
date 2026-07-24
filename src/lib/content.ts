import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

import {
  DOMAIN_REGISTRY,
  getDomainInfo,
  humanize,
  type DomainInfo,
  type NoteItem,
  type NoteMeta,
} from "@/lib/domains";

export { getDomainInfo, humanize };
export type { DomainInfo, NoteItem, NoteMeta };

const CONTENT_DIR = path.join(process.cwd(), "src", "content");

export interface NoteNode {
  type: "branch" | "leaf";
  slugPath: string[];
  slug: string;
  href: string;
  meta: NoteMeta;
  hasIndex: boolean; // branch has its own index.mdx prose page
  children: NoteNode[]; // branches alpha by label, then leaves by updated desc
}

function parseMeta(file: string, fallbackTitle: string): NoteMeta {
  const raw = fs.readFileSync(file, "utf8");
  const { data } = matter(raw);
  return {
    title: String(data.title ?? fallbackTitle),
    summary: String(data.summary ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    difficulty: (data.difficulty ?? "beginner") as NoteMeta["difficulty"],
    // unquoted YAML dates parse as Date objects — normalize to string
    updated: String(data.updated ?? "").slice(0, 10),
    icon: String(data.icon ?? "📄"),
  };
}

function walk(dir: string, slugPath: string[]): NoteNode[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);
  const files = entries
    .filter((e) => e.isFile() && e.name.endsWith(".mdx") && e.name !== "index.mdx")
    .map((e) => e.name);

  for (const file of files) {
    const base = file.replace(/\.mdx$/, "");
    if (dirs.includes(base)) {
      throw new Error(
        `Ambiguous note path: "${path.join(dir, file)}" and directory "${path.join(dir, base)}/" ` +
          `map to the same URL. Move the file to "${path.join(dir, base, "index.mdx")}" or rename one.`,
      );
    }
  }

  const branches: NoteNode[] = dirs.map((name) => {
    const childPath = [...slugPath, name];
    const children = walk(path.join(dir, name), childPath);
    const indexFile = path.join(dir, name, "index.mdx");
    const hasIndex = fs.existsSync(indexFile);
    const meta: NoteMeta = hasIndex
      ? parseMeta(indexFile, humanize(name))
      : {
          title: childPath.length === 1 ? getDomainInfo(name).label : humanize(name),
          summary: "",
          tags: [],
          difficulty: "beginner",
          updated: children.reduce((max, c) => (c.meta.updated > max ? c.meta.updated : max), ""),
          icon: childPath.length === 1 ? getDomainInfo(name).icon : "📁",
        };
    return {
      type: "branch",
      slugPath: childPath,
      slug: name,
      href: `/${childPath.join("/")}`,
      meta,
      hasIndex,
      children,
    };
  });

  const leaves: NoteNode[] = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const childPath = [...slugPath, slug];
    return {
      type: "leaf",
      slugPath: childPath,
      slug,
      href: `/${childPath.join("/")}`,
      meta: parseMeta(path.join(dir, file), slug),
      hasIndex: false,
      children: [],
    };
  });

  branches.sort((a, b) => a.meta.title.localeCompare(b.meta.title));
  leaves.sort((a, b) => b.meta.updated.localeCompare(a.meta.updated));
  return [...branches, ...leaves];
}

// Content is static at build time — walk once per server process.
let treeCache: NoteNode[] | null = null;
let flatCache: Map<string, NoteNode> | null = null;

export function getTree(): NoteNode[] {
  if (treeCache) return treeCache;
  const walked = fs.existsSync(CONTENT_DIR) ? walk(CONTENT_DIR, []) : [];
  // Registry domains without a content directory still get a (empty) branch
  // node so their route exists and renders the empty state.
  const present = new Set(walked.map((n) => n.slug));
  const missing: NoteNode[] = Object.keys(DOMAIN_REGISTRY)
    .filter((slug) => !present.has(slug))
    .map((slug) => {
      const info = getDomainInfo(slug);
      return {
        type: "branch",
        slugPath: [slug],
        slug,
        href: `/${slug}`,
        meta: { title: info.label, summary: "", tags: [], difficulty: "beginner", updated: "", icon: info.icon },
        hasIndex: false,
        children: [],
      };
    });
  treeCache = [...walked, ...missing];
  return treeCache;
}

function getFlatMap(): Map<string, NoteNode> {
  if (flatCache) return flatCache;
  const map = new Map<string, NoteNode>();
  const visit = (nodes: NoteNode[]) => {
    for (const node of nodes) {
      map.set(node.slugPath.join("/"), node);
      visit(node.children);
    }
  };
  visit(getTree());
  flatCache = map;
  return map;
}

export function getNode(slugPath: string[]): NoteNode | null {
  return getFlatMap().get(slugPath.join("/")) ?? null;
}

export function getBreadcrumbs(slugPath: string[]): { label: string; href: string }[] {
  const crumbs: { label: string; href: string }[] = [{ label: "Notes", href: "/" }];
  for (let i = 1; i <= slugPath.length; i++) {
    const ancestor = slugPath.slice(0, i);
    const node = getNode(ancestor);
    crumbs.push({
      label: node?.meta.title ?? humanize(ancestor[i - 1]),
      href: `/${ancestor.join("/")}`,
    });
  }
  return crumbs;
}

function toItem(node: NoteNode): NoteItem {
  return {
    ...node.meta,
    slugPath: node.slugPath,
    href: node.href,
    domain: node.slugPath[0],
  };
}

export function getAllLeaves(): NoteItem[] {
  const leaves: NoteItem[] = [];
  for (const node of getFlatMap().values()) {
    if (node.type === "leaf") leaves.push(toItem(node));
  }
  return leaves.sort((a, b) => b.updated.localeCompare(a.updated));
}

export function countLeaves(node: NoteNode): number {
  if (node.type === "leaf") return 1;
  return node.children.reduce((sum, c) => sum + countLeaves(c), 0);
}

export function getAllParams(): { slug: string[] }[] {
  return [...getFlatMap().values()].map((node) => ({ slug: node.slugPath }));
}

export function getDomains(): (DomainInfo & { count: number })[] {
  const topLevel = getTree();
  const bySlug = new Map(topLevel.map((n) => [n.slug, n]));
  // Registry domains first (curated order), then any extra content dirs.
  const slugs = [
    ...Object.keys(DOMAIN_REGISTRY),
    ...topLevel.map((n) => n.slug).filter((s) => !(s in DOMAIN_REGISTRY)),
  ];
  return slugs.map((slug) => {
    const node = bySlug.get(slug);
    return { ...getDomainInfo(slug), count: node ? countLeaves(node) : 0 };
  });
}
