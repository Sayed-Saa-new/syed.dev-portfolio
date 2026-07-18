/**
 * Table of Contents utilities
 * Shared types and functions for TOC heading extraction and rendering.
 *
 * Extracts H1–H4 from raw MDX. Skips fenced code blocks so `# comments`
 * inside code samples aren't picked up. Strips inline markdown (bold,
 * italic, inline code, links) from heading text. Deduplicates slugs
 * (`intro`, `intro-1`, `intro-2`, ...) to match `github-slugger` /
 * `rehype-slug` behaviour so TOC anchors resolve reliably.
 */

export interface TocHeading {
  level: 1 | 2 | 3 | 4;
  text: string;
  slug: string;
}

export function slugify(str: string): string {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s]+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\p{L}\p{N}\-_]+/gu, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripInline(text: string): string {
  return text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .trim();
}

export function extractHeadingsFromMdx(content: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const seen = new Map<string, number>();
  const lines = content.split(/\r?\n/);

  let inFence = false;
  const fenceRe = /^\s*(```|~~~)/;
  const headingRe = /^(#{1,4})\s+(.+?)\s*#*\s*$/;

  for (const line of lines) {
    if (fenceRe.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const m = headingRe.exec(line);
    if (!m) continue;

    const level = m[1].length as 1 | 2 | 3 | 4;
    const text = stripInline(m[2]);
    if (!text) continue;

    const base = slugify(text);
    if (!base) continue;

    const n = seen.get(base) ?? 0;
    const slug = n === 0 ? base : `${base}-${n}`;
    seen.set(base, n + 1);

    headings.push({ level, text, slug });
  }

  return headings;
}
