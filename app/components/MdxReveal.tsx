"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

const easeOut = [0.22, 1, 0.36, 1] as const;

export function MdxReveal({
  children,
  as = "div",
  delay = 0,
  y = 14,
  blur = 10,
  className,
}: {
  children: ReactNode;
  as?: "div" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "blockquote" | "figure" | "section";
  delay?: number;
  y?: number;
  blur?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as] as any;

  if (reduce) {
    return <Comp className={className}>{children}</Comp>;
  }

  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y, filter: `blur(${blur}px)` }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8% 0px -8% 0px" }}
      transition={{ duration: 0.9, ease: easeOut, delay }}
      style={{ willChange: "opacity, transform, filter" }}
    >
      {children}
    </Comp>
  );
}
