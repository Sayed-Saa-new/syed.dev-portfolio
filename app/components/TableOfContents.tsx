"use client";

import { useEffect, useRef, useState, useCallback, useLayoutEffect } from "react";
import { useActiveSection } from "@/app/hooks/useActiveSection";
import type { TocHeading } from "@/app/lib/toc-utils";

interface TableOfContentsProps {
  headings: TocHeading[];
}

// X positions for SVG path (aligned with dot positions: -3 for H2, 11 for H3)
const X_H2 = 0;
const X_H3 = 14;

/**
 * Generate SVG path that traces the TOC structure with indents for H3s
 */
function generateTocPath(
  headings: TocHeading[],
  positions: Map<string, { top: number; level: number }>
): string {
  if (headings.length === 0) return "";

  let pathD = "";
  let prevX = X_H2;
  let prevY = 0;
  let isFirstPoint = true;

  headings.forEach((heading) => {
    const pos = positions.get(heading.slug);
    if (!pos) return;

    const x = heading.level === 2 ? X_H2 : X_H3;
    const y = pos.top;

    if (isFirstPoint) {
      pathD = `M ${x} ${y}`;
      isFirstPoint = false;
    } else {
      if (x === prevX) {
        // Same indent level - straight vertical line
        pathD += ` L ${x} ${y}`;
      } else if (x > prevX) {
        // Indenting (H2 → H3) - go down 30%, then angle right
        const midY = prevY + (y - prevY) * 0.3;
        pathD += ` L ${prevX} ${midY}`;
        pathD += ` L ${x} ${y}`;
      } else {
        // Outdenting (H3 → H2) - angle left at 70% down
        const midY = prevY + (y - prevY) * 0.7;
        pathD += ` L ${x} ${midY}`;
        pathD += ` L ${x} ${y}`;
      }
    }

    prevX = x;
    prevY = y;
  });

  return pathD;
}

/**
 * Check if the browser supports CSS anchor positioning
 */
function supportsAnchorPositioning(): boolean {
  if (typeof CSS === "undefined") return false;
  return CSS.supports("anchor-name", "--test");
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const headingIds = headings.map((h) => h.slug);
  const activeId = useActiveSection({ headingIds });
  const navRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [supportsAnchors, setSupportsAnchors] = useState(false);
  const [topPosition, setTopPosition] = useState(140);
  const [rightPosition, setRightPosition] = useState(16);
  const [isVisible, setIsVisible] = useState(true);
  const [pathData, setPathData] = useState("");
  const [progress, setProgress] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fixedTop = 140; // The fixed top position when scrolled


  // Check for anchor positioning support on mount
  useEffect(() => {
    setSupportsAnchors(supportsAnchorPositioning());
  }, []);

  // Track scroll position + horizontal alignment so TOC side padding
  // matches the content column's side padding from the page border.
  useEffect(() => {
    const contentWrapper = document.getElementById("article-content");
    if (!contentWrapper) return;


    const recalc = () => {
      const wrapperRect = contentWrapper.getBoundingClientRect();
      setTopPosition(Math.max(fixedTop, wrapperRect.top));
      const inner = contentWrapper.firstElementChild as HTMLElement | null;
      const innerRect = inner?.getBoundingClientRect();
      const contentLeft = innerRect ? innerRect.left : wrapperRect.left;
      const sidePadding = Math.max(16, contentLeft);
      setRightPosition(sidePadding);
      const tocHeight = navRef.current?.offsetHeight ?? 300;
      const bottomThreshold = Math.max(fixedTop, wrapperRect.top) + tocHeight;
      setIsVisible(wrapperRect.bottom > bottomThreshold);

      // Reading progress: how far through the article we've scrolled.
      const total = wrapperRect.height - window.innerHeight;
      const scrolled = -wrapperRect.top;
      const pct =
        total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0;
      setProgress(pct);
    };


    recalc();

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          recalc();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", recalc);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", recalc);
    };
  }, []);

  // Calculate SVG path for the line
  const calculatePath = useCallback(() => {
    if (!contentRef.current || headings.length === 0) return;

    const positions = new Map<string, { top: number; level: number }>();
    const containerRect = contentRef.current.getBoundingClientRect();

    headings.forEach((h) => {
      const link = contentRef.current?.querySelector(`a[href="#${h.slug}"]`);
      if (link) {
        const rect = link.getBoundingClientRect();
        positions.set(h.slug, {
          top: rect.top - containerRect.top + rect.height / 2,
          level: h.level,
        });
      }
    });

    const newPath = generateTocPath(headings, positions);
    setPathData(newPath);
  }, [headings]);

  // Calculate path on mount
  useLayoutEffect(() => {
    const timer = setTimeout(calculatePath, 50);
    return () => clearTimeout(timer);
  }, [calculatePath]);

  // Recalculate path on resize
  useEffect(() => {
    window.addEventListener("resize", calculatePath);
    return () => window.removeEventListener("resize", calculatePath);
  }, [calculatePath]);

  // Update indicator position (handles both vertical and horizontal positioning)
  const updateIndicatorPosition = useCallback(() => {
    if (!activeId || !navRef.current || !indicatorRef.current) return;

    const activeLink = navRef.current.querySelector(
      `a[href="#${activeId}"]`,
    ) as HTMLElement | null;

    if (!activeLink) return;

    const tocContent = navRef.current.querySelector(".toc-content");
    if (!tocContent) return;

    const contentRect = tocContent.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    // Calculate vertical position (center of the link)
    const top = linkRect.top - contentRect.top + linkRect.height / 2;

    // Calculate horizontal position based on link's padding
    // H3 links have padding-left, so the dot should shift right
    const isH3 = activeLink.classList.contains("toc-link--h3");
    const left = isH3 ? 11 : -3; // Shift right for H3s to align with indented text

    indicatorRef.current.style.top = `${top}px`;
    indicatorRef.current.style.left = `${left}px`;
  }, [activeId]);

  // Trigger moving animation and update position
  useEffect(() => {
    if (!activeId) return;

    setIsMoving(true);
    const timer = setTimeout(() => setIsMoving(false), 600);

    // Update CSS anchor-name for anchor positioning browsers
    if (supportsAnchors && navRef.current) {
      const links = navRef.current.querySelectorAll("a[data-toc-link]");
      links.forEach((link) => {
        (link as HTMLElement).style.removeProperty("anchor-name");
      });

      const activeLink = navRef.current.querySelector(`a[href="#${activeId}"]`);
      if (activeLink) {
        // Use setProperty for CSS anchor-name (not yet in TypeScript CSSStyleDeclaration)
        (activeLink as HTMLElement).style.setProperty(
          "anchor-name",
          "--toc-active",
        );
      }
    }

    // Always update position via JS (CSS anchor positioning doesn't handle horizontal shift for H3s)
    updateIndicatorPosition();

    return () => clearTimeout(timer);
  }, [activeId, supportsAnchors, updateIndicatorPosition]);

  // Handle smooth scroll on link click
  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    slug: string,
  ) => {
    e.preventDefault();
    const element = document.getElementById(slug);
    if (element) {
      const top =
        element.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: "smooth" });
      // replaceState keeps back-button behavior clean while still updating the URL.
      window.history.replaceState(null, "", `#${slug}`);
    }
  };

  // Copy deep-link (URL#slug) to clipboard.
  const handleCopyLink = async (
    e: React.MouseEvent<HTMLButtonElement>,
    slug: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const url = `${window.location.origin}${window.location.pathname}#${slug}`;
      await navigator.clipboard.writeText(url);
      setCopiedId(slug);
      setTimeout(() => setCopiedId((prev) => (prev === slug ? null : prev)), 1200);
    } catch {
      /* clipboard unavailable — silently ignore */
    }
  };

  // Don't render if no headings
  if (headings.length === 0) return null;

  return (
    <nav
      ref={navRef}
      role="navigation"
      aria-labelledby="toc-heading"
      className="toc-container"
      style={{
        top: `${topPosition}px`,
        right: `${rightPosition}px`,
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
        transition: "opacity 200ms ease-out",
      }}
      aria-hidden={!isVisible}
    >

      <div ref={contentRef} className="toc-content">
        <div className="toc-header">
          <h2 id="toc-heading" className="toc-label">
            On this page
          </h2>
          <div className="toc-progress" aria-hidden="true">
            <span
              className="toc-progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* SVG path showing the TOC structure */}
        <svg className="toc-path-svg" aria-hidden="true">
          {pathData && (
            <path d={pathData} className="toc-path-line" fill="none" />
          )}
        </svg>

        {/* The animated dot indicator */}
        <span
          ref={indicatorRef}
          className={`toc-indicator ${activeId ? "toc-indicator--visible" : ""} ${isMoving ? "toc-indicator--moving" : ""}`}
          aria-hidden="true"
        />

        <ul className="toc-list">
          {headings.map((heading) => {
            const isActive = activeId === heading.slug;
            const isCopied = copiedId === heading.slug;
            return (
              <li key={heading.slug} className="toc-item">
                <a
                  href={`#${heading.slug}`}
                  data-toc-link
                  aria-current={isActive ? "location" : undefined}
                  className={`toc-link toc-link--h${heading.level} ${isActive ? "toc-link--active" : ""}`}
                  onClick={(e) => handleLinkClick(e, heading.slug)}
                >
                  <span className="toc-link-text">{heading.text}</span>
                  <button
                    type="button"
                    className="toc-copy"
                    aria-label={isCopied ? "Link copied" : "Copy link to section"}
                    title={isCopied ? "Copied!" : "Copy link"}
                    onClick={(e) => handleCopyLink(e, heading.slug)}
                  >
                    {isCopied ? (
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5" />
                        <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5" />
                      </svg>
                    )}
                  </button>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
