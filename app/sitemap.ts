import type { MetadataRoute } from "next";
import { fetchAndSortBlogPostsAsync } from "@/app/lib/blog/posts";
import { siteMetadata } from "@/app/data/siteMetadata";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetchAndSortBlogPostsAsync();
  const blogUrls = posts.map((post) => ({
    url: `${siteMetadata.siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const staticPages: MetadataRoute.Sitemap = (
    [
      { path: "", priority: 1.0, changeFrequency: "weekly" },
      { path: "/about", priority: 0.9, changeFrequency: "monthly" },
      { path: "/projects", priority: 0.9, changeFrequency: "monthly" },
      { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
      { path: "/toolbox", priority: 0.7, changeFrequency: "monthly" },
      { path: "/speaking", priority: 0.7, changeFrequency: "monthly" },
      { path: "/stats", priority: 0.6, changeFrequency: "daily" },
      { path: "/connections", priority: 0.5, changeFrequency: "monthly" },
      { path: "/links", priority: 0.5, changeFrequency: "monthly" },
    ] as const
  ).map((p) => ({
    url: `${siteMetadata.siteUrl}${p.path}`,
    lastModified: new Date(),
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  return [...staticPages, ...blogUrls];
}
