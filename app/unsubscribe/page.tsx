import Link from "next/link";
import { createSupabaseAdminClient } from "@/app/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata = {
  title: "Unsubscribe · Syed",
  description: "Manage your newsletter subscription.",
  robots: { index: false, follow: false },
};

async function processUnsubscribe(token: string) {
  const supabase = await createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("blog_subscribers")
    .update({ status: "unsubscribed", unsubscribed_at: new Date().toISOString() })
    .eq("unsubscribe_token", token)
    .select("email")
    .maybeSingle();
  if (error || !data) return { ok: false as const, email: null };
  return { ok: true as const, email: data.email as string };
}

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const result = token ? await processUnsubscribe(token) : { ok: false as const, email: null };

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-border-primary bg-bg-secondary">
        <svg
          className="h-7 w-7 text-text-primary"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          aria-hidden
        >
          {result.ok ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75 10.5 18.75 19.5 5.25" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          )}
        </svg>
      </div>

      {result.ok ? (
        <>
          <h1 className="mb-3 text-3xl font-semibold text-text-primary">You&apos;re unsubscribed</h1>
          <p className="mb-2 text-text-secondary">
            <span className="font-medium text-text-primary">{result.email}</span> will no longer receive
            newsletter emails from me.
          </p>
          <p className="mb-8 text-sm text-text-tertiary">
            Sorry to see you go. If this was a mistake, you can subscribe again anytime from the homepage.
          </p>
        </>
      ) : (
        <>
          <h1 className="mb-3 text-3xl font-semibold text-text-primary">Invalid link</h1>
          <p className="mb-8 text-text-secondary">
            This unsubscribe link is missing or no longer valid. If you keep receiving emails you didn&apos;t
            sign up for, just reply and I&apos;ll remove you manually.
          </p>
        </>
      )}

      <div className="flex gap-3">
        <Link
          href="/"
          className="rounded-lg border border-border-primary bg-bg-secondary px-4 py-2 text-sm text-text-primary transition hover:bg-bg-tertiary"
        >
          Back to site
        </Link>
        <Link
          href="/blog"
          className="rounded-lg bg-text-primary px-4 py-2 text-sm text-bg-primary transition hover:opacity-90"
        >
          Read the blog
        </Link>
      </div>
    </main>
  );
}
