"use client";

import { motion } from "framer-motion";
import { GridWrapper } from "../GridWrapper";
import { usePerformanceMode } from "@/app/hooks/usePerformanceMode";

export function StatsPageHeader() {
  const { shouldReduceAnimations } = usePerformanceMode();

  if (shouldReduceAnimations) {
    return (
      <section>
        <GridWrapper className="py-8 sm:py-10">
          <div className="mx-auto max-w-2xl px-2 text-center sm:px-4">
            <span className="text-sm font-medium text-indigo-600">Stats</span>
            <h1 className="mt-3 text-balance text-3xl font-medium leading-tight tracking-tighter text-text-primary sm:text-4xl md:text-5xl">
              Building in public
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-balance text-base leading-7 text-text-secondary sm:text-lg sm:leading-8">
              GitHub activity, shipped projects, and a live snapshot of what
              I&apos;m building.
            </p>
          </div>
        </GridWrapper>
      </section>
    );
  }

  return (
    <section>
      <GridWrapper className="py-8 sm:py-10">
        <div className="mx-auto max-w-2xl px-2 text-center sm:px-4">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="block text-sm font-medium text-indigo-600"
          >
            Stats
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-balance text-3xl font-medium leading-tight tracking-tighter text-text-primary sm:text-4xl md:text-5xl"
          >
            Building in public
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-4 max-w-xl text-balance text-base leading-7 text-text-secondary sm:text-lg sm:leading-8"
          >
            GitHub activity, shipped projects, and a live snapshot of what
            I&apos;m building.
          </motion.p>
        </div>
      </GridWrapper>
    </section>
  );
}
