"use client";

import { useState } from "react";
import { StepControls } from "@/components/mdx/step-controls";
import { cn } from "@/lib/utils";

export interface GitCommitNode {
  id: string;
  label: string;
  /** ids of parent commits — two parents renders a merge */
  parents?: string[];
  /** 0 = main line, 1+ = a branch off to the side */
  lane?: number;
  /** one-line narration shown while this commit is the current step */
  note?: string;
}

const PAD_Y = 22;
const PAD_X = 20;
const ROW_H = 52;
const LANE_W = 40;
const LABEL_W = 210;
const R = 9;

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--domain,var(--primary))";

/**
 * Step-through commit graph: click a checkpoint (or use prev/next) to replay
 * how a project history grows, branches off an old checkpoint, and merges back.
 */
export function GitGraph({
  commits,
  caption,
}: {
  commits: GitCommitNode[];
  caption?: string;
}) {
  const [step, setStep] = useState(0);
  if (commits.length === 0) return null;

  const pos = new Map(
    commits.map((c, i) => [
      c.id,
      { x: PAD_X + (c.lane ?? 0) * LANE_W, y: PAD_Y + i * ROW_H, index: i },
    ]),
  );
  const byId = new Map(commits.map((c) => [c.id, c]));
  const maxLane = Math.max(...commits.map((c) => c.lane ?? 0));
  const railW = PAD_X + maxLane * LANE_W + R;
  const height = PAD_Y * 2 + (commits.length - 1) * ROW_H;

  return (
    <figure className="my-8">
      <div className="rounded-lg border bg-card p-4 shadow-xs sm:p-5">
        <div className="overflow-x-auto">
          <div className="relative" style={{ height, minWidth: railW + 14 + LABEL_W }}>
            <svg
              width={railW + R}
              height={height}
              viewBox={`0 0 ${railW + R} ${height}`}
              className="absolute inset-y-0 left-0"
              aria-hidden
            >
              {commits.map((c) =>
                (c.parents ?? []).map((pid) => {
                  const a = pos.get(pid);
                  const b = pos.get(c.id);
                  if (!a || !b) return null;
                  const on = a.index <= step && b.index <= step;
                  const mid = (a.y + b.y) / 2;
                  const d =
                    a.x === b.x
                      ? `M ${a.x} ${a.y} L ${b.x} ${b.y}`
                      : `M ${a.x} ${a.y} C ${a.x} ${mid}, ${b.x} ${mid}, ${b.x} ${b.y}`;
                  return (
                    <path
                      key={`${pid}-${c.id}`}
                      d={d}
                      fill="none"
                      strokeWidth={2}
                      stroke="var(--domain, var(--primary))"
                      strokeDasharray={a.x === b.x ? undefined : "4 4"}
                      className={cn(
                        "motion-safe:transition-opacity motion-safe:duration-200",
                        on ? "opacity-40" : "opacity-0",
                      )}
                    />
                  );
                }),
              )}
              {commits.map((c, i) => {
                const p = pos.get(c.id)!;
                const seen = i <= step;
                const isMerge = (c.parents?.length ?? 0) > 1;
                return (
                  <g key={c.id}>
                    {i === step && (
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={R + 5}
                        fill="none"
                        stroke="var(--domain, var(--primary))"
                        strokeWidth={2}
                        className="opacity-35"
                      />
                    )}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={R}
                      fill={
                        seen
                          ? isMerge
                            ? "var(--card)"
                            : "var(--domain, var(--primary))"
                          : "var(--muted)"
                      }
                      stroke="var(--domain, var(--primary))"
                      strokeWidth={isMerge ? 3 : 0}
                      className={cn(
                        "motion-safe:transition-opacity motion-safe:duration-200",
                        seen ? "opacity-100" : "opacity-30",
                      )}
                    />
                  </g>
                );
              })}
            </svg>

            <ol>
              {commits.map((c, i) => {
                const p = pos.get(c.id)!;
                const parents = (c.parents ?? []).map((id) => byId.get(id)?.label ?? id);
                const isMerge = parents.length > 1;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => setStep(i)}
                      aria-current={i === step ? "step" : undefined}
                      aria-label={
                        isMerge ? `${c.label} — merges ${parents.join(" and ")}` : undefined
                      }
                      style={{ top: p.y - 14, left: railW + 14 }}
                      className={cn(
                        "absolute rounded-md px-2.5 py-1 text-left text-sm whitespace-nowrap",
                        "motion-safe:transition-colors",
                        FOCUS,
                        i > step && "text-muted-foreground",
                        i === step
                          ? "bg-(--domain,var(--primary))/12 font-medium text-foreground"
                          : "hover:bg-muted",
                      )}
                    >
                      {c.label}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <StepControls
          step={step}
          total={commits.length}
          onStep={setStep}
          note={commits[step].note}
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
