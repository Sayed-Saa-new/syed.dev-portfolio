import { BentoCard } from "./BentoCard";

export function CurrentlyReadingBento() {
  return (
    <BentoCard height="h-full" className="group !p-0">
      <div className="p-6 pb-2">
        <h2 className="font-medium">Currently Reading</h2>
      </div>
      <div className="relative h-full w-full flex-1 overflow-hidden">
        <img
          src="/surrounded_by_idiots_cover.png"
          alt="Surrounded by Idiots book cover"
          className="absolute -right-8 -bottom-10 h-[380px] w-auto max-w-none rotate-[12deg] drop-shadow-2xl transition-transform duration-500 ease-out group-hover:rotate-[8deg] group-hover:scale-[1.03]"
        />
      </div>
    </BentoCard>
  );
}
