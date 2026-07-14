"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

const easeOut = [0.22, 1, 0.36, 1] as const;

type MotionFadeInProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  as?: "div" | "section" | "header";
};

export function MotionFadeIn({
  children,
  delay = 0,
  y = 24,
  duration = 0.7,
  className,
  once = true,
  as = "div",
}: MotionFadeInProps) {
  const Comp = motion[as] as React.ComponentType<HTMLMotionProps<"div">>;
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-10% 0px" }}
      transition={{ duration, ease: easeOut, delay }}
      className={className}
    >
      {children}
    </Comp>
  );
}
