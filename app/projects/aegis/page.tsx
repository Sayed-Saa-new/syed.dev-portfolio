import Image from "next/image";
import Link from "next/link";
import { GridWrapper } from "@/app/components/GridWrapper";
import { BentoCard } from "@/app/components/BentoCard";
import { MotionFadeIn } from "@/app/components/MotionFadeIn";
import { HorizontalLine } from "@/app/components/HorizontalLine";

export const metadata = {
  title:
    "Aegis Authenticator — Zero-Knowledge 2FA (Google Authenticator Alternative) by Syed",
  description:
    "Aegis Authenticator by Syed (Abushaid Islam) — an end-to-end encrypted, zero-knowledge TOTP 2FA app for web (PWA), Chrome extension and Windows desktop. A privacy-first alternative to Google Authenticator and Authy.",
  keywords: [
    "Aegis Authenticator",
    "zero knowledge 2FA",
    "end to end encrypted authenticator",
    "Google Authenticator alternative",
    "Authy alternative",
    "TOTP authenticator app",
    "open source authenticator",
    "encrypted 2FA app",
    "Syed",
    "Abushaid Islam",
  ],
  alternates: { canonical: "/projects/aegis" },
  openGraph: {
    title: "Aegis Authenticator — Zero-Knowledge 2FA by Syed",
    description:
      "Privacy-first, end-to-end encrypted TOTP 2FA — a Google Authenticator & Authy alternative. Web PWA + Chrome extension + Windows desktop.",
    url: "/projects/aegis",
    type: "article",
    images: [
      {
        url: "/projects/aegis-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Aegis Authenticator by Syed",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aegis Authenticator — Zero-Knowledge 2FA by Syed",
    description:
      "End-to-end encrypted 2FA — a privacy-first Google Authenticator & Authy alternative.",
    images: ["/projects/aegis-cover.jpg"],
  },
};

const stack = [
  "React 19",
  "TanStack Start",
  "TypeScript",
  "Supabase",
  "Web Crypto API",
  "AES-256-GCM",
  "Argon2id",
  "Electron",
  "Tailwind CSS",
];

const platforms = [
  {
    title: "Web PWA",
    tagline: "Installable on any device",
    description:
      "Runs entirely in the browser as a Progressive Web App — install it on iOS, Android, macOS or Windows straight from the site.",
  },
  {
    title: "Chrome Extension",
    tagline: "One click, autofill 2FA codes",
    description:
      "Autofills TOTP codes into login forms so you never have to switch to your phone mid-login.",
  },
  {
    title: "Windows Desktop",
    tagline: "Native app for daily drivers",
    description:
      "Electron-based desktop client with global shortcuts, tray access and offline-first vault.",
  },
];

const features = [
  {
    title: "Zero-Knowledge Encryption",
    body: "Your master password never leaves the device. Secrets are encrypted with AES-256-GCM using a key derived via Argon2id — the server only ever sees ciphertext.",
  },
  {
    title: "End-to-End Sync",
    body: "Vault syncs across web, extension and desktop through Supabase, but every field is encrypted before it leaves your device. Not even I can read it.",
  },
  {
    title: "Offline First",
    body: "Codes generate locally from RFC 6238 TOTP. No network round-trip, no waiting — works on a plane, in a tunnel, anywhere.",
  },
  {
    title: "Import from Anywhere",
    body: "One-tap import from Google Authenticator, Authy and 2FAS via QR export — bring your entire vault in under a minute.",
  },
];

export default function AegisProjectPage() {
  return (
    <div className="relative mt-14">
      <title>Aegis Authenticator | Syed</title>

      <div className="relative space-y-10 md:space-y-16">
        {/* Hero */}
        <MotionFadeIn>
          <GridWrapper className="space-y-8">
            <div className="text-center text-sm font-medium text-indigo-600">
              <span>Case Study</span>
            </div>
            <h1 className="mx-auto max-w-3xl text-balance text-center text-4xl font-medium leading-tight tracking-tighter text-text-primary md:text-6xl md:leading-[64px]">
              Aegis Authenticator — zero-knowledge 2FA for the modern web.
            </h1>
            <p className="mx-auto max-w-2xl text-balance text-center text-base leading-8 text-text-secondary md:text-lg">
              A privacy-first alternative to Google Authenticator &amp; Authy.
              End-to-end encrypted, cross-platform, and built to make
              two-factor authentication feel effortless.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="https://aegis-syed.lovable.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-text-primary px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
              >
                Visit Aegis
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 8L8 2M8 2H3M8 2V7" />
                </svg>
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-full border border-border-primary bg-white px-5 py-2.5 text-sm font-medium text-text-secondary transition hover:text-text-primary"
              >
                All projects
              </Link>
            </div>
          </GridWrapper>
        </MotionFadeIn>

        {/* Cover */}
        <MotionFadeIn delay={0.1} y={30}>
          <GridWrapper>
            <div className="relative mx-auto aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border-primary bg-[#F5EEDF]">
              <Image
                src="/projects/aegis-cover.jpg"
                alt="Aegis Authenticator — zero-knowledge 2FA"
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
                priority
              />
            </div>
          </GridWrapper>
        </MotionFadeIn>

        <HorizontalLine />

        {/* Overview */}
        <MotionFadeIn y={30}>
          <GridWrapper className="space-y-4">
            <div className="text-center text-sm font-medium text-indigo-600">
              <span>Overview</span>
            </div>
            <h2 className="mx-auto max-w-xl text-balance text-center text-3xl font-medium leading-[40px] tracking-tighter text-text-primary">
              A 2FA app where the server never sees your secrets.
            </h2>
          </GridWrapper>
        </MotionFadeIn>

        <MotionFadeIn delay={0.1} y={30}>
          <GridWrapper>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-12">
              <div className="md:col-span-7">
                <BentoCard
                  height="h-full"
                  colSpan={7}
                  rowSpan={6}
                  className="min-h-[240px]"
                >
                  <h3 className="mb-3 text-lg font-medium text-text-primary">
                    The problem
                  </h3>
                  <p className="text-base leading-7 text-text-secondary">
                    Most 2FA apps trap your codes on a single device or store
                    unencrypted backups in the cloud. Losing the phone means
                    losing account access — and syncing means trusting a
                    vendor with the keys to your kingdom.
                  </p>
                </BentoCard>
              </div>
              <div className="md:col-span-5">
                <BentoCard
                  height="h-full"
                  colSpan={5}
                  rowSpan={6}
                  className="min-h-[240px]"
                >
                  <h3 className="mb-3 text-lg font-medium text-text-primary">
                    The approach
                  </h3>
                  <p className="text-base leading-7 text-text-secondary">
                    Encrypt everything client-side with a key only you can
                    derive. Sync ciphertext across devices. Never let a
                    server, an admin, or me ever read a single secret.
                  </p>
                </BentoCard>
              </div>
            </div>
          </GridWrapper>
        </MotionFadeIn>

        <HorizontalLine />

        {/* Features */}
        <MotionFadeIn y={30}>
          <GridWrapper className="space-y-4">
            <div className="text-center text-sm font-medium text-indigo-600">
              <span>Features</span>
            </div>
            <h2 className="mx-auto max-w-xl text-balance text-center text-3xl font-medium leading-[40px] tracking-tighter text-text-primary">
              Built on serious cryptography, wrapped in a simple UI.
            </h2>
          </GridWrapper>
        </MotionFadeIn>

        <MotionFadeIn delay={0.1} y={30}>
          <GridWrapper>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {features.map((f) => (
                <BentoCard
                  key={f.title}
                  height="h-full"
                  colSpan={6}
                  rowSpan={4}
                  className="min-h-[180px]"
                >
                  <h3 className="mb-2 text-lg font-medium text-text-primary">
                    {f.title}
                  </h3>
                  <p className="text-base leading-7 text-text-secondary">
                    {f.body}
                  </p>
                </BentoCard>
              ))}
            </div>
          </GridWrapper>
        </MotionFadeIn>

        <HorizontalLine />

        {/* Platforms */}
        <MotionFadeIn y={30}>
          <GridWrapper className="space-y-4">
            <div className="text-center text-sm font-medium text-indigo-600">
              <span>Platforms</span>
            </div>
            <h2 className="mx-auto max-w-xl text-balance text-center text-3xl font-medium leading-[40px] tracking-tighter text-text-primary">
              One vault. Web, extension and desktop.
            </h2>
          </GridWrapper>
        </MotionFadeIn>

        <MotionFadeIn delay={0.1} y={30}>
          <GridWrapper>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              {platforms.map((p) => (
                <BentoCard
                  key={p.title}
                  height="h-full"
                  colSpan={4}
                  rowSpan={4}
                  className="min-h-[200px]"
                >
                  <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-text-tertiary">
                    {p.tagline}
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-text-primary">
                    {p.title}
                  </h3>
                  <p className="text-sm leading-7 text-text-secondary">
                    {p.description}
                  </p>
                </BentoCard>
              ))}
            </div>
          </GridWrapper>
        </MotionFadeIn>

        <HorizontalLine />

        {/* Stack */}
        <MotionFadeIn y={30}>
          <GridWrapper className="space-y-4">
            <div className="text-center text-sm font-medium text-indigo-600">
              <span>Tech Stack</span>
            </div>
            <h2 className="mx-auto max-w-xl text-balance text-center text-3xl font-medium leading-[40px] tracking-tighter text-text-primary">
              The tools that make Aegis tick.
            </h2>
          </GridWrapper>
        </MotionFadeIn>

        <MotionFadeIn delay={0.1} y={30}>
          <GridWrapper>
            <BentoCard height="h-full" className="min-h-[160px]">
              <div className="flex flex-wrap gap-2">
                {stack.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border-primary bg-bg-secondary px-3 py-1.5 text-sm text-text-secondary"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </BentoCard>
          </GridWrapper>
        </MotionFadeIn>

        <HorizontalLine />

        {/* CTA */}
        <MotionFadeIn y={30}>
          <GridWrapper>
            <BentoCard height="h-full" className="min-h-[220px]">
              <div className="flex h-full flex-col items-center justify-center gap-4 py-8 text-center">
                <h2 className="max-w-lg text-balance text-3xl font-medium leading-[40px] tracking-tighter text-text-primary">
                  Try Aegis and take your 2FA private.
                </h2>
                <p className="max-w-md text-base leading-7 text-text-secondary">
                  Free, open and end-to-end encrypted. Import your existing
                  vault in seconds.
                </p>
                <Link
                  href="https://aegis-syed.lovable.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-text-primary px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Launch Aegis
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 8L8 2M8 2H3M8 2V7" />
                  </svg>
                </Link>
              </div>
            </BentoCard>
          </GridWrapper>
        </MotionFadeIn>
      </div>
    </div>
  );
}
