import { BentoCard } from "./BentoCard";

export function CurrentlyReadingBento() {
  return (
    <BentoCard height="h-full" className="group">
      <h2 className="mb-2 font-medium">Currently Reading</h2>
      <p className="mb-4 text-sm text-text-secondary">
        <span className="font-semibold">Surrounded by Idiots</span>
        <br />
        <span className="text-xs">by Thomas Erikson</span>
      </p>
      <div className="relative h-full min-h-[360px] w-full overflow-hidden">
        <div className="absolute -right-8 top-4 origin-center rotate-[8deg] transition-transform duration-500 ease-in-out group-hover:rotate-[2deg] group-hover:scale-110">
          <img
            src="/surrounded_by_idiots_cover.png"
            alt="Surrounded by Idiots book cover"
            className="h-[340px] w-auto drop-shadow-2xl"
          />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-t from-white/40 via-transparent to-transparent"></div>
    </BentoCard>
  );
}
