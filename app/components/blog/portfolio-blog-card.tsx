"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Eye } from "lucide-react";
import { resolveCoverUrl } from "@/app/lib/utils";
import type { Blog } from "#site/content";

interface PortfolioBlogCardProps {
  post: Blog;
  viewCount?: number;
  priority?: boolean;
}

export function PortfolioBlogCard({
  post,
  viewCount,
  priority = false,
}: PortfolioBlogCardProps) {
  const coverUrl = resolveCoverUrl(post.imageName);
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const categoryName = post.categories?.[0] || "";

  return (
    <Link
      href={`/blog/${post.slug}`}
      prefetch={true}
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border-primary bg-white/80 backdrop-blur-xs transition-all duration-300 hover:border-slate-400/50 hover:bg-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
    >
      <div>
        {/* Cover Image with 1200/630 aspect ratio & spring/ease hover scale */}
        <div className="relative aspect-[1200/630] w-full overflow-hidden bg-slate-100">
          <Image
            src={coverUrl}
            alt={post.title}
            width={1200}
            height={630}
            priority={priority}
            unoptimized={coverUrl.startsWith("http")}
            className="aspect-[1200/630] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/[0.04]" />
        </div>

        {/* Content */}
        <div className="p-5 pb-2 sm:p-6 sm:pb-3">
          <div className="flex items-start justify-between gap-3">
            <h2 className="line-clamp-2 text-lg font-medium tracking-tight text-slate-900 transition-colors duration-150 group-hover:text-black">
              {post.title}
            </h2>
            <ArrowUpRight className="mt-0.5 size-4.5 shrink-0 text-slate-400 opacity-0 -translate-x-1 translate-y-1 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-hover:text-slate-900" />
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-text-secondary leading-relaxed">
            {post.summary}
          </p>
        </div>
      </div>

      {/* Meta Footer */}
      <div className="flex items-center justify-between p-5 pt-3 sm:p-6 sm:pt-3">
        <div className="flex items-center space-x-2.5">
          {/* Syed Author Avatar with Dub/RenderX hover physics */}
          <div
            className="relative size-7 shrink-0 rounded-full border-2 border-white bg-slate-200 shadow-xs transition-all duration-200 group-hover:brightness-95 hover:!scale-125 hover:!z-20 hover:shadow-md"
            title="Syed (Abushaid Islam)"
          >
            <Image
              src="/syed_headshot_1.webp"
              alt="Syed"
              width={28}
              height={28}
              className="size-full rounded-full object-cover"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-text-secondary">
            {formattedDate && <time dateTime={post.publishedAt}>{formattedDate}</time>}
            {viewCount !== undefined && viewCount > 0 && (
              <>
                <span>•</span>
                <span className="inline-flex items-center gap-1 font-mono text-[11px]">
                  <Eye className="size-3 text-slate-400" />
                  {viewCount.toLocaleString()} {viewCount === 1 ? "read" : "reads"}
                </span>
              </>
            )}
          </div>
        </div>

        {categoryName && (
          <span className="rounded-md bg-slate-100/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-600 transition-colors group-hover:bg-slate-200/70 group-hover:text-slate-900">
            {categoryName}
          </span>
        )}
      </div>
    </Link>
  );
}
