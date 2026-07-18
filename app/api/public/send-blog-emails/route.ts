import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/app/lib/supabase/server";
import { posts } from "#site/content";
import { siteMetadata } from "@/app/data/siteMetadata";
import { sendMail } from "@/app/lib/email/smtp";
import { newPostEmail } from "@/emails/new-post";
import { unsubscribeUrl } from "@/emails/base";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * GET  = cron. Iterates recent posts and sends to any subscriber who has not
 *        received that post yet. Safe to run daily.
 * POST = manual send from the admin dashboard. Body: { slug: string }.
 *        Only sends to subscribers who have NOT received it (dedup preserved).
 *
 * Both are protected by ADMIN_API_SECRET (also used as CRON_SECRET for Vercel cron).
 * Provide via `Authorization: Bearer <secret>` OR `?secret=<secret>`.
 */

function authorize(req: NextRequest): boolean {
  const secret = process.env.ADMIN_API_SECRET || process.env.CRON_SECRET;
  if (!secret) return false;
  const header = req.headers.get("authorization");
  if (header === `Bearer ${secret}`) return true;
  const url = new URL(req.url);
  if (url.searchParams.get("secret") === secret) return true;
  return false;
}

type Sub = { email: string; unsubscribe_token: string };

async function sendPostToSubscribers(slug: string) {
  const supabase = await createSupabaseAdminClient();

  const post = posts.find((p) => p.slug === slug && !p.draft);
  if (!post) return { slug, error: "post_not_found", sent: 0, skipped: 0, failed: 0 };

  const { data: subs, error: subsErr } = await supabase
    .from("blog_subscribers")
    .select("email, unsubscribe_token, status")
    .or("status.eq.active,status.is.null");
  if (subsErr) return { slug, error: subsErr.message, sent: 0, skipped: 0, failed: 0 };

  const subscribers = (subs ?? []).filter(
    (s) => (s.status ?? "active") === "active",
  ) as (Sub & { status?: string })[];

  const { data: alreadySent } = await supabase
    .from("sent_blog_emails")
    .select("email")
    .eq("slug", slug);
  const sentSet = new Set((alreadySent ?? []).map((r) => r.email as string));

  const targets = subscribers.filter((s) => !sentSet.has(s.email));

  const site = siteMetadata.siteUrl;
  const url = `${site}/blog/${post.slug}`;
  const coverImage = post.imageName ? `${site}/blog/${post.imageName}` : undefined;
  const publishedAt = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let sent = 0;
  let failed = 0;

  for (const sub of targets) {
    const { subject, html } = newPostEmail({
      token: sub.unsubscribe_token,
      title: post.title,
      summary: post.summary || "",
      url,
      coverImage,
      publishedAt,
    });
    const res = await sendMail({
      to: sub.email,
      subject,
      html,
      unsubscribeUrl: unsubscribeUrl(sub.unsubscribe_token),
    });
    if (res.ok) {
      await supabase.from("sent_blog_emails").insert({ slug, email: sub.email });
      sent++;
    } else {
      failed++;
    }
    await new Promise((r) => setTimeout(r, 200));
  }

  return {
    slug,
    title: post.title,
    sent,
    skipped: subscribers.length - targets.length,
    failed,
  };
}

export async function GET(req: NextRequest) {
  if (!authorize(req)) return new Response("Unauthorized", { status: 401 });

  // Only the newest published post — daily cron only sends the freshest post.
  const recent = [...posts]
    .filter((p) => !p.draft)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, 3);

  const results: Awaited<ReturnType<typeof sendPostToSubscribers>>[] = [];
  for (const post of recent) {
    results.push(await sendPostToSubscribers(post.slug));
  }
  return Response.json({ ok: true, results });
}

export async function POST(req: NextRequest) {
  if (!authorize(req)) return new Response("Unauthorized", { status: 401 });
  let body: { slug?: string } = {};
  try {
    body = await req.json();
  } catch {}
  if (!body.slug) return Response.json({ ok: false, error: "slug required" }, { status: 400 });
  const result = await sendPostToSubscribers(body.slug);
  return Response.json({ ok: true, result });
}
