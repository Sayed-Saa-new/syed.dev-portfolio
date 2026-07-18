"use client";

import Link from "next/link";
import clsx from "clsx";
import { motion } from "framer-motion";
import { resolveCoverUrl } from "@/app/lib/utils";

type FeaturedBlogCardProps = {
  slug: string;
  imageName: string;
  title: string;
  summary: string;
  className?: string;
  index?: number;
};

const easeOut = [0.22, 1, 0.36, 1] as const;

export function FeaturedBlogCard({
  slug,
  imageName,
  title,
  summary,
  className,
  index = 0,
}: FeaturedBlogCardProps) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, ease: easeOut, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className={clsx(
        "group z-50 flex h-full flex-col rounded-3xl border border-border-primary bg-bg-primary p-2 transition-shadow duration-300 hover:shadow-xl",
        className,
      )}
    >
      <Link
        className="flex h-full flex-col rounded-2xl"
        href={`/blog/${slug}`}
        prefetch={true}
      >
        <div className="overflow-hidden rounded-2xl">
          <img
            src={resolveCoverUrl(imageName)}
            alt=""
            className="h-[280px] w-full rounded-2xl object-cover transition-transform duration-500 ease-out group-hover:scale-105 md:h-[225px]"
          />
        </div>
        <div className="my-4 flex w-full flex-grow flex-col space-y-4 text-balance px-4">
          <h2 className="text-lg font-medium leading-7 tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-indigo-600">
            {title}
          </h2>
          <p className="flex-grow leading-7 text-text-secondary">{summary}</p>
        </div>
      </Link>
    </motion.li>
  );
}
