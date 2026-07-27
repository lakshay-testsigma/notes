"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTheme } from "next-themes";

export function Diagram({ chart, caption }: { chart: string; caption?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, "");
  const { resolvedTheme } = useTheme();
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: resolvedTheme === "dark" ? "dark" : "base",
          themeVariables: { fontFamily: "var(--font-sans)", fontSize: "14px" },
        });
        const { svg } = await mermaid.render(`m-${id}`, chart);
        if (alive && ref.current) {
          ref.current.innerHTML = svg;
          setReady(true);
        }
      } catch {
        if (alive) setFailed(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [chart, resolvedTheme, id]);

  if (failed) {
    return (
      <pre className="my-6 overflow-x-auto rounded-lg border bg-muted/50 p-4 font-mono text-xs">
        {chart.trim()}
      </pre>
    );
  }

  return (
    <figure className="my-6 flex flex-col items-center gap-2">
      {/* Reserve space while mermaid loads, then let the SVG set its own height. */}
      <div
        ref={ref}
        className={`w-full overflow-x-auto [&_svg]:mx-auto ${ready ? "" : "min-h-40"}`}
      />
      {caption && <figcaption className="text-sm text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}
