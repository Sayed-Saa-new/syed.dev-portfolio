import {
  extractUniqueBlogCategories,
  fetchAndSortBlogPostsAsync,
} from "app/lib/utils";
import { NewsletterSignUp } from "@/app/components/NewsletterSignUp";
import { BlogPostList } from "@/app/components/BlogPostList";
import { CategorySelect } from "@/app/components/CategorySelect";
import { createSupabaseAdminClient } from "@/app/lib/supabase/server";

async function getViewCountsForSlugs(slugs: string[]): Promise<Record<string, number>> {
  if (slugs.length === 0) return {};
  try {
    const supabase = await createSupabaseAdminClient();
    const { data } = await supabase
      .from("article_views")
      .select("slug, view_count")
      .in("slug", slugs);
    const map: Record<string, number> = {};
    for (const slug of slugs) map[slug] = 0;
    for (const row of data ?? []) map[row.slug] = row.view_count ?? 0;
    return map;
  } catch {
    return Object.fromEntries(slugs.map((s) => [s, 0]));
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const allPublishedBlogPosts = fetchAndSortBlogPosts();
  const categories = Array.from(
    extractUniqueBlogCategories(allPublishedBlogPosts),
  );

  const category = (await params).category
    ? (await params).category.toLowerCase()
    : "";

  const categoryPosts = allPublishedBlogPosts.filter((post) => {
    return (
      Array.isArray(post.categories) &&
      post.categories.some(
        (cat) => typeof cat === "string" && cat.toLowerCase() === category,
      )
    );
  });

  const viewCounts = await getViewCountsForSlugs(
    categoryPosts.map((p) => p.slug),
  );

  return (
    <div className="mt-[100px] w-full space-y-[80px]">
      <title>{category} Articles</title>
      <h1 className="mx-auto max-w-2xl text-center text-4xl font-medium leading-tight tracking-tighter text-text-primary md:text-6xl md:leading-[64px]">
        {`Articles about ${category || "Unknown Category"}`}
      </h1>

      <CategorySelect categories={categories} currentCategory={category} />

      <BlogPostList posts={categoryPosts} viewCounts={viewCounts} />
      <NewsletterSignUp
        title={`Stay updated on ${category} articles`}
        description={`Sign up to receive notifications about new blog posts, insights, and exclusive content directly in your inbox.`}
        buttonText="Get Notified"
      />
    </div>
  );
}
