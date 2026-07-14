import { ResumeData } from "../lib/resume/types";
import { Timeline } from "./Timeline";

const resumeData: ResumeData = {
  experiences: [
    {
      company: "Personal Projects",
      period: "2024 — Present",
      positions: [
        {
          title: "Software Engineer & AI Product Builder",
          description: [
            "Building modern full-stack web applications using Next.js, TypeScript, React, Supabase, and PostgreSQL.",
            "Designing secure authentication systems with a strong focus on privacy, encryption, and user experience.",
            "Creating AI-powered products, developer tools, and scalable SaaS applications.",
            "Continuously exploring modern web technologies, UI/UX, and cloud deployment.",
          ],
        },
      ],
    },
    {
      company: "FirstOrder AI Authenticator",
      period: "2025 — Present",
      positions: [
        {
          title: "Founder & Developer",
          description: [
            "Developing an enterprise-grade 2FA authenticator with TOTP/HOTP support.",
            "Implementing AES-256 encryption, Argon2 password protection, QR scanning, encrypted backup, and modern security features.",
            "Focusing on premium UI/UX and cross-platform architecture.",
          ],
        },
      ],
    },
    {
      company: "Portfolio & Open Source",
      period: "2024 — Present",
      positions: [
        {
          title: "Independent Developer",
          description: [
            "Building a personal portfolio with Next.js, Notion CMS, and Framer Motion.",
            "Developing projects such as Readoft, DMailova, and other experimental AI/web applications.",
            "Learning and applying modern software engineering best practices through real-world projects.",
          ],
        },
      ],
    },
  ],
  education: [
    {
      school: "Dhaka Commerce College",
      period: "2024 — 2026 (Expected)",
      degree: "Higher Secondary Certificate (HSC) — Science",
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

        {resumeData.education && resumeData.education.length > 0 && (
          <div className="mt-20 border-t border-gray-100 pt-12">
            <h3 className="mb-8 text-2xl font-bold">Education</h3>
            <div className="space-y-8">
              {resumeData.education.map((edu) => (
                <div
                  key={edu.school}
                  className="grid grid-cols-1 gap-4 md:grid-cols-[2fr,4fr]"
                >
                  <div>
                    <h4 className="text-xl font-bold">{edu.school}</h4>
                    <p className="text-sm text-gray-600">{edu.period}</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{edu.degree}</p>
                    {edu.description && (
                      <p className="mt-2 text-gray-600">{edu.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
