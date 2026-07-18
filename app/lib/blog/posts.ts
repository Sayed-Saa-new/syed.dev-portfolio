import "server-only";
import { unstable_cache } from "next/cache";
import { createSupabaseAdminClient } from "@/app/lib/supabase/server";
import { compileMdxToCode } from "./compile";
import type { Blog } from "#site/content";
import { posts as mdxPosts } from "#site/content";

/**
 * Unified blog data layer.
 *
 * Reads posts from Supabase FIRST, then falls back to legacy MDX files
 * (velite) for any slug not yet migrated. When a post exists in both,
 * Supabase wins. This lets the migration happen incrementally with zero
 * downtime — delete MDX files once every post lives in the DB.
 */

type DbRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content_mdx: string;
  cover_image_url: string | null;
  categories: string[] | null;
  audio_file_url: string | null;
  canonical_url: string | null;
  status: "draft" | "published";
  published_at: string | null;
  updated_at: string;
};

async function rowToBlog(row: DbRow): Promise<Blog> {
  const { code, headings } = await compileMdxToCode(row.content_mdx || "");
  return {
    slug: row.slug,
    slugAsParams: row.slug,
    title: row.title,
    summary: row.summary || "",
    publishedAt: row.published_at || row.updated_at,
    imageName: row.cover_image_url || "",
    categories: row.categories || [],
    code,
    headings,
    canonicalUrl: row.canonical_url || undefined,
    draft: row.status !== "published",
    audioFile: row.audio_file_url || undefined,
  };
}

const getSupabasePublishedPosts = unstable_cache(
  async (): Promise<Blog[]> => {
    try {
      const supabase = await createSupabaseAdminClient();
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .lte("published_at", new Date().toISOString())
        .order("published_at", { ascending: false });
      if (error || !data) return [];
      return await Promise.all(data.map((r) => rowToBlog(r as DbRow)));
    } catch {
      return [];
    }
  },
  ["blog_posts:published:v1"],
  { revalidate: 30, tags: ["blog_posts"] },
);

const getSupabasePostBySlug = unstable_cache(
  async (slug: string): Promise<Blog | null> => {
    try {
      const supabase = await createSupabaseAdminClient();
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error || !data) return null;
      return await rowToBlog(data as DbRow);
    } catch {
      return null;
    }
  },
  ["blog_posts:by_slug:v1"],
  { revalidate: 30, tags: ["blog_posts"] },
);

export async function getAllPosts(): Promise<Blog[]> {
  const dbPosts = await getSupabasePublishedPosts();
  const dbSlugs = new Set(dbPosts.map((p) => p.slug));
  const legacy = mdxPosts.filter((p) => !p.draft && !dbSlugs.has(p.slug));
  const merged = [...dbPosts, ...legacy];
  merged.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  return merged;
}

export async function getPostBySlug(slug: string): Promise<Blog | null> {
  const dbPost = await getSupabasePostBySlug(slug);
  if (dbPost && dbPost.draft) return null;
  if (dbPost) return dbPost;
  return mdxPosts.find((p) => p.slug === slug && !p.draft) ?? null;
}

export async function getAllPostsIncludingDrafts(): Promise<Blog[]> {
  // Admin-only helper — includes drafts. Reads all rows regardless of status.
  try {
    const supabase = await createSupabaseAdminClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .order("updated_at", { ascending: false });
    const dbPosts = data
      ? await Promise.all((data as DbRow[]).map(rowToBlog))
      : [];
    const dbSlugs = new Set(dbPosts.map((p) => p.slug));
    const legacy = mdxPosts.filter((p) => !dbSlugs.has(p.slug));
    return [...dbPosts, ...legacy];
  } catch {
    return [...mdxPosts];
  }
}

export function getPostsByCategory(posts: Blog[], category: string): Blog[] {
  return posts.filter((p) =>
    p.categories?.some((c) => c.toLowerCase() === category.toLowerCase()),
  );
}
