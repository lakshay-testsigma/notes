---
name: author-topic
description: Turn a spec brief (spec/*.md) or a topic request into a visual-first MDX learning note under src/content/. Use when the user asks to add, generate, or update a topic/note, or points at a file in the spec/ folder.
---

# Author a topic

Produce one MDX note that a reader grasps in seconds: visual-first, minimal prose, a code example per concept. Then self-review.

## Steps

1. **Read the input.** A `spec/<name>.md` brief, or the user's request. Extract: topic, domain, key points, target depth/difficulty, any must-cover items.
2. **Place it.** Pick `domain` (`web` | `mobile` | `data-science` | `data-analytics` | `ai-engineering`) and a kebab-case slug → `src/content/<domain>/<slug>.mdx`.
3. **Fill frontmatter** (see `../../CLAUDE.md` for schema): `title`, `domain`, `summary` (one line), `tags`, `difficulty`, `updated` (today), `icon`.
4. **Draft visual-first** using the template `templates/topic.mdx` and the `visual-toolkit` skill to choose each visual:
   - Open with a hook — an `<Analogy>` or a lead `<Diagram>` — before any definition.
   - A `<TLDR>` with 3–5 bullets someone could read in 10 seconds.
   - Concept blocks: each = a ≤2-line explanation **+ a visual** (diagram/chart/formula) **+ a code example** where implementable.
   - Math → KaTeX. Data/comparison → chart. Process/relationship → Mermaid.
   - Complex topic → add a real-world example and an analogy.
   - Close with a "In 30 seconds" recap (bullets or a mindmap).
5. **Trim.** Delete any paragraph that a visual, table, or code block could replace. Prose is captions.
6. **Self-review (required).** Run the `content-reviewer` sub-agent on the new file, and `ui-reviewer` if you touched components/layout. Apply their fixes, then stop.

## Topic anatomy checklist

- [ ] Frontmatter complete + valid; `updated` is today.
- [ ] Hook (analogy or diagram) before the first definition.
- [ ] `<TLDR>` present, ≤5 bullets.
- [ ] A visual appears within the first screenful.
- [ ] Every major concept has a visual **or** code example.
- [ ] At least one runnable/realistic code example.
- [ ] Math (if any) rendered via KaTeX, with a plain-language reading.
- [ ] Real-world example + analogy for anything complex.
- [ ] Every visual has a one-line caption; no wall of text anywhere.
- [ ] "In 30 seconds" recap at the end.

## Notes

- Match the domain's flavor: web/mobile lean on code + sequence/flow diagrams; data-science/analytics lean on charts + formulas; AI engineering blends formulas, architecture diagrams, and code.
- Reuse existing MDX components; don't invent new visual components inside a note.
- Keep the note self-contained — a reader should never need another page to understand it.
