"use client";

import { useState, useEffect, useRef } from "react";

interface UseActiveSectionOptions {
  headingIds: string[];
  /** Distance from top of viewport considered the "reading line". */
  topOffset?: number;
}

/**
 * Tracks the currently-active section heading using IntersectionObserver.
 *
 * Strategy:
 * - Observe every heading with a rootMargin that creates a thin "activation
 *   band" just below the fixed header (topOffset). A heading is considered
 *   in-view when its top crosses that band.
 * - IO callbacks fire on every intersection change (including subtle ones
 *   during momentum scroll), so we always pick the heading whose top is
 *   closest to — but not below — the activation line, using live
 *   getBoundingClientRect() for accuracy.
 * - A scroll listener acts as a fallback for edge cases (very short
 *   sections, rapid scrolls, hash jumps) where IO alone can lag.
 */
export function useActiveSection({
  headingIds,
  topOffset = 120,
}: UseActiveSectionOptions): string | null {
  const [activeId, setActiveId] = useState<string | null>(
    headingIds[0] ?? null,
  );
  const activeIdRef = useRef<string | null>(activeId);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    if (headingIds.length === 0) return;

    const getElements = () =>
      headingIds
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null);

    const computeActive = () => {
      const elements = getElements();
      if (elements.length === 0) return;

      // Bottom-of-page guard: if we're near the bottom, activate the last heading.
      const scrollBottom = window.scrollY + window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      if (docHeight - scrollBottom < 4) {
        const last = elements[elements.length - 1];
        if (last.id !== activeIdRef.current) setActiveId(last.id);
        return;
      }

      // Pick the last heading whose top is at or above the activation line.
      let current: HTMLElement | null = null;
      for (const el of elements) {
        const top = el.getBoundingClientRect().top;
        if (top - topOffset <= 1) {
          current = el;
        } else {
          break;
        }
      }
      // If none passed yet, keep the first heading as the default.
      if (!current) current = elements[0];

      if (current.id !== activeIdRef.current) {
        setActiveId(current.id);
      }
    };

    // IntersectionObserver: thin activation band at topOffset.
    // rootMargin top: -topOffset (line sits topOffset below viewport top)
    // rootMargin bottom: -(viewportHeight - topOffset - 1) so the band is 1px tall.
    const buildObserver = () => {
      const vh = window.innerHeight;
      const bottomMargin = Math.max(0, vh - topOffset - 1);
      const observer = new IntersectionObserver(() => computeActive(), {
        root: null,
        rootMargin: `-${topOffset}px 0px -${bottomMargin}px 0px`,
        threshold: [0, 1],
      });
      getElements().forEach((el) => observer.observe(el));
      return observer;
    };

    let observer = buildObserver();
    computeActive();

    // Scroll fallback (throttled via rAF) — handles fast scrolls and hash jumps.
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        computeActive();
        ticking = false;
      });
    };

    const onResize = () => {
      observer.disconnect();
      observer = buildObserver();
      computeActive();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [headingIds.join("|"), topOffset]);

  return activeId;
}
