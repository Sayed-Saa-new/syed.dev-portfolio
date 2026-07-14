import { ResumeData } from "../lib/resume/types";
import { Timeline } from "./Timeline";

const resumeData: ResumeData = {
  experiences: [
    {
      company: "Open to Opportunities",
      period: "2026 — Present",
      positions: [
        {
          title: "Software & AI Engineer · Full-Stack Developer",
          description: [
            "Actively looking for full-time roles, internships, and freelance collaborations focused on AI-powered products, secure authentication systems, and modern full-stack web experiences.",
            "Comfortable across the stack — React, TypeScript, Node, Supabase, Postgres, Web Crypto, and modern AI tooling (Claude, GPT, RAG, agents).",
          ],
        },
      ],
    },
    {
      company: "Aegis Authenticator",
      period: "2025 — 2026",
      positions: [
        {
          title: "Founder · Solo Engineer",
          description: [
            "Designed and built a zero-knowledge, end-to-end encrypted TOTP authenticator as a PWA, Chrome extension, and Windows desktop app — a privacy-first alternative to Google Authenticator and Authy.",
            "Implemented the full crypto stack (AES-GCM, PBKDF2, Argon2id, X25519) using the Web Crypto API, with Supabase (Postgres + Auth + RLS + Edge Functions) as the encrypted sync layer.",
            "Shipped a Stripe-powered subscription model, cross-platform sync via IndexedDB and Service Workers, and an Electron desktop build.",
          ],
        },
      ],
    },
    {
      company: "Independent Projects & Freelance",
      period: "2024 — Present",
      positions: [
        {
          title: "Full-Stack & AI Engineer",
          description: [
            "Building AI-powered products, portfolio sites, and internal tools using React, TanStack Start, Next.js, Tailwind, and Supabase.",
            "Focus areas: authentication systems, encrypted user data, LLM integrations (Claude / GPT), and clean, minimal UI.",
          ],
        },
      ],
    },
  ],
  avatarUrl: "/syed_headshot_1.jpg",
};

export function Resume() {
  return (
    <div>
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative">
          <div className="divide-y divide-gray-100">
            {resumeData.experiences.map((experience) => (
              <div
                key={experience.company}
                className="grid grid-cols-[1fr,5fr] gap-6 py-12 first:pt-0 last:pb-0 md:grid-cols-[2fr,1fr,4fr]"
              >
                <div className="hidden md:block">
                  <h3 className="text-xl font-bold">{experience.company}</h3>
                  <p className="text-sm text-gray-600">{experience.period}</p>
                </div>

                <div />

                <div className="space-y-6">
                  {experience.positions.map((position, index) => (
                    <div
                      key={`${experience.company}-${index}`}
                      className="space-y-4"
                    >
                      <h4 className="text-lg font-semibold">
                        {position.title}
                      </h4>
                      <div className="space-y-3">
                        {position.description.map((desc, i) => (
                          <p key={i} className="text-gray-600">
                            {desc}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="absolute top-0 h-full w-8 md:left-[calc(28%_-_1rem)]">
            <Timeline avatarUrl={resumeData.avatarUrl} />
          </div>
        </div>
      </div>
    </div>
  );
}
