"use client";

import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  lang?: string;
  title?: string;
  children: ReactNode;
}

export function CodeBlock({ lang, title, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const code = typeof children === "string" ? children : String(children ?? "");

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="my-6 overflow-hidden rounded-lg border bg-muted/40">
      <div className="flex items-center gap-2 border-b bg-muted py-1 pl-4 pr-1.5">
        <span className="truncate text-xs font-medium text-muted-foreground">{title}</span>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-wide text-muted-foreground/70">
          {lang}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 shrink-0 text-muted-foreground"
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          <span aria-live="polite" className="sr-only">
            {copied ? "Copied" : ""}
          </span>
        </Button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
