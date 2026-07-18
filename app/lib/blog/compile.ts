import { compile } from "@mdx-js/mdx";
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
export async function compileMdxToCode(source: string): Promise<CompiledPost> {
  const compiled = await compile(source, {
    outputFormat: "function-body",
    development: false,
  });
  return {
    code: String(compiled),
    headings: extractHeadingsFromMdx(source),
  };
}
