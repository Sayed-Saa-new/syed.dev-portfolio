"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { GridWrapper } from "../GridWrapper";
import { PortfolioBlogCard } from "./portfolio-blog-card";
import type { Blog } from "#site/content";

interface PortfolioBlogGridProps {
  posts: Blog[];
  viewCounts?: Record<string, number>;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 320,
      damping: 26,
    },
  },
};

export function PortfolioBlogGrid({
  posts,
  viewCounts = {},
}: PortfolioBlogGridProps) {
  if (posts.length === 0) {
    return (
      <GridWrapper>
        <div className="py-20 text-center">
          <p className="text-base text-text-secondary">
            No articles found in this topic.
          </p>
          <div className="mt-4">
            <Link
              href="/blog"
              className="inline-flex items-center rounded-full border border-border-primary bg-white px-4 py-1.5 text-xs font-medium text-slate-800 shadow-xs transition-colors hover:bg-slate-50"
            >
              View all articles
            </Link>
          </div>
        </div>
      </GridWrapper>
    );
  }

  const listKey = posts.map((p) => p.slug).join(",");

  return (
    <GridWrapper>
      <div className="py-8 sm:py-12">
        <motion.div
          key={listKey}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {posts.map((post, index) => (
            <motion.div
              key={post.slug}
              variants={cardVariants}
              className="flex h-full flex-col"
            >
              <PortfolioBlogCard
                post={post}
                viewCount={viewCounts[post.slug]}
                priority={index < 3}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </GridWrapper>
  );
}
