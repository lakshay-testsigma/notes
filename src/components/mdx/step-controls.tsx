"use client";

import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Shared prev / next / restart bar + live note line for the stepper visuals. */
export function StepControls({
  step,
  total,
  onStep,
  note,
}: {
  step: number;
  total: number;
  onStep: (next: number) => void;
  note?: string;
}) {
  return (
    <div className="mt-3 flex items-center gap-2 border-t pt-3">
      <Button
        variant="outline"
        size="icon"
        className="size-8"
        onClick={() => onStep(Math.max(0, step - 1))}
        disabled={step === 0}
        aria-label="Previous"
      >
        <ChevronLeft className="size-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="size-8"
        onClick={() => onStep(Math.min(total - 1, step + 1))}
        disabled={step === total - 1}
        aria-label="Next"
      >
        <ChevronRight className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-8 text-muted-foreground"
        onClick={() => onStep(0)}
        aria-label="Back to the start"
      >
        <RotateCcw className="size-3.5" />
      </Button>
      <p aria-live="polite" className="ml-1 min-w-0 flex-1 text-sm text-muted-foreground">
        <span className="mr-2 font-mono text-xs tabular-nums">
          {step + 1}/{total}
        </span>
        {note}
      </p>
    </div>
  );
}
