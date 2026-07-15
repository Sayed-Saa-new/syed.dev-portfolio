import { GridWrapper } from "@/app/components/GridWrapper";

export default function Loading() {
  return (
    <div className="relative space-y-16 pb-24">
      <GridWrapper>
        <div className="mx-auto mt-16 max-w-2xl px-4">
          <div className="mx-auto h-10 w-3/4 animate-pulse rounded-lg bg-border-primary/60 md:h-14" />
          <div className="mx-auto mt-3 h-10 w-1/2 animate-pulse rounded-lg bg-border-primary/40 md:h-14" />
        </div>
      </GridWrapper>

      <GridWrapper>
        <div className="mx-auto max-w-6xl space-y-8 px-4">
          {[0, 1].map((i) => (
            <ProjectCardSkeleton key={i} delay={i * 120} />
          ))}
        </div>
      </GridWrapper>
    </div>
  );
}

function ProjectCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="animate-fade-in overflow-hidden rounded-2xl border border-border-primary bg-bg-primary md:min-h-[440px]"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-[1.05fr_1fr]">
        {/* Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-neutral-200 to-neutral-100 md:aspect-auto md:min-h-[440px]">
          <div className="shimmer absolute inset-0" />
          <div className="absolute left-4 top-4 h-5 w-16 rounded-full bg-white/70" />
        </div>

        {/* Details */}
        <div className="flex flex-col justify-between gap-8 p-7 md:p-10">
          <div className="space-y-4">
            <div className="h-3 w-24 animate-pulse rounded bg-border-primary/60" />
            <div className="space-y-2">
              <div className="h-7 w-3/4 animate-pulse rounded-md bg-border-primary/70 md:h-8" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-border-primary/50" />
            </div>
            <div className="h-px w-10 bg-border-primary" />
            <div className="space-y-2 pt-1">
              <div className="h-3 w-full animate-pulse rounded bg-border-primary/50" />
              <div className="h-3 w-[92%] animate-pulse rounded bg-border-primary/50" />
              <div className="h-3 w-[80%] animate-pulse rounded bg-border-primary/50" />
              <div className="h-3 w-[60%] animate-pulse rounded bg-border-primary/40" />
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <div className="mb-2 h-3 w-10 animate-pulse rounded bg-border-primary/60" />
              <div className="flex flex-wrap gap-1.5">
                {[56, 72, 64, 80, 60].map((w, i) => (
                  <div
                    key={i}
                    className="h-5 animate-pulse rounded-md bg-border-primary/50"
                    style={{ width: `${w}px` }}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {[70, 90, 100].map((w, i) => (
                <div
                  key={i}
                  className="h-3 animate-pulse rounded bg-border-primary/40"
                  style={{ width: `${w}px` }}
                />
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-border-primary pt-4">
              <div className="h-4 w-32 animate-pulse rounded bg-border-primary/60" />
              <div className="h-3 w-20 animate-pulse rounded bg-border-primary/40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
