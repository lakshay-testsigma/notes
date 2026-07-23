# Notes — a visual-first learning notebook

Personal learning notebook for programming and research topics. Each topic renders as a blog-style page designed to be grasped in seconds: every concept is paired with a visual (diagram, chart, formula, or code example) and a one-line explanation. Prose is the caption, not the content.

Public app, no auth, no database — content is plain MDX files in the repo.

## Stack

- **Next.js 16** (App Router, RSC, Turbopack) · **React 19** · **TypeScript**
- **Tailwind v4** + **shadcn/ui** (base-nova) for chrome
- **MDX** via `@next/mdx` — remark-gfm, remark-math, rehype-katex wired as Turbopack-safe string plugins
- **Mermaid** (diagrams) · **recharts** (charts, default) · **Chart.js** (charts recharts can't do) · **KaTeX** (formulas)
- **next-themes** (light default + dark toggle) · **cmdk** (⌘K command palette) · **zustand** (UI state)
- Typography: **Newsreader** serif for display/headings, **Geist** for body, **Geist Mono** for code

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build — all routes prerender statically
```

## How it works

```text
src/
  app/
    page.tsx                    # home: hero + domain grid + latest topics
    [domain]/page.tsx           # topic list for a domain
    [domain]/[topic]/page.tsx   # blog reader (centered 720px column)
  content/<domain>/<slug>.mdx   # the notes — one MDX file per topic
  components/
    mdx/                        # Diagram · Chart · ChartJS · Formula · Callout · CodeBlock · Analogy · TLDR
    ui/                         # shadcn components
    topic-row.tsx               # shared topic list row
    command-palette.tsx         # ⌘K search across all topics
  lib/
    content.ts                  # fs + gray-matter: frontmatter → topic index (no DB)
    domains.ts                  # domain registry + accent hues (client-safe)
  store/ui.ts                   # zustand UI state
  mdx-components.tsx            # global MDX component + prose-style mapping
```

Routes are fully static: `generateStaticParams` + `dynamicParams = false` — every topic prerenders at build time, unknown slugs 404.

## Content model

Domains: `web` · `mobile` · `data-science` · `data-analytics` · `ai-engineering`. Each domain has its own accent hue used across topic rows, cards, and article eyebrows.

Every topic starts with frontmatter:

```yaml
---
title: "Web Vitals in React — measure what users actually feel"
domain: "web"
summary: "One line — what you grasp in 30 seconds."
tags: ["react", "performance"]
difficulty: "intermediate"   # beginner | intermediate | advanced
updated: "2026-07-23"        # quote it — unquoted YAML dates break
icon: "⚡"
---
```

Inside a note, compose the MDX components (no imports needed — mapped globally):

| Component | Use for |
| --- | --- |
| `<Analogy>` | one-sentence hook before any definition |
| `<TLDR>` | 3–5 bullets readable in 10 seconds |
| `<Diagram chart caption />` | Mermaid flowcharts, sequences, state machines |
| `<Chart data valueLabel caption />` | bar chart (recharts) |
| `<Formula tex caption />` | KaTeX equation with plain-language reading |
| `<CodeBlock lang title>` | code with copy button |
| `<Callout type>` | tips and gotchas (`tip`, `info`, `warning`) |

Inline/block math also works directly: `$O(n \log n)$` or `$$…$$`.

## Adding a topic

1. **Fast path** — write a brief in `spec/<name>.md` (topic, domain, key points, depth), then ask Claude Code to author it (`author-topic` skill).
2. **Manual** — drop an `.mdx` file under `src/content/<domain>/` following the frontmatter + component conventions above. It appears on the home page, the domain page, and in ⌘K search automatically — no registration step.

## Design

- White/light default, dark toggle (next-themes, class strategy)
- Editorial serif display (Newsreader) over a quiet sans body (Geist)
- Per-domain accent hues, defined for light and dark in `globals.css`
- Centered ~720px reading column, calm transitions, `prefers-reduced-motion` honored
- Claude Code workflow (skills, sub-agent reviewers, project conventions) lives in `.claude/`
