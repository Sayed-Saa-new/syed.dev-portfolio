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
      <div className="relative h-full">
        <div className="absolute left-1/2 top-2 -translate-x-1/2 origin-bottom transition-transform duration-300 ease-in-out group-hover:-rotate-3 group-hover:scale-105">
          <img
            src="/surrounded_by_idiots_cover.png"
            alt="Surrounded by Idiots book cover"
            className="h-[220px] w-auto drop-shadow-xl"
          />
        </div>
      </div>
      <div className="absolute inset-0 h-full w-full bg-gradient-to-t from-white/40 via-transparent to-transparent"></div>
    </BentoCard>
  );
}
