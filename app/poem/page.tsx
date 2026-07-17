import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { showPoemFlag } from "../flags";
import { GridWrapper } from "../components/GridWrapper";
import { MotionFadeIn } from "../components/MotionFadeIn";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "A Silent Afternoon — A Poem",
  description:
    "A quiet poem from Syed — about a first love born in the hush of a primary school examination hall.",
  robots: { index: false, follow: false },
};

const POEM_TITLE = "A Silent Afternoon";
const POEM_STANZAS: string[][] = [
  [
    "Know, do you?",
    "Upon the pages of memory,",
    "that silent afternoon still blooms.",
  ],
  [
    "A primary school examination hall,",
    "hushed beneath the weight of questions —",
    "while in my eyes, there was only you.",
  ],
  [
    "Everyone wrote answers to shape their tomorrow.",
    "I wrote nothing at all —",
    "for upon the unseen pages of my heart,",
    "your name had already been written.",
  ],
  [
    "How could I have known then what love truly was?",
    "I only knew that whenever I looked at you,",
    "the whole world became strangely beautiful.",
  ],
  [
    "Perhaps it was in that quiet moment",
    "that an unnamed love was born —",
    "a love without words, without demands,",
    "only the first innocent heartbeat of a young soul.",
  ],
  [
    "Years have passed.",
    "Time has changed, and so have people;",
    "yet that single glance has never faded from my heart.",
  ],
  [
    "You may never have known,",
    "and perhaps you never will —",
    "but the story of my first love began",
    "on that silent afternoon,",
    "in a quiet examination hall.",
  ],
];

export default async function PoemPage() {
  const show = await showPoemFlag();
  if (!show) notFound();

  return (
    <section className="py-16 md:py-24">
      <GridWrapper>
        <MotionFadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-indigo-600">
              A Poem
            </p>
            <h1 className="mt-3 text-balance text-4xl font-medium leading-tight tracking-tight text-text-primary md:text-5xl">
              {POEM_TITLE}
            </h1>
            <p className="mt-4 text-sm italic text-text-secondary">
              — Syed
            </p>
          </div>
        </MotionFadeIn>
      </GridWrapper>

      <GridWrapper>
        <MotionFadeIn delay={0.15} y={20}>
          <article className="prose prose-neutral mx-auto mt-14 max-w-xl text-center">
            {POEM_STANZAS.map((stanza, i) => (
              <MotionFadeIn key={i} delay={0.2 + i * 0.08} y={16}>
                <p className="mb-8 whitespace-pre-line text-lg leading-9 text-text-primary md:text-xl md:leading-10">
                  {stanza.join("\n")}
                </p>
              </MotionFadeIn>
            ))}
          </article>
        </MotionFadeIn>
      </GridWrapper>
    </section>
  );
}
