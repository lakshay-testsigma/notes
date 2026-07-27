"use client";

import { useEffect, useRef, useState } from "react";
import { StepControls } from "@/components/mdx/step-controls";
import { cn } from "@/lib/utils";

export interface StepItem {
  /** one emoji or glyph — the visual carries the meaning */
  icon: string;
  /** 1–3 words, never a sentence */
  label: string;
  /** one short line, shown only while this step is current */
  note?: string;
}

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--domain,var(--primary))";

/**
 * Slide-style reveal: steps light up one at a time, the way a deck advances.
 * Visual first — the icon is the content, the label is 1–3 words.
 */
export function Steps({
  items,
  caption,
  linked = true,
}: {
  items: StepItem[];
  caption?: string;
  /** false = an unordered set: no connectors, nothing dimmed, click to inspect */
  linked?: boolean;
}) {
  const [step, setStep] = useState(0);
  const currentRef = useRef<HTMLButtonElement>(null);
  const mounted = useRef(false);

  // The row scrolls horizontally on narrow screens — keep the active step in
  // view, but never yank the page on first paint.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    currentRef.current?.scrollIntoView({ inline: "nearest", block: "nearest" });
  }, [step]);

  if (items.length === 0) return null;
  const List = linked ? "ol" : "ul";

  return (
    <figure className="my-8">
      <div className="rounded-lg border bg-card p-4 shadow-xs sm:p-5">
        <List className="flex items-start gap-1 overflow-x-auto py-1">
          {items.map((item, i) => (
            <li key={i} className="flex shrink-0 items-start">
              {linked && i > 0 && (
                <span
                  aria-hidden
                  className={cn(
                    "mt-7 w-4 border-t border-dashed sm:w-6",
                    i <= step ? "border-(--domain,var(--primary))" : "border-border",
                  )}
                />
              )}
              <button
                type="button"
                ref={i === step ? currentRef : undefined}
                onClick={() => setStep(i)}
                aria-current={i === step ? (linked ? "step" : "true") : undefined}
                className={cn(
                  "w-20 rounded-lg px-1 py-2 text-center motion-safe:transition-colors sm:w-24",
                  FOCUS,
                  i === step ? "bg-(--domain,var(--primary))/12" : "hover:bg-muted",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "block text-3xl motion-safe:transition-all motion-safe:duration-200",
                    linked && i > step && "opacity-30",
                    i === step && "motion-safe:scale-115",
                  )}
                >
                  {item.icon}
                </span>
                <span
                  className={cn(
                    "mt-1.5 block text-xs leading-tight",
                    i === step ? "font-medium text-foreground" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </span>
              </button>
            </li>
          ))}
        </List>

        <StepControls step={step} total={items.length} onStep={setStep} note={items[step].note} />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
