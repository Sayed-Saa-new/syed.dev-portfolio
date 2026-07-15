import Image from "next/image";
import { GridWrapper } from "@/app/components/GridWrapper";
import { BentoCard } from "@/app/components/BentoCard";
import { MotionFadeIn } from "@/app/components/MotionFadeIn";

interface Project {
  title: string;
  tagline: string;
  description: string;
  image: string;
  url: string;
  stack: string[];
  platforms: string[];
  status: "Live" | "In Progress" | "Beta";
  year: string;
}

const projects: Project[] = [
  {
    title: "Aegis Authenticator",
    tagline: "Zero-Knowledge TOTP Authenticator",
    description:
      "End-to-end encrypted two-factor authentication that runs as a PWA, browser extension and Windows desktop app — a privacy-first alternative to Google Authenticator & Authy where the server never sees your secrets.",
    image: "/projects/aegis-cover.jpg",
    url: "https://aegis-syed.lovable.app",
    stack: ["React 19", "TanStack Start", "Supabase", "Web Crypto", "Electron"],
    platforms: ["Web PWA", "Chrome Extension", "Windows Desktop"],
    status: "Live",
    year: "2025 – 2026",
  },
];

export const metadata = {
  title: "Projects — Aegis Authenticator & Full Stack Apps by Syed",
  description:
    "Aegis Authenticator by Syed (Abushaid Islam) — a zero-knowledge, end-to-end encrypted TOTP 2FA app (Google Authenticator / Authy alternative), plus more AI and full-stack projects.",
  keywords: [
    "Aegis Authenticator",
    "zero knowledge 2FA",
    "end to end encrypted authenticator",
    "Google Authenticator alternative",
    "Authy alternative",
    "TOTP authenticator app",
    "Syed projects",
    "Abushaid Islam projects",
  ],
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects — Aegis Authenticator & Full Stack Apps by Syed",
    description:
      "Aegis Authenticator: a privacy-first, zero-knowledge alternative to Google Authenticator & Authy — plus more work by Syed.",
    url: "/projects",
    images: ["/projects/aegis-cover.jpg"],
  },
};

export default function ProjectPage() {
  return (
    <div className="relative space-y-16 pb-24">
      <title>Projects | Syed</title>

      <MotionFadeIn duration={0.8} y={40}>
        <GridWrapper>
          <h1 className="mx-auto mt-16 max-w-2xl text-balance text-center text-4xl font-medium leading-tight tracking-tighter text-text-primary md:text-6xl md:leading-[64px]">
            A collection of my favorite works.
          </h1>
        </GridWrapper>
      </MotionFadeIn>

      <GridWrapper>
        <div className="mx-auto max-w-6xl space-y-8 px-4">
          {projects.map((project, i) => (
            <MotionFadeIn key={project.title} delay={0.1 + i * 0.1} y={40}>
              <ProjectBentoCard project={project} />
            </MotionFadeIn>
          ))}
        </div>
      </GridWrapper>
    </div>
  );
}

function ProjectBentoCard({ project }: { project: Project }) {
  const isLive = project.status === "Live";
  return (
    <BentoCard
      linkTo={project.url}
      hideOverflow={true}
      className="!p-0 md:min-h-[440px]"
    >
      <div className="grid grid-cols-1 md:grid-cols-[1.05fr_1fr]">
        {/* Left: image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F5EEDF] md:aspect-auto md:min-h-[440px]">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            priority
          />
          {/* subtle inner border for depth on light images */}
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/[0.04]" />
          {/* soft top gradient to lift the status badge */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/15 to-transparent" />

          {/* Floating status pill */}
          <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-[0.14em] text-neutral-800 shadow-sm backdrop-blur-md ring-1 ring-black/[0.04]">
            <span className="relative inline-flex h-1.5 w-1.5">
              <span
                className={`absolute inline-flex h-full w-full rounded-full opacity-60 ${
                  isLive ? "animate-ping bg-emerald-500" : "bg-amber-500"
                }`}
              />
              <span
                className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
                  isLive ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
            </span>
            {project.status}
          </div>
        </div>

        {/* Right: details */}
        <div className="flex flex-col justify-between gap-8 p-7 md:p-10">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-text-tertiary">
              {project.year}
            </p>

            <h2 className="mt-3 text-[26px] font-medium leading-[1.1] tracking-tight text-text-primary md:text-[32px]">
              {project.title}
            </h2>
            <p className="mt-2 text-[15px] leading-snug text-text-secondary md:text-base">
              {project.tagline}
            </p>

            <div className="mt-5 h-px w-10 bg-border-primary" />

            <p className="mt-5 text-[14px] leading-[1.65] text-text-secondary">
              {project.description}
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-text-tertiary">
                Stack
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-border-primary bg-bg-secondary px-2 py-[3px] text-[11px] font-medium text-text-secondary"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-text-tertiary">
              {project.platforms.map((p, i) => (
                <span key={p} className="inline-flex items-center gap-3">
                  {i > 0 && (
                    <span className="text-border-secondary">•</span>
                  )}
                  {p}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-border-primary pt-4">
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 transition-transform duration-300 group-hover:translate-x-0.5">
                Visit {project.title}
                <svg
                  width="3"
                  height="6"
                  viewBox="0 0 3 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="relative mt-px overflow-visible"
                >
                  <path d="M0 0L3 3L0 6" />
                </svg>
              </span>
              <span className="text-[11px] uppercase tracking-[0.14em] text-text-tertiary">
                Case Study →
              </span>
            </div>
          </div>
        </div>
      </div>
    </BentoCard>
  );
}
