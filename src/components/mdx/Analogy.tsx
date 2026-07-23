import type { ReactNode } from "react";

export function Analogy({ children }: { children: ReactNode }) {
  return (
    <aside className="my-8 border-l-2 border-(--domain,var(--border)) pl-5">
      <div className="font-serif text-lg/relaxed italic text-foreground/85 [&>p]:my-0">
        {children}
      </div>
    </aside>
  );
}
