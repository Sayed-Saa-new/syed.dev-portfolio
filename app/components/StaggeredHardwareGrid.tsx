"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BorderCard } from "./BorderCard";

type HardwareItem = {
  title: string;
  description: string;
  link: string;
};

export function StaggeredHardwareGrid({ items }: { items: HardwareItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3"
    >
      {items.map((item, i) => {
        const col = i % 3;
        const middle = 1;
        const distance = Math.abs(col - middle);
        const delay = distance * 0.08 + Math.floor(i / 3) * 0.12;

        return (
          <motion.a
            key={item.title}
            href={item.link}
            className="group block h-full"
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={
              inView
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 100, scale: 0.9 }
            }
            transition={{
              duration: 0.85,
              delay,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
          >
            <BorderCard>
              <div className="flex flex-col space-y-3">
                <p className="text-base font-semibold leading-5 text-text-primary">
                  {item.title}
                </p>
                <p className="leading-6 text-gray-500">{item.description}</p>
              </div>
              <span className="inline-block text-right">
                <span className="text-sm text-purple-primary/50 group-hover:text-purple-primary">
                  Learn more
                </span>
              </span>
            </BorderCard>
          </motion.a>
        );
      })}
    </div>
  );
}
