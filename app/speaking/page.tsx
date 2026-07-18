import type { Metadata } from "next";
import { ShadowBox } from "@/app/components/ShadowBox";

export const metadata: Metadata = {
  title: "Speaking — Book Syed for AI, Auth & Full-Stack Talks",
  description:
    "Invite Syed (Abushaid Islam) to speak on AI-powered products, modern authentication & 2FA, and shipping full-stack side projects — conference talks, workshops, podcasts, panels.",
  alternates: { canonical: "/speaking" },
  openGraph: {
    title: "Speaking — Book Syed for AI, Auth & Full-Stack Talks",
    description:
      "Talks and workshops on AI products, authentication, and shipping as a solo builder.",
    url: "/speaking",
    type: "website",
  },
};
import { NewsletterSignUp } from "@/app/components/NewsletterSignUp";
import { Button } from "@/app/components/Button";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@/app/components/Tabs";
import { GridWrapper } from "@/app/components/GridWrapper";
import { PageSection } from "../components/PageSection";
import { MotionFadeIn } from "@/app/components/MotionFadeIn";
import { siteMetadata } from "@/app/data/siteMetadata";

const topics = [
  {
    title: "Building AI-powered products",
    description:
      "How I design, prototype, and ship AI features — from Claude & ChatGPT workflows to production-ready assistants that don&apos;t hallucinate on real users.",
  },
  {
    title: "Modern authentication & 2FA",
    description:
      "Lessons from building Aegis Authenticator — secure token storage, encrypted backups, TOTP done right, and the UX side of security.",
  },
  {
    title: "Shipping full-stack side projects",
    description:
      "A pragmatic look at moving from idea to launch as a solo builder — the stack, the shortcuts, and the things worth taking slow.",
  },
  {
    title: "Developer workflow with AI",
    description:
      "How I actually use Claude, ChatGPT, Cursor, and Raycast every day — not the hype reel, the real workflow that ships code faster.",
  },
];

const formats = [
  { label: "Conference talk", detail: "20–40 min keynote or session" },
  { label: "Workshop", detail: "Hands-on, 2–4 hours, small groups" },
  { label: "Meetup / college event", detail: "Short talk + Q&A, in-person or remote" },
  { label: "Podcast / interview", detail: "Remote, any timezone" },
  { label: "Panel / AMA", detail: "AI, auth, or full-stack topics" },
];

export default function SpeakingPage() {
  const mailto = `mailto:${siteMetadata.email}?subject=Speaking%20invitation`;

  return (
    <div className="relative">
      
      <div className="relative space-y-20">
        <MotionFadeIn duration={0.8} y={40}>
          <GridWrapper>
            <h1 className="max-w-3xl mx-auto mt-16 text-balance text-center text-4xl font-medium leading-tight tracking-tighter text-text-primary md:text-6xl md:leading-[64px]">
              Available for talks, workshops && podcasts.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-7 text-text-secondary">
              I love talking about the things I build — AI-powered products,
              secure authentication systems, and shipping modern web
              experiences as a solo engineer. If you&apos;re running a
              conference, meetup, podcast, or student event, let&apos;s make
              something happen.
            </p>
          </GridWrapper>
        </MotionFadeIn>

        <MotionFadeIn delay={0.15} y={20}>
          <div className="text-center">
            <GridWrapper className="py-4">
              <Button variant="primary" href={mailto}>
                Invite me to speak
              </Button>
            </GridWrapper>
          </div>
        </MotionFadeIn>

        {/* Photos — fan effect */}
        <div>
          <div className="relative mx-auto mb-8 mt-8 hidden h-[260px] max-w-3xl lg:block">
            <div
              className="absolute z-10"
              style={{
                bottom: 0,
                left: "50%",
                marginLeft: -360,
                transformOrigin: "bottom center",
                transform: "rotate(-14deg)",
              }}
            >
              <ShadowBox width={200} height={240}></ShadowBox>
              <img
                className="absolute left-1 top-1 h-[232px] w-[192px] rounded-lg object-cover"
                src="/syed_headshot_2.webp"
                alt="Syed headshot"
              />
            </div>

            <div
              className="absolute z-30"
              style={{
                bottom: 0,
                left: "50%",
                marginLeft: -160,
                transformOrigin: "bottom center",
                transform: "rotate(0deg)",
              }}
            >
              <ShadowBox width={260} height={240}></ShadowBox>
              <img
                className="absolute left-1 top-1 h-[232px] w-[252px] rounded-lg object-cover"
                src="/syed_headshot_1.webp"
                alt="Syed portrait"
              />
            </div>

            <div
              className="absolute z-20"
              style={{
                bottom: 0,
                left: "50%",
                marginLeft: 140,
                transformOrigin: "bottom center",
                transform: "rotate(14deg)",
              }}
            >
              <ShadowBox width={200} height={240}></ShadowBox>
              <img
                className="absolute left-1 top-1 h-[232px] w-[192px] rounded-lg object-cover"
                src="/syed_headshot_3.webp"
                alt="Syed headshot"
              />
            </div>
          </div>

          {/* Mobile — single centered photo */}
          <div className="flex justify-center lg:hidden">
            <div className="relative">
              <ShadowBox width={220} height={260}></ShadowBox>
              <img
                className="absolute left-1 top-1 h-[252px] w-[212px] rounded-lg object-cover"
                src="/syed_headshot_1.webp"
                alt="Syed portrait"
              />
            </div>
          </div>
        </div>

        <div className="relative space-y-32">
          <div className="space-y-16">
            <MotionFadeIn y={30}>
              <PageSection title={<h2>Topics I love talking about</h2>}>
                <p className="text-sm/8 text-text-primary">
                  Pick whichever fits your audience — or reach out with a
                  custom angle and we&apos;ll shape a talk together.
                </p>
                <div className="mt-8 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
                  {topics.map((t) => (
                    <div
                      key={t.title}
                      className="rounded-2xl border border-border-primary p-5"
                    >
                      <h3 className="text-base font-medium text-text-primary">
                        {t.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-text-secondary">
                        {t.description}
                      </p>
                    </div>
                  ))}
                </div>
              </PageSection>
            </MotionFadeIn>

            <MotionFadeIn y={30}>
              <PageSection title={<h2>Formats</h2>}>
                <p className="text-sm/8 text-text-primary">
                  I&apos;m happy in almost any format — here&apos;s what works
                  best.
                </p>
                <ul className="mt-8 max-w-2xl divide-y divide-border-primary border-y border-border-primary">
                  {formats.map((f) => (
                    <li
                      key={f.label}
                      className="flex items-center justify-between py-4"
                    >
                      <span className="text-sm font-medium text-text-primary">
                        {f.label}
                      </span>
                      <span className="text-sm text-text-secondary">
                        {f.detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </PageSection>
            </MotionFadeIn>
          </div>

          {/* Biography */}
          <MotionFadeIn y={30}>
            <GridWrapper>
              <section className="relative px-4">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                  <div className="relative col-span-7 flex flex-col space-y-8">
                    <div className="col-span-5 flex w-3/4 flex-col items-start space-y-3 text-balance">
                      <div className="text-left text-sm font-medium text-indigo-600">
                        <span>Biography</span>
                      </div>
                      <h2 className="text-3xl font-semibold text-text-primary">
                        Speaker bios — grab whichever fits
                      </h2>
                    </div>

                    <Tabs defaultTab="first-person">
                      <TabList>
                        <Tab id="first-person" label="First person" />
                        <Tab id="third-person" label="Third person" />
                      </TabList>
                      <TabPanels className="mt-8">
                        <TabPanel id="first-person">
                          <p className="text-base leading-7 text-text-secondary">
                            I&apos;m Syed (Abushaid Islam) — a software
                            engineer, AI engineer, and full-stack developer
                            based in Bangladesh. I build AI-powered products,
                            secure authentication systems, and modern web
                            experiences, and I&apos;m the founder of Aegis
                            Authenticator. I write about what I ship at
                            syed.flinkeo.online.
                          </p>
                        </TabPanel>
                        <TabPanel id="third-person">
                          <p className="text-base leading-7 text-text-secondary">
                            Syed (Abushaid Islam) is a software engineer, AI
                            engineer, and full-stack developer based in
                            Bangladesh. He builds AI-powered products, secure
                            authentication systems, and modern web
                            experiences, and is the founder of Aegis
                            Authenticator. He shares what he learns at
                            syed.flinkeo.online.
                          </p>
                        </TabPanel>
                      </TabPanels>
                    </Tabs>
                  </div>
                  <div className="col-span-5 flex flex-col items-start space-y-8">
                    <div className="flex flex-col items-start space-y-4">
                      <div className="text-left text-sm font-medium text-indigo-600">
                        <span>Headshots</span>
                      </div>
                      <h2 className="text-3xl font-semibold text-text-primary">
                        High-res photos ready for your event page
                      </h2>
                    </div>
                    <div className="mt-12 flex w-full space-x-4">
                      <div className="relative">
                        <ShadowBox width={200} height={200}></ShadowBox>
                        <img
                          className="absolute left-1 top-2 h-[186px] w-[186px] rotate-[9deg] rounded-lg object-cover shadow"
                          src="/syed_headshot_4.webp"
                          alt="Syed headshot"
                        />
                      </div>

                      <div className="relative">
                        <ShadowBox width={200} height={200}></ShadowBox>
                        <img
                          className="absolute left-1 top-2 h-[186px] w-[186px] rotate-[-8deg] rounded-lg object-cover shadow"
                          src="/syed_headshot_5.webp"
                          alt="Syed headshot"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </GridWrapper>
          </MotionFadeIn>
        </div>

        <MotionFadeIn y={30}>
          <NewsletterSignUp />
        </MotionFadeIn>
      </div>
    </div>
  );
}
