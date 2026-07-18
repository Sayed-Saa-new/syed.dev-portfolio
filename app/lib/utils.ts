import { Blog, Changelog, changelogItems, posts } from "#site/content";

/**
 * Resolve a post cover image reference. DB-stored posts hold a full https://
 * URL (Supabase Storage). Legacy MDX posts hold just a filename (served from
 * /public/blog/). Empty → empty (caller decides fallback).
 */
export function resolveCoverUrl(imageName: string | null | undefined): string {
  if (!imageName) return "";
  if (/^https?:\/\//i.test(imageName)) return imageName;
  return `/blog/${imageName}`;
}
import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export const formatDate = (date: string) => {
  noStore();
  let currentDate = new Date();
  if (!date.includes("T")) {
    date = `${date}T00:00:00`;
  }
  let targetDate = new Date(date);

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  let daysAgo = currentDate.getDate() - targetDate.getDate();

  let formattedDate = "";

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`;
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`;
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`;
  } else {
    formattedDate = "Today";
  }

  let fullDate = targetDate.toLocaleString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return `${fullDate} (${formattedDate})`;
};

export const getTimeOfDayGreeting = () => {
  const now = new Date();
  const hours = now.getHours();

  if (hours < 12) {
    return "Good morning!";
  } else if (hours < 17) {
    return "Good afternoon!";
  } else {
    return "Good evening!";
  }
};

export const cx = (...classes) => classes.filter(Boolean).join(" ");

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fetchAndSortChangelogEntrees(): Changelog[] {
  try {
    const allChangelogItems = changelogItems;
    return allChangelogItems
      .filter((item) => !item.draft)
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      );
  } catch (error) {
    notFound();
  }
}


export function fetchAndSortBlogPosts(): Blog[] {
  // Legacy sync accessor — MDX files only. Prefer fetchAndSortBlogPostsAsync
  // in server components; that source merges Supabase-stored posts too.
  try {
    return [...posts]
      .filter((p) => !p.draft)
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      );
  } catch {
    return [];
  }
}

// Async helpers that merge Supabase + MDX live in `@/app/lib/blog/posts`.
// Do not import that server-only module here — utils.ts is reachable from
// client components.

export async function fetchAndSortChangelogPosts(): Promise<Changelog[]> {
  try {
    const allChangelogItems = await changelogItems;
    return allChangelogItems
      .filter((item) => !item.draft)
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      );
  } catch (error) {
    notFound();
  }
}

export function extractUniqueBlogCategories(posts: Blog[]): Set<string> {
  const categories = new Set<string>();
  posts.forEach((post) => {
    post.categories.forEach((category) => categories.add(category));
  });
  return categories;
}
