import type { MDXComponents } from "mdx/types";
import { Analogy } from "@/components/mdx/Analogy";
import { Callout } from "@/components/mdx/Callout";
import { Chart } from "@/components/mdx/Chart";
import { ChartJS } from "@/components/mdx/ChartJS";
import { CodeBlock } from "@/components/mdx/CodeBlock";
import { Diagram } from "@/components/mdx/Diagram";
import { Formula } from "@/components/mdx/Formula";
import { TLDR } from "@/components/mdx/TLDR";

const components: MDXComponents = {
  h2: (props) => (
    <h2
      className="mt-12 mb-4 scroll-m-20 font-serif text-[1.65rem]/[1.25] font-semibold tracking-tight"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-8 mb-3 scroll-m-20 font-serif text-xl font-semibold tracking-tight"
      {...props}
    />
  ),
  p: (props) => <p className="my-4 leading-[1.75] text-foreground/90" {...props} />,
  ul: (props) => <ul className="my-4 ml-6 list-disc space-y-2 leading-[1.75]" {...props} />,
  ol: (props) => <ol className="my-4 ml-6 list-decimal space-y-2 leading-[1.75]" {...props} />,
  a: (props) => (
    <a
      className="underline underline-offset-4 decoration-muted-foreground hover:decoration-foreground"
      {...props}
    />
  ),
  code: (props) => (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]" {...props} />
  ),
  blockquote: (props) => (
    <blockquote
      className="my-4 border-l-2 pl-4 font-serif text-lg italic text-muted-foreground"
      {...props}
    />
  ),
  table: (props) => (
    <div className="my-6 overflow-x-auto rounded-lg border">
      <table className="w-full text-sm [&_tr:last-child_td]:border-0" {...props} />
    </div>
  ),
  th: (props) => (
    <th className="border-b bg-muted/50 px-3 py-2 text-left font-medium" {...props} />
  ),
  td: (props) => <td className="border-b px-3 py-2 text-muted-foreground" {...props} />,
  hr: (props) => <hr className="my-8" {...props} />,
  pre: (props) => (
    <pre
      className="my-6 overflow-x-auto rounded-lg border bg-muted/40 p-4 font-mono text-[13px] leading-relaxed [&_code]:rounded-none [&_code]:bg-transparent [&_code]:p-0"
      {...props}
    />
  ),
  Analogy,
  Callout,
  Chart,
  ChartJS,
  CodeBlock,
  Diagram,
  Formula,
  TLDR,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
