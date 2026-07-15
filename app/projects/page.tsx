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
  return (
    <BentoCard
      linkTo={project.url}
      hideOverflow={true}
      className="!p-0 md:min-h-[420px]"
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left: image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F5EEDF] md:aspect-auto md:min-h-[420px]">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            priority
          />
        </div>

        {/* Right: details */}
        <div className="flex flex-col justify-between gap-6 p-7 md:p-10">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-text-tertiary">
              <span
                className={`inline-flex h-1.5 w-1.5 rounded-full ${
                  project.status === "Live" ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              {project.status}
              <span className="text-border-secondary">·</span>
              <span>{project.year}</span>
            </div>

            <h2 className="mt-3 text-2xl font-medium leading-tight tracking-tight text-text-primary md:text-3xl">
              {project.title}
            </h2>
            <p className="mt-1 text-sm text-text-secondary md:text-base">
              {project.tagline}
            </p>

            <p className="mt-5 text-sm leading-6 text-text-secondary">
              {project.description}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-1.5">
              {project.stack.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border-primary bg-bg-secondary px-2.5 py-1 text-[11px] text-text-secondary"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[11px] text-text-tertiary">
              {project.platforms.map((p, i) => (
                <span key={p} className="inline-flex items-center gap-2">
                  {i > 0 && <span className="text-border-secondary">·</span>}
                  {p}
                </span>
              ))}
            </div>

            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600">
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
            </div>
          </div>
        </div>
      </div>
    </BentoCard>
  );
}
