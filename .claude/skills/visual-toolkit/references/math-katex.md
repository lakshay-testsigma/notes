# Math — KaTeX

Render any equation, matrix, or complexity notation with KaTeX. Never leave math as plain prose (`O(n^2)`, `sqrt(x)`) — render it.

## MDX pipeline setup (add once)

Deps: `katex`, `remark-math`, `rehype-katex`. Wire into the MDX config (check `node_modules/next/dist/docs/` for the Next-16 MDX API before editing config):

```ts
// next.config.ts (shape — verify against Next 16 docs)
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import createMDX from "@next/mdx";

const withMDX = createMDX({ options: { remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] } });
export default withMDX({ pageExtensions: ["ts", "tsx", "md", "mdx"] });
```

Import the stylesheet once (root layout): `import "katex/dist/katex.min.css";`

## Usage in MDX

- Inline: `The cost is $O(n \log n)$ per query.`
- Block:

```mdx
$$
\text{Attention}(Q,K,V) = \text{softmax}\!\left(\frac{QK^{\top}}{\sqrt{d_k}}\right)V
$$
```

- Aligned system:

```mdx
$$
\begin{aligned}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\varepsilon_0} \\
\nabla \times \mathbf{B} &= \mu_0\mathbf{J} + \mu_0\varepsilon_0\frac{\partial \mathbf{E}}{\partial t}
\end{aligned}
$$
```

Optional `<Formula>` component for a captioned equation:

```tsx
// src/components/mdx/Formula.tsx
"use client";
import katex from "katex";
export function Formula({ tex, caption }: { tex: string; caption?: string }) {
  const html = katex.renderToString(tex, { displayMode: true, throwOnError: false });
  return (
    <figure className="my-6 flex flex-col items-center gap-2">
      <div dangerouslySetInnerHTML={{ __html: html }} />
      {caption && <figcaption className="text-sm text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}
```

## Rules

- Pair every non-trivial formula with a one-line plain-language reading ("softmax weights each value by relevance").
- Define symbols right after the equation if the reader needs them.
- Inline math for terms in a sentence; block for the equation being taught.
