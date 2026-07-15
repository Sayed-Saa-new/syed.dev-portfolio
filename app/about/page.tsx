import { NewsletterSignUp } from "@/app/components/NewsletterSignUp";
import { HorizontalLine } from "@/app/components/HorizontalLine";
import { getTimeOfDayGreeting } from "app/lib/utils";
import React from "react";
import { CurrentlyPlayingBento } from "@/app/components/CurrentlyPlayingBento";
import { ConnectionsBento } from "@/app/components/ConnectionsBento";
import { ScrapbookBento } from "@/app/components/ScrapbookBento";
import { ShadowBox } from "@/app/components/ShadowBox";
import { Resume } from "app/components/Resume";
import { StatsBento } from "@/app/components/StatsBento";
import { CurrentlyReadingBento } from "@/app/components/CurrentlyReadingBento";
import { GridWrapper } from "@/app/components/GridWrapper";
import { AboutTrackPattern } from "@/app/components/AboutTrackPattern";
import { Photo } from "@/app/components/Photo";
import { MotionFadeIn } from "@/app/components/MotionFadeIn";

export default function AboutPage() {
  const timeOfDayGreeting = getTimeOfDayGreeting();

  return (
    <div className="relative mt-14">
      <title>About | Syed — Abushaid Islam</title>
      <div className="relative space-y-10 md:space-y-16">
        {/* Title */}
        <GridWrapper className="space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-around lg:px-24">
            <div className="order-2 mx-auto max-w-lg lg:order-1 lg:m-0 lg:max-w-3xl lg:pr-12">
              <div className="text-center text-sm font-medium text-indigo-600 lg:text-left">
                <span>{timeOfDayGreeting}</span>
              </div>
              <h1 className="mx-auto max-w-2xl text-balance text-center text-4xl font-medium leading-tight tracking-tighter text-text-primary md:text-5xl lg:text-left lg:text-6xl lg:leading-[64px]">
                I&apos;m Syed, a Software & AI Engineer.
              </h1>
            </div>
            <div className="order-1 my-12 flex-shrink-0 lg:order-2 lg:my-0">
              <div className="relative mx-auto w-full max-w-[400px]">
                <div className="relative grid grid-cols-3">
                  <div className="relative z-20 -translate-y-2">
                    <Photo
                      width={140}
                      height={140}
                      src="/syed_headshot_2.webp"
                      alt="Syed speaking at an event"
                      direction="left"
                    />
                  </div>
                  <div className="relative z-30">
                    <Photo
                      width={140}
                      height={140}
                      src="/syed_headshot_1.webp"
                      alt="Syed"
                      direction="right"
                    />
                  </div>
                  <div className="relative z-20 translate-y-4">
                    <Photo
                      width={140}
                      height={140}
                      src="/syed_headshot_3.webp"
                      alt="Syed"
                      direction="left"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GridWrapper>

        <span className="absolute left-1/2 top-40 -translate-y-1/2 translate-x-1/2">
          <HorizontalLine />
        </span>

        {/* About */}
        <div className="relative space-y-8 text-center">
          <MotionFadeIn className="space-y-4">
            <GridWrapper>
              <div className="text-center text-sm font-medium text-indigo-600">
                <span>About</span>
              </div>
            </GridWrapper>
            <GridWrapper>
              <h2 className="mx-auto max-w-xl text-balance text-3xl font-medium leading-[40px] tracking-tighter text-text-primary">
                Here&apos;s a quick intro about me and what I love to do
              </h2>
            </GridWrapper>
          </MotionFadeIn>
          <div className="relative h-fit w-full overflow-hidden">
            <div className="absolute left-0 top-0 w-full md:left-4 lg:left-[355px] xl:left-[455px]">
              <AboutTrackPattern />
            </div>

            {/* Section 1 */}
            <MotionFadeIn y={30}>
            <div className="grid grid-cols-1 gap-8 py-12 pr-12 lg:grid-cols-2 lg:items-center lg:justify-between lg:py-32 lg:pb-20 xl:py-32">
              <div className="flex flex-col items-center text-left lg:order-2 lg:items-start">
                <div className="mb-8 lg:hidden">
                  <div className="relative mx-auto w-fit">
                    <ShadowBox width={188} height={278}></ShadowBox>
                    <img
                      className="absolute left-0 top-0 h-[270px] w-[180px] rotate-[-8deg] rounded-lg object-cover shadow"
                      src="/syed_headshot_4.webp"
                      alt="Syed working"
                    />
                  </div>
                </div>
                <h2 className="mb-6 w-full text-balance text-3xl font-medium leading-[40px] tracking-tighter text-text-primary">
                  How I got into engineering
                </h2>
                <p className="mb-6 text-base leading-8 text-text-secondary">
                  I fell in love with building software early — the feeling of
                  turning an idea into something people can actually use never
                  gets old. I started with small web experiments, quickly moved
                  into full-stack development, and then dove deep into AI once
                  LLMs made it possible to build products that reason, not just
                  respond.
                </p>
              </div>
              <div className="hidden lg:order-1 lg:block">
                <div className="relative mx-auto w-fit">
                  <ShadowBox width={188} height={278}></ShadowBox>
                  <img
                    className="absolute left-0 top-0 h-[270px] w-[180px] rotate-[-8deg] rounded-lg object-cover shadow"
                    src="/syed_headshot_4.webp"
                    alt="Syed working"
                  />
                </div>
              </div>
            </div>
            </MotionFadeIn>

            {/* Section 2 */}
            <MotionFadeIn y={30}>
            <div className="grid grid-cols-1 gap-8 py-24 lg:grid-cols-2 lg:items-center lg:justify-between lg:pl-12">
              <div className="flex flex-col items-center text-left lg:items-start">
                <div className="mb-8 lg:hidden">
                  <div className="relative mx-auto w-fit">
                    <ShadowBox width={188} height={278}></ShadowBox>
                    <img
                      className="absolute left-0 top-0 h-[270px] w-[180px] rotate-[8deg] rounded-lg object-cover shadow"
                      src="/syed_headshot_3.webp"
                      alt="Syed"
                    />
                  </div>
                </div>
                <h2 className="mb-6 w-full text-balance text-3xl font-medium leading-[40px] tracking-tighter text-text-primary">
                  Full-stack, with an AI spine
                </h2>
                <p className="mb-6 text-base leading-8 text-text-secondary">
                  Today I work across the whole stack — React and TypeScript on
                  the frontend, Node and Python on the backend, Postgres and
                  vector stores on the data side. My favourite projects sit at
                  the intersection: secure auth systems, AI-powered workflows,
                  and clean interfaces that make complex tools feel simple.
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="relative mx-auto w-fit">
                  <ShadowBox width={188} height={278}></ShadowBox>
                  <img
                    className="absolute left-0 top-0 h-[270px] w-[180px] rotate-[8deg] rounded-lg object-cover shadow"
                    src="/syed_headshot_3.webp"
                    alt="Syed"
                  />
                </div>
              </div>
            </div>
            </MotionFadeIn>

            {/* Section 3 */}
            <MotionFadeIn y={30}>
            <div className="grid grid-cols-1 gap-8 pr-12 lg:grid-cols-2 lg:items-center lg:justify-between xl:py-24">
              <div className="flex flex-col items-center text-left lg:order-2 lg:items-start">
                <div className="mb-8 lg:hidden">
                  <div className="relative mx-auto w-fit">
                    <ShadowBox width={188} height={278}></ShadowBox>
                    <img
                      className="absolute left-0 top-0 h-[270px] w-[180px] rotate-[-8deg] rounded-lg object-cover shadow"
                      src="/syed_and_friend.webp"
                      alt="Syed with a friend"
                    />
                  </div>
                </div>
                <h2 className="mb-6 w-full text-balance text-3xl font-medium leading-[40px] tracking-tighter text-text-primary">
                  Life beyond the screen
                </h2>
                <p className="mb-6 text-base leading-8 text-text-secondary">
                  Outside of code, I care a lot about the people around me. My
                  closest friends keep me grounded — long walks, late-night
                  chai, and the kind of conversations that make you rethink
                  what you&apos;re building and why.
                </p>
                <p className="mb-6 text-base leading-8 text-text-secondary">
                  I try to live simply: read a lot, ship small things often,
                  and stay curious about how the world is changing around AI.
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="relative mx-auto w-fit">
                  <ShadowBox width={188} height={278}></ShadowBox>
                  <img
                    className="absolute left-0 top-0 h-[270px] w-[180px] rotate-[-8deg] rounded-lg object-cover shadow"
                    src="/syed_and_friend.webp"
                    alt="Syed with a friend"
                  />
                </div>
              </div>
            </div>
            </MotionFadeIn>

            {/* Section 4 */}
            <MotionFadeIn y={30}>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center lg:justify-between lg:py-32 lg:pl-12 xl:py-24">
              <div className="flex flex-col items-center text-left lg:items-start">
                <div className="mb-8 lg:hidden">
                  <div className="relative mx-auto w-fit">
                    <ShadowBox width={188} height={278}></ShadowBox>
                    <img
                      className="absolute left-0 top-0 h-[270px] w-[180px] rotate-[8deg] rounded-lg object-cover shadow"
                      src="/syed_headshot_2.webp"
                      alt="Syed speaking"
                    />
                  </div>
                </div>
                <h2 className="mb-6 w-full text-balance text-3xl font-medium leading-[40px] tracking-tighter text-text-primary">
                  These days
                </h2>
                <p className="mb-6 text-base leading-8 text-text-secondary">
                  I&apos;m focused on building AI-powered products end-to-end —
                  from the auth layer and API design up to the interfaces
                  people actually touch. I enjoy shipping fast, iterating in
                  public, and occasionally sharing what I learn along the way.
                </p>
                <p className="mb-6 text-base leading-8 text-text-secondary">
                  When I&apos;m not building, you&apos;ll usually find me
                  exploring new tools, sketching product ideas, or talking
                  shop with other engineers.
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="relative mx-auto w-fit">
                  <ShadowBox width={188} height={278}></ShadowBox>
                  <img
                    className="absolute left-0 top-0 h-[270px] w-[180px] rotate-[8deg] rounded-lg object-cover shadow"
                    src="/syed_headshot_2.webp"
                    alt="Syed speaking"
                  />
                </div>
              </div>
            </div>
            </MotionFadeIn>
          </div>
        </div>

        {/* About */}
        <MotionFadeIn className="relative space-y-8 text-center">
          <div className="space-y-4">
            <GridWrapper>
              <div className="text-center text-sm font-medium text-indigo-600">
                <span>Experience</span>
              </div>
            </GridWrapper>
            <GridWrapper>
              <h2 className="mx-auto max-w-lg text-balance text-3xl font-medium leading-[40px] tracking-tighter text-text-primary">
                My work history and achievements timeline.
              </h2>
            </GridWrapper>
          </div>
        </MotionFadeIn>
        <MotionFadeIn delay={0.1} y={30}>
          <div className="space-y-16">
            <GridWrapper>
              <Resume />
            </GridWrapper>
          </div>
        </MotionFadeIn>

        <section className="relative space-y-16">
          <MotionFadeIn className="space-y-4">
            <GridWrapper>
              <div className="text-center text-sm font-medium text-indigo-600">
                <span>More</span>
              </div>
            </GridWrapper>

            <GridWrapper>
              <h2 className="mx-auto max-w-lg text-balance text-center text-3xl font-medium leading-10 tracking-tight text-text-primary">
                Here&apos;s what sets me apart and makes me unique
              </h2>
            </GridWrapper>
          </MotionFadeIn>

          {/* About Grid */}
          <MotionFadeIn delay={0.1} y={30}>
            <GridWrapper>
              <div className="grid grid-cols-1 gap-2 lg:grid-cols-12">
                <div className="lg:col-span-3 lg:row-span-6">
                  <CurrentlyPlayingBento />
                </div>
                <div className="hidden lg:col-span-7 lg:row-span-5 lg:block">
                  <ScrapbookBento />
                </div>
                <div className="hidden lg:col-span-2 lg:col-start-11 lg:row-span-10 lg:block lg:min-h-[50px]">
                  <CurrentlyReadingBento />
                </div>
                <div className="lg:col-span-7 lg:row-span-8">
                  <ConnectionsBento linkTo="/connections" />
                </div>

                <div className="lg:col-span-3 lg:row-span-4">
                  <StatsBento />
                </div>
              </div>
            </GridWrapper>
          </MotionFadeIn>
        </section>

        {/* Newsletter */}
        <MotionFadeIn y={30}>
          <NewsletterSignUp />
        </MotionFadeIn>
      </div>
    </div>
  );
}
