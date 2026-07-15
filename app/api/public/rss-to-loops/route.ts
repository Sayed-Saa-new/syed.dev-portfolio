import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/app/lib/supabase/server";
import { posts } from "#site/content";
import { siteMetadata } from "@/app/data/siteMetadata";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

const LOOPS_ENDPOINT = "https://app.loops.so/api/v1/transactional";

function authorize(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = req.headers.get("authorization");
  if (header === `Bearer ${secret}`) return true;
  // Vercel Cron sends x-vercel-cron: 1 with no auth header on some plans.
  // We still require the secret via query param fallback for manual runs.
  const url = new URL(req.url);
  if (url.searchParams.get("secret") === secret) return true;
  return false;
}

export async function GET(req: NextRequest) {
  if (!authorize(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const templateId = process.env.LOOPS_BLOG_TEMPLATE_ID;
  const loopsKey = process.env.LOOPS_API_KEY;
  if (!templateId || !loopsKey) {
    return Response.json(
      { ok: false, error: "Missing LOOPS_BLOG_TEMPLATE_ID or LOOPS_API_KEY" },
      { status: 500 },
    );
  }

  const supabase = await createSupabaseAdminClient();

  // 1. Sort posts newest → oldest, take the 5 most recent to keep the run bounded.
  const recent = [...posts]
    .filter((p) => !p.draft)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, 5);

  // 2. Load all subscribers.
  const { data: subs, error: subsErr } = await supabase
    .from("blog_subscribers")
    .select("email");
  if (subsErr) {
    return Response.json({ ok: false, error: subsErr.message }, { status: 500 });
  }
  const subscribers = (subs ?? []).map((s) => s.email as string);

  const results: {
    slug: string;
    title: string;
    sent: number;
    skipped: number;
    failed: number;
  }[] = [];

  for (const post of recent) {
    // 3. Which subscribers already got this post?
    const { data: alreadySent } = await supabase
      .from("sent_blog_emails")
      .select("email")
      .eq("slug", post.slug);
    const alreadySentSet = new Set((alreadySent ?? []).map((r) => r.email as string));

    const targets = subscribers.filter((email) => !alreadySentSet.has(email));

    if (targets.length === 0) {
      results.push({ slug: post.slug, title: post.title, sent: 0, skipped: subscribers.length, failed: 0 });
      continue;
    }

    const site = siteMetadata.siteUrl;
    const url = `${site}/blog/${post.slug}`;
    const coverImage = post.imageName ? `${site}/blog/${post.imageName}` : "";
    const dataVariables = {
      title: post.title,
      summary: post.summary || "",
      url,
      coverImage,
      publishedAt: new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    let sent = 0;
    let failed = 0;

    for (const email of targets) {
      try {
        const res = await fetch(LOOPS_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loopsKey}`,
          },
          body: JSON.stringify({
            transactionalId: templateId,
            email,
            dataVariables,
          }),
        });

        if (res.ok) {
          await supabase.from("sent_blog_emails").insert({ slug: post.slug, email });
          sent++;
        } else {
          failed++;
        }
      } catch {
        failed++;
      }

      // Small delay to stay under Loops' rate limits (10 req/sec on free plan).
      await new Promise((r) => setTimeout(r, 120));
    }

    results.push({
      slug: post.slug,
      title: post.title,
      sent,
      skipped: subscribers.length - targets.length,
      failed,
    });
  }

  return Response.json({ ok: true, subscribers: subscribers.length, results });
}
