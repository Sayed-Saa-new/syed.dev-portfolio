export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#02010a] text-white">
      {/* Starfield */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 20% 30%, #ffffff 50%, transparent 51%),
            radial-gradient(1px 1px at 70% 80%, #ffffff 50%, transparent 51%),
            radial-gradient(1.5px 1.5px at 40% 60%, #ffffff 50%, transparent 51%),
            radial-gradient(1px 1px at 85% 15%, #ffffff 50%, transparent 51%),
            radial-gradient(1px 1px at 10% 75%, #ffffff 50%, transparent 51%),
            radial-gradient(1.5px 1.5px at 55% 25%, #ffffff 50%, transparent 51%),
            radial-gradient(1px 1px at 90% 50%, #ffffff 50%, transparent 51%),
            radial-gradient(1px 1px at 30% 90%, #ffffff 50%, transparent 51%),
            radial-gradient(ellipse at 20% 20%, rgba(80,60,180,0.35), transparent 60%),
            radial-gradient(ellipse at 80% 70%, rgba(180,60,140,0.25), transparent 60%)
          `,
        }}
      />

      {/* Planet */}
      <div
        aria-hidden
        className="absolute right-10 top-20 h-40 w-40 rounded-full shadow-[0_0_60px_rgba(139,92,246,0.5)]"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, #a78bfa, #4c1d95 60%, #1e1b4b)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
          মহাকাশে স্বাগতম 🚀
        </h1>
        <p className="mt-4 max-w-xl text-lg text-white/70">
          এটি একটি ফাঁকা স্পেস থিমের পেজ — নতুন কিছু তৈরি করার জন্য প্রস্তুত।
        </p>
      </div>
    </main>
  );
}
