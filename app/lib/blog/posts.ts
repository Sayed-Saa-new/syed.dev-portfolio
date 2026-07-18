import "server-only";
import { unstable_cache } from "next/cache";
import { createSupabaseAdminClient } from "@/app/lib/supabase/server";
import { compileMdxToCode } from "./compile";
import type { Blog } from "#site/content";

/**
 * Unified blog data layer.
 *
 * Reads posts from Supabase only. Legacy MDX fallback is intentionally disabled
 * so the public blog and external admin dashboard never show old/demo posts.
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
  const merged = [...dbPosts];
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
  return null;
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
    return dbPosts;
  } catch {
    return [];
  }
}

export function getPostsByCategory(posts: Blog[], category: string): Blog[] {
  return posts.filter((p) =>
    p.categories?.some((c) => c.toLowerCase() === category.toLowerCase()),
  );
}

/** Preferred server-side accessor. Merges Supabase + MDX, published only. */
export async function fetchAndSortBlogPostsAsync(): Promise<Blog[]> {
  return getAllPosts();
}

export async function getRelatedBlogPosts(
  currentPost: Blog,
  maxResults = 3,
): Promise<Blog[]> {
  const allPosts = (await getAllPosts()).filter(
    (p) => p.slug !== currentPost.slug,
  );
  const sameCategories = allPosts.filter((p) =>
    p.categories.some((c) => currentPost.categories.includes(c)),
  );
  const sortedByRelevance = sameCategories.sort((a, b) => {
    const aMatches = a.categories.filter((c) => currentPost.categories.includes(c)).length;
    const bMatches = b.categories.filter((c) => currentPost.categories.includes(c)).length;
    return bMatches - aMatches;
  });
  if (sortedByRelevance.length >= maxResults) return sortedByRelevance.slice(0, maxResults);
  const remaining = allPosts.filter(
    (p) => !sortedByRelevance.some((r) => r.slug === p.slug),
  );
  return [...sortedByRelevance, ...remaining].slice(0, maxResults);
}
