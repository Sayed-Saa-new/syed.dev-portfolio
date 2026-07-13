import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Space — মহাকাশের বিস্ময়" },
      { name: "description", content: "মহাকাশ, নক্ষত্র ও গ্রহের এক শান্ত ভ্রমণ।" },
    ],
  }),
});

function Index() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05060f] text-white">
      {/* Starfield */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(1px 1px at 20% 30%, #fff, transparent), radial-gradient(1px 1px at 70% 20%, #fff, transparent), radial-gradient(1.5px 1.5px at 40% 70%, #fff, transparent), radial-gradient(1px 1px at 85% 60%, #fff, transparent), radial-gradient(1px 1px at 10% 80%, #fff, transparent), radial-gradient(2px 2px at 55% 45%, #fff, transparent), radial-gradient(1px 1px at 90% 90%, #fff, transparent), radial-gradient(1px 1px at 30% 15%, #fff, transparent)",
            backgroundSize: "600px 600px",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(88,80,236,0.25),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.15),transparent_60%)]" />
      </div>

      {/* Planet */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-500 via-purple-600 to-fuchsia-700 opacity-80 blur-sm shadow-[0_0_120px_rgba(139,92,246,0.5)]" />

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.4em] text-indigo-300/80">
          Cosmos · মহাকাশ
        </p>
        <h1 className="max-w-3xl text-5xl font-semibold leading-tight md:text-7xl">
          নক্ষত্রের নিচে <span className="bg-gradient-to-r from-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">নিঃশব্দ ভ্রমণ</span>
        </h1>
        <p className="mt-6 max-w-xl text-base text-white/70 md:text-lg">
          অসীম মহাকাশের বিস্ময়কে অনুভব করুন — গ্রহ, নীহারিকা আর দূরের গ্যালাক্সির মাঝে এক শান্ত মুহূর্ত।
        </p>
      </main>
    </div>
  );
}
