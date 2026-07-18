import {
  extractUniqueBlogCategories,
  fetchAndSortBlogPostsAsync,
} from "app/lib/utils";
import { NewsletterSignUp } from "@/app/components/NewsletterSignUp";
import { BlogPostList } from "@/app/components/BlogPostList";
import { CategorySelect } from "@/app/components/CategorySelect";
import { FeaturedBlogCard } from "@/app/components/FeaturedBlogCard";
import { GridWrapper } from "@/app/components/GridWrapper";
import { MotionFadeIn } from "@/app/components/MotionFadeIn";
import { createSupabaseAdminClient } from "@/app/lib/supabase/server";
import clsx from "clsx";

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

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const allPublishedBlogPosts = await fetchAndSortBlogPostsAsync();
  const categories = Array.from(
    extractUniqueBlogCategories(allPublishedBlogPosts),
  );
  const category = (await searchParams).category?.toLowerCase() || "";

  const displayedPosts = category
    ? allPublishedBlogPosts.filter((post) =>
        post.categories?.map((cat) => cat.toLowerCase()).includes(category),
      )
    : allPublishedBlogPosts;

  const viewCounts = await getViewCountsForSlugs(
    displayedPosts.map((p) => p.slug),
  );

  const featuredPosts = !category && (
    <MotionFadeIn delay={0.15} y={30}>
      <GridWrapper>
        <ul className="z-50 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          {allPublishedBlogPosts.length > 0 ? (
            <>
              {allPublishedBlogPosts.slice(0, 4).map((post, index) => (
                <FeaturedBlogCard
                  key={post.slug}
                  slug={post.slug}
                  imageName={post.imageName}
                  title={post.title}
                  summary={post.summary}
                  index={index}
                  className={clsx(
                    index === 3 && "hidden md:block lg:hidden",
                  )}
                />
              ))}
            </>
          ) : (
            <p>Nothing to see here yet...</p>
          )}
        </ul>
      </GridWrapper>
    </MotionFadeIn>
  );

  return (
    <div className="mt-14 space-y-16 md:mt-16">
      <title>Blog | Syed</title>
      <MotionFadeIn duration={0.8} y={40}>
        <GridWrapper>
          <h1 className="mx-auto max-w-2xl text-center text-4xl font-medium leading-tight tracking-tighter text-text-primary md:text-6xl md:leading-[64px]">
            {category
              ? `Articles about ${category}`
              : "Notes on AI, engineering && the things I'm building."}
          </h1>
        </GridWrapper>
      </MotionFadeIn>

      {featuredPosts}

      <MotionFadeIn delay={0.1}>
        <div>
          <CategorySelect categories={categories} currentCategory={category} />
          <BlogPostList posts={displayedPosts} viewCounts={viewCounts} />
        </div>
      </MotionFadeIn>

      <MotionFadeIn delay={0.1} y={30}>
        <NewsletterSignUp
          title={
            category ? `Stay updated on ${category} articles` : "Stay updated"
          }
          description="Sign up to receive notifications about new blog posts, insights, and exclusive content directly in your inbox."
          buttonText="Get Notified"
        />
      </MotionFadeIn>
    </div>
  );
}
