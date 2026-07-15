import Link from "next/link";

export const metadata = {
  title: "Offline",
  description: "You are currently offline.",
};

export default function OfflinePage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="text-5xl">📡</div>
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
        You&apos;re offline
      </h1>
      <p className="text-neutral-600 dark:text-neutral-400">
        No internet connection right now. Previously visited pages are still
        available. Reconnect to load new content.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-full bg-neutral-900 px-5 py-2 text-sm text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      >
        Try home page
      </Link>
    </div>
  );
}
