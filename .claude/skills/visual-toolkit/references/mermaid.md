# Mermaid — diagrams

Text-defined diagrams. Best for flows, relationships, lifecycles, hierarchies. Keep labels short.

## Render pattern (Next.js 16, RSC)

Mermaid is browser-only → wrap in a **client component**, load it dynamically, and sync the theme with `next-themes`.

```tsx
// src/components/mdx/Diagram.tsx
"use client";
import { useEffect, useRef, useId } from "react";
import { useTheme } from "next-themes";

export function Diagram({ chart, caption }: { chart: string; caption?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, "");
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    let alive = true;
    (async () => {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: resolvedTheme === "dark" ? "dark" : "base",
        themeVariables: { fontFamily: "var(--font-sans)", fontSize: "14px" },
      });
      const { svg } = await mermaid.render(`m-${id}`, chart);
      if (alive && ref.current) ref.current.innerHTML = svg;
    })();
    return () => { alive = false; };
  }, [chart, resolvedTheme, id]);

  return (
    <figure className="my-6 flex flex-col items-center gap-2">
      <div ref={ref} className="w-full overflow-x-auto [&_svg]:mx-auto" />
      {caption && <figcaption className="text-sm text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}
```

Usage in MDX:

````mdx
<Diagram caption="Login request lifecycle" chart={`
flowchart TD
  A([Start]) --> B{Logged in?}
  B -->|Yes| C[Dashboard]
  B -->|No| D[Login]
  D --> E{Valid?}
  E -->|No| D
  E -->|Yes| C
`} />
````

## Diagram catalog (pick by intent)

- **flowchart** — process, branching logic, architecture. Shapes: `([pill])` start/end, `{diamond}` decision, `[(cylinder)]` datastore, `[[subroutine]]` render.
- **sequenceDiagram** — who-calls-whom over time. Use `autonumber`, activation bars, `alt`/`loop`.
- **stateDiagram-v2** — UI/request lifecycle, finite states. Supports nested states.
- **erDiagram** — data model, keys, crow-foot cardinality.
- **classDiagram** — types, inheritance, interfaces.
- **timeline** / **gantt** — history / roadmap. `gantt` supports `after` deps + milestones.
- **mindmap** — topic overview, auto-radial. Indentation is the whole syntax.
- **quadrantChart** — effort-vs-impact style prioritisation.

Animated edges (Mermaid 11.3+) exist (`a@-->` + `a@{ animate: true }`) — use sparingly, only when motion clarifies flow direction.

## Minimal-text discipline

- Node text ≤ 3–4 words. Move detail to the caption.
- ≤ ~8 nodes per flowchart; split if bigger.
- Highlight one node with `style X fill:...` — keep the rest default so it survives both themes.
- One diagram answers one question. Name that question in the caption.
