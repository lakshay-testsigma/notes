---
name: visual-toolkit
description: Pick and render the right visual (Mermaid diagram, recharts/Chart.js chart, KaTeX formula, or animated SVG) for a programming or data topic. Use when authoring, editing, or reviewing topic content and deciding how to show a concept visually instead of in prose.
---

# Visual toolkit

Goal: replace prose with the visual that explains a concept fastest. Pick from the table, then open the matching reference for exact syntax and the Next.js render pattern.

## Pick the visual

| The concept is about… | Use | Reference |
|---|---|---|
| process, flow, request lifecycle, architecture | Mermaid `flowchart`, `sequenceDiagram`, `stateDiagram-v2` | `references/mermaid.md` |
| entities, relationships, data models, types/classes | Mermaid `erDiagram`, `classDiagram` | `references/mermaid.md` |
| comparison, trend over time, distribution, share | recharts (bar/line/area/pie); Chart.js only when recharts can't | `references/charts.md` |
| a formula, equation, matrix, complexity notation | KaTeX (`$…$` inline, `$$…$$` block) | `references/math-katex.md` |
| roadmap, history, release timeline | Mermaid `timeline`, `gantt` | `references/mermaid.md` |
| hierarchy, mental map, topic overview | Mermaid `mindmap` | `references/mermaid.md` |
| tradeoffs, prioritisation (effort vs impact) | Mermaid `quadrantChart` | `references/mermaid.md` |
| how something behaves, "make it feel alive", micro-demo | animated SVG (SMIL/CSS) or gentle motion | `references/motion-svg.md` |
| steps/status/coverage without a chart lib | Unicode bars, emoji grid, or a small table | inline (no lib) |

Rules of thumb:
- **recharts is the default chart lib** (installed, RSC-friendly, shadcn wrapper). Reach for Chart.js only for a type/animation recharts lacks — see `references/charts.md`.
- A code example beats a paragraph about code. Always include one where a concept is implementable.
- Math anywhere → render with KaTeX, never plain text like `O(n^2)` in prose.

## Minimal-text rules (applies to every visual)

- **Labels, not sentences** inside diagrams. Node = a noun/verb, not a clause.
- **One idea per visual.** Split a busy diagram into two.
- **Shape carries meaning** (Mermaid): pill = start/end, diamond = decision, cylinder = datastore, subroutine = render/output. Be consistent across the app.
- **Color sparingly** — highlight the one node that matters; leave the rest neutral. Colors must work in light and dark themes.
- **Always caption** in one line ("What this shows: …"). The caption is the only prose a visual needs.
- Every visual must be legible on mobile and readable at a glance — if it needs study, simplify it.

## How rendering works here

Topics are MDX. Visuals are MDX components (`<Diagram>`, `<Chart>`, `<ChartJS>`, `<Formula>`, animated SVG inline). The reference files give the component contract and the Next.js-16 wiring (client component, dynamic import, theme sync). When authoring, you emit the component call; when building the app for the first time, the references tell you how to implement each component.
