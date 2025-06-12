import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    mdx({
      providerImportSource: "@mdx-js/react",
      remarkPlugins: [
        remarkFrontmatter,
        [
          remarkMdxFrontmatter,
          {
            name: "frontmatter",
            type: "yaml",
          },
        ],
      ],
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: "wrap" }],
      ],
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
