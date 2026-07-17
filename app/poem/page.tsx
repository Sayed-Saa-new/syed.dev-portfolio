import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { showPoemFlag } from "../flags";
import { PoemStanza } from "./PoemStanza";
import { POEM_ASCII_ART } from "./ascii-art";

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
    <main className="relative overflow-hidden">
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
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-neutral-500">
            A Poem · By Syed
          </p>
          <h1 className="mt-6 font-serif text-5xl italic leading-[1.05] tracking-tight text-neutral-900 md:text-7xl">
            {POEM_TITLE}
          </h1>
          <div className="mx-auto mt-8 h-px w-16 bg-neutral-400/60" />
          <p className="mt-8 font-serif text-base italic leading-relaxed text-neutral-600 md:text-lg">
            A quiet remembrance of a first love —<br />
            born in the hush of an examination hall.
          </p>
        </div>
      </section>

      {/* Body: two columns — sticky ASCII portrait card + scrolling stanzas */}
      <section className="mx-auto max-w-6xl px-6 pb-40">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-16">
          {/* Sticky ASCII art card */}
          <aside className="lg:sticky lg:top-1/2 lg:h-fit lg:-translate-y-1/2 lg:self-start">
            <div className="group relative overflow-hidden rounded-3xl border border-neutral-200/70 bg-white/60 p-4 shadow-[0_20px_60px_-30px_rgba(80,50,20,0.25)] backdrop-blur-md">
              {/* soft inner glow */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-3xl"
                style={{
                  background:
                    "radial-gradient(400px 200px at 50% 0%, rgba(255,220,180,0.25), transparent 60%)",
                }}
              />
              <div className="relative overflow-hidden rounded-2xl bg-[#fdfaf5]">
                <pre
                  aria-hidden
                  className="m-0 overflow-hidden whitespace-pre p-3 font-mono text-[3.2px] leading-[3.4px] text-neutral-800 md:text-[3.6px] md:leading-[3.8px]"
                  style={{ letterSpacing: 0 }}
                >
                  {POEM_ASCII_ART}
                </pre>
                {/* vignette overlay for mood */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 50%, transparent 50%, rgba(60, 40, 20, 0.15) 100%)",
                  }}
                />
              </div>
              <figcaption className="mt-4 flex items-center justify-between px-2 pb-1 font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                <span>Portrait · ASCII</span>
                <span>— of a memory</span>
              </figcaption>
            </div>
          </aside>

          {/* Stanzas */}
          <article className="relative pt-4">
            {POEM_STANZAS.map((lines, i) => (
              <PoemStanza key={i} lines={lines} index={i} />
            ))}

            {/* closing signature */}
            <div className="mt-8 flex items-center gap-4 opacity-70">
              <div className="h-px flex-1 bg-neutral-300" />
              <span className="font-serif text-lg italic text-neutral-600">
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
