import { GridWrapper } from "@/app/components/GridWrapper";

export const metadata = {
  title: "Projects | Syed",
  description:
    "A curated collection of AI-powered products, full-stack apps, and experiments built by Syed.",
};

export default function ProjectPage() {
  return (
    <div className="relative space-y-16">
      <title>Projects | Syed</title>
      <GridWrapper>
        <h1 className="mx-auto mt-16 max-w-2xl text-balance text-center text-4xl font-medium leading-tight tracking-tighter text-text-primary md:text-6xl md:leading-[64px]">
          A collection of my favorite works.
        </h1>
      </GridWrapper>

      <GridWrapper>
        <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-border-primary bg-surface-secondary/30 p-10 text-center">
          <p className="text-lg font-medium text-text-primary">
            Projects coming soon
          </p>
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            I&apos;m polishing a few AI-powered products and full-stack builds
            right now. They&apos;ll land here shortly — check back soon.
          </p>
        </div>
      </GridWrapper>
    </div>
  );
}
