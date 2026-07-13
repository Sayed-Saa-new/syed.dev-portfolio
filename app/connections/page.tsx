import type { Metadata } from "next";
import { GridWrapper } from "@/app/components/GridWrapper";

export const metadata: Metadata = {
  title: "Connections | Syed",
  description:
    "An evolving list of people I've met and those I wish to meet.",
};

export default function ConnectionsPage() {
  return (
    <div className="relative space-y-16">
      <GridWrapper>
        <h1 className="mx-auto mt-16 max-w-2xl text-balance text-center text-4xl font-medium leading-tight tracking-tighter text-text-primary md:text-6xl md:leading-[64px]">
          An evolving list of people I&apos;ve met and those I wish to meet.
        </h1>
      </GridWrapper>

      <GridWrapper>
        <div className="mx-auto max-w-xl rounded-2xl border border-border-primary bg-bg-secondary/40 p-10 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-border-primary bg-bg-primary">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-text-secondary"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-text-primary">
            Building this list soon
          </h2>
          <p className="mt-2 text-balance text-text-secondary">
            I&apos;m just getting started documenting the engineers, founders,
            and creators I&apos;ve met along the way. Check back soon — this
            wall will fill up.
          </p>
        </div>
      </GridWrapper>
    </div>
  );
}
