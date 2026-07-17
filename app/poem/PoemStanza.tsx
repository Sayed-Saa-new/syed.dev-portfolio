"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function PoemStanza({
  lines,
  index,
}: {
  lines: string[];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Scroll-linked reveal: blur + fade + subtle lift as stanza enters,
  // then a gentle exit blur/fade as it leaves the top.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "center 55%", "end 15%"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [0.05, 1, 1, 0.25]);
  const blurPx = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [14, 0, 0, 6]);
  const y = useTransform(scrollYProgress, [0, 0.4, 1], [40, 0, -14]);
  const filter = useTransform(blurPx, (b) => `blur(${b}px)`);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y, filter, willChange: "opacity, transform, filter" }}
      className="relative mb-24 md:mb-32"
    >
      {/* Stanza number — barely there, like a breath */}
      <div
        aria-hidden
        className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-neutral-400"
      >
        <span className="h-px w-8 bg-neutral-300" />
        <span>{String(index + 1).padStart(2, "0")}</span>
      </div>

      <p className="whitespace-pre-line font-serif text-[1.35rem] leading-[2.15] tracking-[-0.005em] text-neutral-800 md:text-[1.65rem] md:leading-[2.2]">
        {lines.join("\n")}
      </p>
    </motion.div>
  );
}
