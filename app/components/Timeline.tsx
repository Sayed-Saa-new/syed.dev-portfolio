"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface TimelineProps {
  avatarUrl: string;
}

export function Timeline({ avatarUrl }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 70%"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <motion.div
        className="absolute -left-0.5 z-10 flex"
        style={{
          top: 0,
          height: "100%",
          y,
        }}
      >
        <div className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-bg-primary bg-bg-primary shadow-md">
          <Image src={avatarUrl} alt="Profile" fill className="object-cover" />
        </div>
      </motion.div>
      <div className="bg-opacity-24 absolute bottom-0 left-1/2 top-0 w-2 -translate-x-1/2 rounded-full bg-[#E8ECEF] shadow-[inset_0_2px_1.5px_rgba(165,174,184,0.32)]">
        <motion.div
          className="absolute inset-0 w-full origin-top rounded-full bg-gradient-to-b from-indigo-500 via-indigo-400 to-indigo-300"
          style={{ scaleY: scrollYProgress }}
        />
      </div>
    </div>
  );
}
