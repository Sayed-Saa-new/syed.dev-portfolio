"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

type App = {
  title: string;
  imgSrc: string;
  link: string;
};

export function StaggeredAppsGrid({
  items,
  columns = 8,
}: {
  items: App[];
  columns?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const middle = Math.floor(columns / 2);

  return (
    <div
      ref={ref}
      className="relative grid grid-cols-3 place-items-center md:grid-cols-4 lg:grid-cols-8 lg:gap-6"
    >
      {items.map((item, i) => {
        // On lg (8-col) use real column, on smaller screens fall back to modulo
        const col = i % columns;
        const distance = Math.abs(col - middle);
        const delay = distance * 0.08 + (Math.floor(i / columns) * 0.05);

        return (
          <motion.a
            key={item.title}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 120, scale: 0.85 }}
            animate={
              inView
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 120, scale: 0.85 }
            }
            transition={{
              duration: 0.9,
              delay,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -8, transition: { duration: 0.25 } }}
            className="group no-underline"
          >
            <div className="inline-block text-center">
              <div className="h-28 w-28 rounded-[20px] border border-border-primary bg-bg-primary p-2 transition-colors duration-300 group-hover:border-indigo-400">
                <div
                  className="grid h-full place-items-center rounded-xl border-2 border-[#A5AEB81F]/10 bg-[#EDEEF0]"
                  style={{ boxShadow: "0px 2px 1.5px 0px #A5AEB852 inset" }}
                >
                  <img
                    className="h-10 w-10"
                    alt={item.title}
                    src={item.imgSrc}
                  />
                </div>
              </div>
              {item.title ? (
                <p className="mt-3 text-sm text-gray-500">{item.title}</p>
              ) : null}
            </div>
          </motion.a>
        );
      })}
    </div>
  );
}
