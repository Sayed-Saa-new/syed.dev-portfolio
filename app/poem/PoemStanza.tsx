"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";

export function PoemStanza({
  lines,
  index,
}: {
  lines: string[];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Scroll-linked reveal — stanza softly blurs/fades in and drifts out.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "center 60%", "end 10%"],
  });

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.75, 1],
    [0, 1, 1, 0.2],
  );
  const blurPx = useTransform(
    scrollYProgress,
    [0, 0.3, 0.75, 1],
    [18, 0, 0, 8],
  );
  const y = useTransform(scrollYProgress, [0, 0.35, 1], [48, 0, -18]);
  const filter = useTransform(blurPx, (b) => `blur(${b}px)`);

  // One-shot in-view fade — gives a premium “settle” once each stanza enters.
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  const easeOut = [0.22, 1, 0.36, 1] as const;

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y, filter, willChange: "opacity, transform, filter" }}
      className="relative mb-14 md:mb-20"
    >
      {/* Stanza number — barely there, like a breath */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, x: -8 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.9, ease: easeOut, delay: 0.05 }}
        className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.42em] text-neutral-400"
      >
        <span className="h-px w-10 bg-gradient-to-r from-transparent via-neutral-400 to-transparent" />
        <span>{String(index + 1).padStart(2, "0")}</span>
      </motion.div>

      <div className="font-poem text-[1.35rem] leading-[1.55] text-neutral-800 md:text-[1.7rem] md:leading-[1.6]">
        {lines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
            animate={
              inView
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : {}
            }
            transition={{
              duration: 1.1,
              ease: easeOut,
              delay: 0.15 + i * 0.12,
            }}
            className="m-0"
            style={{
              fontFeatureSettings: '"liga", "dlig", "swsh", "kern"',
              fontVariationSettings: '"SOFT" 100, "opsz" 144',
              letterSpacing: "-0.012em",
              wordSpacing: "-0.06em",
            }}
          >
            {line}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
}
