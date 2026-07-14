"use client";

import { motion } from "framer-motion";
import { BorderCard } from "@/app/components/BorderCard";
import { NewsletterSignUp } from "@/app/components/NewsletterSignUp";
import { hardwareData, softwareData } from "app/data/toolbox";
import { HorizontalLine } from "@/app/components/HorizontalLine";
import { GridWrapper } from "@/app/components/GridWrapper";
import { StaggeredAppsGrid } from "@/app/components/StaggeredAppsGrid";
import { StaggeredHardwareGrid } from "@/app/components/StaggeredHardwareGrid";

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function ToolboxPage() {
  return (
    <div className="relative">
      <title>Toolbox | Syed — Abushaid Islam</title>
      <span className="absolute left-1/2 top-20 -translate-y-1/2 translate-x-1/2">
        <HorizontalLine />
      </span>
      <div className="relative space-y-10 md:space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOut }}
          className="mx-auto text-balance pt-14 md:pt-16"
        >
          <GridWrapper>
            <h1 className="mx-auto max-w-2xl text-center text-4xl font-medium leading-tight tracking-tighter text-text-primary md:text-6xl md:leading-[64px]">
              The tools I use to build AI-powered products & modern web apps.
            </h1>
          </GridWrapper>
        </motion.div>
        <span className="absolute left-1/2 top-40 -translate-y-1/2 translate-x-1/2">
          <HorizontalLine />
        </span>

        {/* Applications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="relative"
        >
          <GridWrapper>
            <div className="text-center text-sm font-medium text-indigo-600">
              <span>Applications</span>
            </div>
          </GridWrapper>
        </motion.div>
        {/* List */}
        <GridWrapper>
          <StaggeredAppsGrid items={softwareData} columns={8} />
        </GridWrapper>

        {/* Hardware */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="relative"
        >
          <GridWrapper>
            <div className="text-center text-sm font-medium text-indigo-600">
              <span>Hardware</span>
            </div>
          </GridWrapper>
        </motion.div>

        <div>
          <GridWrapper>
            <StaggeredHardwareGrid items={hardwareData} />
          </GridWrapper>
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.7, ease: easeOut }}
        >
          <NewsletterSignUp />
        </motion.div>
      </div>
    </div>
  );
}
