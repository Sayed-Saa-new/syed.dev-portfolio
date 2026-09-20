export const revalidate = 30;

import type { Metadata } from "next";
import { extractUniqueBlogCategories } from "app/lib/utils";
import { fetchAndSortBlogPostsAsync } from "@/app/lib/blog/posts";
import { NewsletterSignUp } from "@/app/components/NewsletterSignUp";
import { MotionFadeIn } from "@/app/components/MotionFadeIn";
import { createSupabaseAdminClient } from "@/app/lib/supabase/server";
import { PortfolioBlogHeader } from "@/app/components/blog/portfolio-blog-header";
import { PortfolioBlogGrid } from "@/app/components/blog/portfolio-blog-grid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  const capitalized = decoded.charAt(0).toUpperCase() + decoded.slice(1);

  return {
    title: `${capitalized} Articles | Syed`,
    description: `Deep dives, articles, and engineering notes about ${decoded} by Syed.`,
    alternates: { canonical: `/blog/category/${encodeURIComponent(category)}` },
  };
}

async function getViewCountsForSlugs(
  slugs: string[],
): Promise<Record<string, number>> {
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
  const allPublishedBlogPosts = await fetchAndSortBlogPostsAsync();
  const categories = Array.from(
    extractUniqueBlogCategories(allPublishedBlogPosts),
  );

  const rawCategory = (await params).category || "";
  const category = decodeURIComponent(rawCategory).toLowerCase();

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
    <div className="space-y-12 pb-16 pt-6 sm:space-y-16 sm:pb-24 sm:pt-10">
      {/* Header with RenderX-style spring category pills & mobile menu */}
      <PortfolioBlogHeader
        categories={categories}
        currentCategory={category}
      />

      {/* Blog Grid with Framer Motion staggered spring entrance & 1:1 RenderX cards */}
      <PortfolioBlogGrid
        posts={categoryPosts}
        viewCounts={viewCounts}
      />

      {/* Newsletter Section */}
      <MotionFadeIn delay={0.1} y={30}>
        <NewsletterSignUp
          title={`Stay updated on ${category} articles`}
          description={`Sign up to receive notifications about new blog posts, insights, and exclusive content directly in your inbox.`}
          buttonText="Get Notified"
        />
      </MotionFadeIn>
    </div>
  );
}
