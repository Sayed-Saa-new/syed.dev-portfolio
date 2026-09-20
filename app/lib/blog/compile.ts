import { compile } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { extractHeadingsFromMdx, TocHeading } from "@/app/lib/toc-utils";

export type CompiledPost = {
  code: string;
  headings: TocHeading[];
};

/**
 * Compile raw MDX source into a function-body string that can be evaluated
 * with `new Function(code)({ ...runtime })`, matching the shape produced by
 * Velite's `s.mdx()`. This lets the existing <MDXContent /> render Supabase-
 * stored posts with zero UI changes.
 */
function sanitizeMdxSource(source: string): string {
  // Self-close void HTML elements that aren't self-closed (e.g. <img ...>, <br>, <hr>)
  return source
    .replace(/<img\b([^>]*?)(?<!\/)>/gi, "<img$1 />")
    .replace(/<br\b([^>]*?)(?<!\/)>/gi, "<br$1 />")
    .replace(/<hr\b([^>]*?)(?<!\/)>/gi, "<hr$1 />")
    .replace(/<input\b([^>]*?)(?<!\/)>/gi, "<input$1 />");
}

export async function compileMdxToCode(source: string): Promise<CompiledPost> {
  const sanitized = sanitizeMdxSource(source);
  const compiled = await compile(sanitized, {
    outputFormat: "function-body",
    development: false,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  });
  return {
    code: String(compiled),
    headings: extractHeadingsFromMdx(sanitized),
  };
}
