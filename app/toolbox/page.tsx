import { BorderCard } from "@/app/components/BorderCard";
import { NewsletterSignUp } from "@/app/components/NewsletterSignUp";
import { hardwareData, softwareData } from "app/data/toolbox";
import { HorizontalLine } from "@/app/components/HorizontalLine";
import { GridWrapper } from "@/app/components/GridWrapper";
import { StaggeredAppsGrid } from "@/app/components/StaggeredAppsGrid";

export default function ToolboxPage() {
  return (
    <div className="relative">
      <title>Toolbox | Syed — Abushaid Islam</title>
      <span className="absolute left-1/2 top-20 -translate-y-1/2 translate-x-1/2">
        <HorizontalLine />
      </span>
      <div className="relative space-y-10 md:space-y-16">
        <div className="mx-auto text-balance pt-14 md:pt-16">
          <GridWrapper>
            <h1 className="mx-auto max-w-2xl text-center text-4xl font-medium leading-tight tracking-tighter text-text-primary md:text-6xl md:leading-[64px]">
              The tools I use to build AI-powered products & modern web apps.
            </h1>
          </GridWrapper>
        </div>
        <span className="absolute left-1/2 top-40 -translate-y-1/2 translate-x-1/2">
          <HorizontalLine />
        </span>

        {/* Applications */}
        <div className="relative">
          <GridWrapper>
            <div className="text-center text-sm font-medium text-indigo-600">
              <span>Applications</span>
            </div>
          </GridWrapper>
        </div>
        {/* List */}
        <GridWrapper>
          <StaggeredAppsGrid items={softwareData} columns={8} />
        </GridWrapper>
        {/* Hardware */}
        <div className="relative">
          <GridWrapper>
            <div className="text-center text-sm font-medium text-indigo-600">
              <span>Hardware</span>
            </div>
          </GridWrapper>
        </div>

        <div>
          <GridWrapper>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {hardwareData.map((item) => (
                <a
                  href={item.link}
                  className="group block h-full"
                  key={item.title}
                >
                  <BorderCard>
                    <div className="flex flex-col space-y-3">
                      <p className="text-base font-semibold leading-5 text-text-primary">
                        {item.title}
                      </p>
                      <p className="leading-6 text-gray-500">
                        {item.description}
                      </p>
                    </div>
                    <span className="inline-block text-right">
                      <span className="text-sm text-purple-primary/50 group-hover:text-purple-primary">
                        Learn more
                      </span>
                    </span>
                  </BorderCard>
                </a>
              ))}
            </div>
          </GridWrapper>
        </div>

        {/* Newsletter */}
        <NewsletterSignUp />
      </div>
    </div>
  );
}
