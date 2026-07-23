import type { ReactNode } from "react";

export function TLDR({ children }: { children: ReactNode }) {
  return (
    <section className="my-8 rounded-lg border bg-card px-5 py-4 shadow-xs">
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        TL;DR
      </p>
      <div className="text-[15px] [&_ul]:my-0 [&_ul]:space-y-1.5 [&_li]:marker:text-(--domain,var(--color-primary))">
        {children}
      </div>
    </section>
  );
}
