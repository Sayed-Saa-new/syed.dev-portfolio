"use client";

import { useEffect } from "react";

/**
 * Enables deep-link behavior for #slug URLs on the article page.
 *
 * The browser's native hash jump fires before MDX/reveal animations mount,
 * so headings often don't exist yet — or exist at the wrong position — when
 * it runs. This component:
 *   1. Waits (polls) for the target heading to exist in the DOM.
 *   2. Smooth-scrolls to it with a 120px top offset (matches CSS scroll-margin).
 *   3. Re-runs on hashchange so in-page hash navigation is consistent.
 */
export function HashScroller({ offset = 120 }: { offset?: number }) {
  useEffect(() => {
    let cancelled = false;

    const scrollToHash = (hash: string) => {
      if (!hash) return;
      const id = decodeURIComponent(hash.replace(/^#/, ""));
      if (!id) return;

      const start = performance.now();
      const tryScroll = () => {
        if (cancelled) return;
        const el = document.getElementById(id);
        if (el) {
          const top =
            el.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: "smooth" });
          return;
        }
        // Poll up to 3s while MDX / images settle.
        if (performance.now() - start < 3000) {
          requestAnimationFrame(tryScroll);
        }
      };
      tryScroll();
    };

    // On initial mount
    if (window.location.hash) {
      // Cancel native jump, then smooth-scroll with offset.
      window.scrollTo({ top: 0 });
      scrollToHash(window.location.hash);
    }

    const onHashChange = () => scrollToHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      cancelled = true;
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [offset]);

  return null;
}
