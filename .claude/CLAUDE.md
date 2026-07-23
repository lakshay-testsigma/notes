@AGENTS.md

# notes — visual-first learning app

Personal learning notebook. User drops programming/research topics (web, mobile, data-science, data-analytics, ai-engineering); each renders as a **blog-style page that is grasped in seconds**. Public app, **no auth**.

## Golden rule — visuals carry the load, text is minimal

Teach an engineer and a toddler at once. **Every concept pairs with a visual** (diagram, chart, formula, or code) plus a one-line explanation. Prose is the caption, not the content. If a section is a wall of text, it is wrong — convert it to a diagram, table, or code example.

- Lead each topic with a hook: an analogy or a TL;DR diagram.
- One idea per visual. Labels, not sentences, inside diagrams.
- Prefer a real code example over describing code in words.
- Complex topic → add an analogy + a real-world example.

## Stack (already scaffolded)

Next.js 16 (App Router, RSC) · React 19 · TypeScript · Tailwind v4 · shadcn (`base-nova`, neutral) · `next-themes`, `cmdk`, `sonner`, `recharts`, `lucide-react`, `tw-animate-css` installed.

**To add later, on first build:** `zustand` (UI state) · MDX pipeline (`@next/mdx` or `next-mdx-remote` — check Next-16 docs first) · `remark-math` + `rehype-katex` + `katex` (formulas) · `mermaid` (diagrams) · `chart.js` + `react-chartjs-2` (charts recharts can't do). Import alias: `@/*` → `./src/*` (e.g. `@/components/ui/button`, `@/lib/utils`; see `tsconfig.json`).

> **Next 16 caveat** (see `@AGENTS.md`): read `node_modules/next/dist/docs/` before writing any Next code. APIs differ from training data.

## Content model — one MDX file per topic

```
src/content/<domain>/<topic-slug>.mdx
```

Domains (extensible): `web` · `mobile` · `data-science` · `data-analytics` · `ai-engineering`.

Frontmatter (every topic):

```yaml
---
title: "React re-renders explained"
domain: "web"
summary: "One line — what you grasp in 30 seconds."
tags: ["react", "performance"]
difficulty: "beginner"        # beginner | intermediate | advanced
updated: "2026-07-23"
icon: "⚛️"
---
```

## Adding / editing content

1. **Fast path** — write a brief in `spec/<name>.md` (topic, domain, key points, depth). Then ask Claude to author it: it runs the `author-topic` skill.
2. **Manual** — drop/edit an `.mdx` file under `src/content/<domain>/`, composing the MDX components below.

## Target structure (build later)

```
src/
  app/
    page.tsx               # home: domain grid + command-palette search
    [domain]/page.tsx      # topic list for a domain
    [domain]/[topic]/page.tsx   # blog reader (centered column)
  content/<domain>/*.mdx   # the notes
  components/
    mdx/                   # Diagram Chart ChartJS Formula Callout CodeBlock Analogy TLDR
    ui/                    # shadcn (installed)
  store/ui.ts              # zustand UI state
  lib/content.ts           # glob MDX frontmatter → index (no DB)
```

## UI principles

- **White/light default + dark toggle** via shadcn CSS vars. Use `next-themes` for the theme class (avoids hydration flash).
- **Centered reading column** ~720px for topics; wider grid on home. Content is comfortable and low-effort to read.
- **Minimal fixed shader/gradient background** — subtle, behind content, never distracting; honor `prefers-reduced-motion`.
- Chrome uses shadcn components (don't reinvent). Interactions "alive but calm": gentle transitions, no motion that competes with reading.

## State — `useUIStore` (Zustand)

UI/client state only (content stays file-based): `sidebarOpen`, `searchQuery`, `activeDomain`, `commandOpen`, `tocActiveId`. Theme lives in `next-themes`; mirror into the store only if a component needs it. Persist nothing but user preferences.

## Workflow pointers (don't inline the detail — load on demand)

- Choosing which visual for a concept → **`visual-toolkit`** skill.
- Turning a spec into an MDX topic → **`author-topic`** skill.
- Building/styling app UI → **`frontend-design`** skill; checking UI against web best practices → **`web-design-guidelines`** skill.
- After generating a topic → run the **`content-reviewer`** sub-agent. After UI changes → run **`ui-reviewer`**. Apply their fixes before finishing.
