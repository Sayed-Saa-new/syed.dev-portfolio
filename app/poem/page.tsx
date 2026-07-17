import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { showPoemFlag } from "../flags";
import { PoemStanza } from "./PoemStanza";
import { AsciiPortraitCard } from "./AsciiPortraitCard";
import { poemSerif } from "./fonts";

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
    <main className={`relative ${poemSerif.variable}`}>
      {/* Warm paper-toned ambient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1200px 600px at 20% 10%, rgba(255, 226, 199, 0.35), transparent 60%), radial-gradient(900px 500px at 85% 40%, rgba(220, 210, 255, 0.28), transparent 60%), radial-gradient(1000px 700px at 50% 100%, rgba(255, 210, 220, 0.25), transparent 60%), linear-gradient(180deg, #fdfaf5 0%, #faf6ef 100%)",
        }}
      />
      {/* Subtle grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-neutral-500">
            A Poem · By Syed
          </p>
          <h1
            className="mt-8 font-poem text-6xl font-light italic leading-[0.98] tracking-[-0.03em] text-neutral-900 md:text-8xl"
            style={{
              fontVariationSettings: '"SOFT" 100, "opsz" 144',
              fontFeatureSettings: '"liga", "dlig", "swsh", "salt"',
            }}
          >
            {POEM_TITLE}
          </h1>
          <div className="mx-auto mt-10 h-px w-20 bg-gradient-to-r from-transparent via-neutral-400 to-transparent" />
          <p
            className="mt-8 font-poem text-base italic leading-relaxed text-neutral-600 md:text-lg"
            style={{ fontVariationSettings: '"SOFT" 100, "opsz" 24' }}
          >
            A quiet remembrance of a first love —<br />
            born in the hush of an examination hall.
          </p>
        </div>
      </section>

      {/* Body: two columns — sticky ASCII portrait card + scrolling stanzas */}
      <section className="mx-auto max-w-6xl px-6 pb-40">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-16">
          {/* Sticky ASCII art card */}
          <aside className="lg:self-stretch">
            <AsciiPortraitCard />
          </aside>


          {/* Stanzas */}
          <article className="relative pt-4">
            {POEM_STANZAS.map((lines, i) => (
              <PoemStanza key={i} lines={lines} index={i} />
            ))}

            {/* closing signature */}
            <div className="mt-8 flex items-center gap-4 opacity-70">
              <div className="h-px flex-1 bg-neutral-300" />
              <span className="font-poem text-lg italic text-neutral-600">
                — Syed
              </span>
              <div className="h-px flex-1 bg-neutral-300" />
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
