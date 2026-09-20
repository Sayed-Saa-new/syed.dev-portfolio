"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { List } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { GridWrapper } from "../GridWrapper";
import { MotionFadeIn } from "../MotionFadeIn";

interface PortfolioBlogHeaderProps {
  title?: string;
  description?: string;
  categories: string[];
  currentCategory?: string;
}

export function PortfolioBlogHeader({
  title,
  description,
  categories,
  currentCategory = "",
}: PortfolioBlogHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const active = currentCategory.toLowerCase();

  const tabs = [
    { name: "All", slug: "", href: "/blog" },
    ...categories.map((cat) => ({
      name: cat,
      slug: cat.toLowerCase(),
      href: `/blog?category=${encodeURIComponent(cat.toLowerCase())}`,
    })),
  ];

  const isCurrentActive = (slug: string) => {
    if (!active && slug === "") return true;
    return active === slug;
  };

  const defaultTitle = active
    ? `Articles about ${categories.find((c) => c.toLowerCase() === active) || active}`
    : "Notes on AI, engineering && the things I'm building.";

  const defaultDescription = active
    ? `Curated deep-dives, architectural notes, and production patterns on ${active}.`
    : "Articles by Syed (Abushaid Islam) on AI engineering, authentication, Next.js, Supabase, and building full-stack products.";

  return (
    <div className="space-y-8">
      <MotionFadeIn duration={0.8} y={30}>
        <GridWrapper>
          <div className="py-8 md:py-12">
            <h1 className="mx-auto max-w-3xl text-center text-4xl font-medium leading-tight tracking-tighter text-text-primary md:text-5xl lg:text-6xl md:leading-[64px]">
              {title || defaultTitle}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-text-secondary sm:text-lg">
              {description || defaultDescription}
            </p>

            {/* Desktop Category Navigation with Dub/RenderX Spring Pills */}
            <div className="mt-8 flex justify-center sm:mt-10">
              <LayoutGroup id="portfolio-blog-category-nav">
                <nav
                  onMouseLeave={() => setHoveredTab(null)}
                  className="hidden items-center gap-1 rounded-full border border-border-primary/80 bg-white/80 p-1.5 backdrop-blur-md shadow-xs sm:flex sm:flex-wrap"
                >
                  {tabs.map((tab) => {
                    const isActive = isCurrentActive(tab.slug);
                    const isHovered = hoveredTab === tab.slug;

                    return (
                      <Link
                        key={tab.slug || "all"}
                        href={tab.href}
                        onMouseEnter={() => setHoveredTab(tab.slug)}
                        className="relative z-10 block rounded-full outline-none"
                      >
                        <div
                          className={`relative z-10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors duration-150 ${
                            isActive
                              ? "text-white"
                              : "text-text-secondary hover:text-text-primary"
                          }`}
                        >
                          {tab.name}
                        </div>

                        {/* Active spring pill */}
                        {isActive && (
                          <motion.div
                            layoutId="active-portfolio-blog-tab"
                            className="absolute inset-0 rounded-full bg-slate-900 shadow-sm"
                            style={{ zIndex: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 30,
                            }}
                          />
                        )}

                        {/* Hover spring pill */}
                        {!isActive && isHovered && (
                          <motion.div
                            layoutId="hover-portfolio-blog-tab"
                            className="absolute inset-0 rounded-full bg-slate-100"
                            style={{ zIndex: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 30,
                            }}
                          />
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </LayoutGroup>
            </div>

            {/* Mobile Categories Toggle */}
            <div className="mt-6 sm:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex h-11 w-full items-center justify-between rounded-xl border border-border-primary bg-white px-4 text-sm font-medium text-slate-800 shadow-xs transition-all hover:bg-neutral-50 active:scale-[0.99]"
                type="button"
              >
                <span className="flex items-center gap-2">
                  <List className="size-4 text-slate-600" />
                  <span className="font-semibold uppercase tracking-wider text-xs">
                    {tabs.find((t) => isCurrentActive(t.slug))?.name || "Categories"}
                  </span>
                </span>
                <span className="text-xs text-slate-400">Filter topics</span>
              </button>

              <AnimatePresence>
                {mobileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    className="mt-2 grid divide-y divide-border-primary/50 rounded-xl border border-border-primary bg-white p-1.5 shadow-lg"
                  >
                    {tabs.map((tab) => (
                      <Link
                        key={tab.slug || "all"}
                        href={tab.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3 py-2.5 text-xs uppercase tracking-wider font-medium rounded-lg transition-colors ${
                          isCurrentActive(tab.slug)
                            ? "bg-slate-900 text-white"
                            : "text-slate-700 hover:bg-neutral-50"
                        }`}
                      >
                        {tab.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </GridWrapper>
      </MotionFadeIn>
    </div>
  );
}
