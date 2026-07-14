"use client";

import Link from "next/link";
import { SocialPill } from "./SocialPill";
import { usePathname } from "next/navigation";
import { CloseButton, Dialog, DialogPanel } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

type NavigationLink = {
  name: string;
  link: string;
};

const navigationLinks: readonly NavigationLink[] = [
  { name: "Home", link: "/" },
  { name: "About", link: "/about" },
  { name: "Blog", link: "/blog" },
  { name: "Projects", link: "/projects" },
  { name: "Speaking", link: "/speaking" },
  { name: "Toolbox", link: "/toolbox" },
] as const;

const Navbar: React.FC = () => {
  return (
    <header role="banner">
      <DesktopNav />
      <MobileNav />
    </header>
  );
};

function DesktopNav() {
  const path = usePathname();
  const navRef = useRef<HTMLUListElement | null>(null);
  const spotlightX = useRef(0);
  const ambienceX = useRef(0);

  const activeIndex = Math.max(
    0,
    navigationLinks.findIndex((l) => l.link === path),
  );

  // Move ambience (active pill glow) whenever active index changes
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const activeItem = nav.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`,
    );
    if (!activeItem) return;

    const navRect = nav.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();
    const targetX = itemRect.left - navRect.left + itemRect.width / 2;

    animate(ambienceX.current, targetX, {
      type: "spring",
      stiffness: 200,
      damping: 20,
      onUpdate: (v) => {
        ambienceX.current = v;
        nav.style.setProperty("--ambience-x", `${v}px`);
      },
    });

    // Initialize spotlight to sit on active item on first render
    if (spotlightX.current === 0) {
      spotlightX.current = targetX;
      nav.style.setProperty("--spotlight-x", `${targetX}px`);
    }
  }, [activeIndex]);

  // Mouse tracking for spotlight
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = nav.getBoundingClientRect();
      const x = e.clientX - rect.left;
      spotlightX.current = x;
      nav.style.setProperty("--spotlight-x", `${x}px`);
    };

    const handleMouseLeave = () => {
      const activeItem = nav.querySelector<HTMLElement>(
        `[data-index="${activeIndex}"]`,
      );
      if (!activeItem) return;
      const navRect = nav.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      const targetX = itemRect.left - navRect.left + itemRect.width / 2;

      animate(spotlightX.current, targetX, {
        type: "spring",
        stiffness: 200,
        damping: 20,
        onUpdate: (v) => {
          spotlightX.current = v;
          nav.style.setProperty("--spotlight-x", `${v}px`);
        },
      });
    };

    nav.addEventListener("mousemove", handleMouseMove);
    nav.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      nav.removeEventListener("mousemove", handleMouseMove);
      nav.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [activeIndex]);

  return (
    <nav
      aria-label="Desktop navigation"
      className="hidden h-16 w-full items-center justify-between border-b border-border-primary/50 px-4 md:flex"
    >
      <div className="w-[104px]">
        <Link href="/" aria-label="Home">
          <img className="h-8 w-8" src="/syed_logo.png" alt="Syed's Logo" />
        </Link>
      </div>

      <ul
        ref={navRef}
        className="spotlight-nav relative flex place-items-center gap-1 overflow-hidden rounded-full border border-border-primary bg-white/60 px-2 py-1.5 text-sm backdrop-blur-md"
      >
        {/* Ambience: soft glow under active item */}
        <span
          aria-hidden
          className="pointer-events-none absolute top-1/2 h-16 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-2xl"
          style={{
            left: "var(--ambience-x, -200px)",
            background:
              "radial-gradient(circle, rgba(108,71,255,0.35), transparent 60%)",
          }}
        />
        {/* Spotlight: follows cursor */}
        <span
          aria-hidden
          className="pointer-events-none absolute top-1/2 h-12 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-xl"
          style={{
            left: "var(--spotlight-x, -200px)",
            background:
              "radial-gradient(circle, rgba(108,71,255,0.5), transparent 70%)",
          }}
        />

        {navigationLinks.map((link, idx) => {
          const isActive = idx === activeIndex;
          return (
            <li key={link.name} data-index={idx} className="relative z-10">
              <Link
                href={link.link}
                prefetch={true}
                className={`relative rounded-full px-4 py-1.5 font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-text-primary"
                    : "text-gray-500 hover:text-text-primary"
                }`}
              >
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>

      <SocialPill />
    </nav>
  );
}

function MobileNav() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const path = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [path]);

  return (
    <nav
      aria-label="Mobile navigation"
      className="flex h-16 items-center justify-between gap-2.5 border-b border-border-primary/50 px-3 md:hidden"
    >
      <NavLogo onClickCallback={setIsOpen} />

      <CircleBtn
        onClickCallback={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label="Toggle menu"
      />

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 z-50 bg-bg-primary py-1 focus:outline-none md:hidden"
      >
        <DialogPanel id="mobile-menu" className="size-full overflow-y-auto">
          <div className="flex h-14 items-center justify-between px-3">
            <NavLogo onClickCallback={setIsOpen} />
            <CloseButton className="rounded-full border border-border-primary p-2">
              <svg viewBox="0 0 16 16" fill="currentColor" className="h-5 w-5">
                <path
                  fill="#3C3C3F"
                  d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z"
                ></path>
              </svg>
            </CloseButton>
          </div>
          <div className="grid grid-cols-1 gap-1 px-1 pb-1 sm:px-3 sm:pb-3">
            {navigationLinks.map(({ name, link }) => (
              <Link
                href={link}
                key={link}
                className={`rounded-lg px-3 py-2 text-xl/9 font-medium ${
                  path === link ? "text-text-primary" : "text-text-secondary"
                } data-active:bg-gray-950/5`}
                aria-current={path === link ? "page" : undefined}
              >
                {name}
              </Link>
            ))}
          </div>
        </DialogPanel>
      </Dialog>
    </nav>
  );
}

interface NavLogoProps {
  onClickCallback: (value: boolean) => void;
}

const NavLogo: React.FC<NavLogoProps> = ({ onClickCallback }) => {
  return (
    <Link href="/" onClick={() => onClickCallback(false)} aria-label="Home">
      <img className="h-9 w-9" src="/syed_logo.png" alt="Syed's Logo" />
    </Link>
  );
};

interface CircleBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClickCallback: () => void;
  "aria-expanded": boolean;
  "aria-controls": string;
  "aria-label": string;
}

const CircleBtn = ({
  onClickCallback,
  className = "",
  ...props
}: CircleBtnProps): JSX.Element => {
  return (
    <button
      className={`rounded-full border border-border-primary p-2 ${className}`}
      onClick={onClickCallback}
      {...props}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M0 4.99599C0 4.77599 0.105357 4.56501 0.292893 4.40945C0.48043 4.2539 0.734784 4.1665 1 4.1665H19C19.2652 4.1665 19.5196 4.2539 19.7071 4.40945C19.8946 4.56501 20 4.77599 20 4.99599C20 5.21598 19.8946 5.42696 19.7071 5.58252C19.5196 5.73808 19.2652 5.82547 19 5.82547H1C0.734784 5.82547 0.48043 5.73808 0.292893 5.58252C0.105357 5.42696 0 5.21598 0 4.99599ZM5 9.99942C5 9.77943 5.10536 9.56845 5.29289 9.41289C5.48043 9.25733 5.73478 9.16994 6 9.16994H19C19.2652 9.16994 19.5196 9.25733 19.7071 9.41289C19.8946 9.56845 20 9.77943 20 9.99942C20 10.2194 19.8946 10.4304 19.7071 10.586C19.5196 10.7415 19.2652 10.8289 19 10.8289H6C5.73478 10.8289 5.48043 10.7415 5.29289 10.586C5.10536 10.4304 5 10.2194 5 9.99942ZM11.8333 14.1742C11.5681 14.1742 11.3138 14.2616 11.1262 14.4172C10.9387 14.5727 10.8333 14.7837 10.8333 15.0037C10.8333 15.2237 10.9387 15.4347 11.1262 15.5902C11.3138 15.7458 11.5681 15.8332 11.8333 15.8332H19C19.2652 15.8332 19.5196 15.7458 19.7071 15.5902C19.8946 15.4347 20 15.2237 20 15.0037C20 14.7837 19.8946 14.5727 19.7071 14.4172C19.5196 14.2616 19.2652 14.1742 19 14.1742H11.8333Z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
};

export default Navbar;
