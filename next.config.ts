import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

// Turbopack requires remark/rehype plugins as string names with
// serializable options — imported plugin functions fail to build.
const withMDX = createMDX({
  options: {
    remarkPlugins: [
      "remark-gfm",
      "remark-frontmatter",
      ["remark-mdx-frontmatter", { name: "frontmatter" }],
      "remark-math",
    ],
    rehypePlugins: [["rehype-katex", { throwOnError: false }]],
  } as never,
});

export default withMDX(nextConfig);
