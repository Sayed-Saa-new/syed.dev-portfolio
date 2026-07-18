import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/app/lib/supabase/server";
import { getPostBySlug } from "@/app/lib/blog/posts";
import { siteMetadata } from "@/app/data/siteMetadata";
import { sendMail } from "@/app/lib/email/smtp";
import { newPostEmail } from "@/emails/new-post";
import { unsubscribeUrl } from "@/emails/base";
import { resolveCoverUrl } from "@/app/lib/utils";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * POST /api/public/admin/posts/resend-email
 * Body: { slug: string, mode?: "pending"|"all"|"one", email?: string }
 *  - "pending" (default): send to active subscribers who have NOT received it yet
 *  - "all": force-resend to every active subscriber, even if already sent
 *  - "one": send only to the given `email` (must be an active subscriber)
 *
 * Protected by ADMIN_API_SECRET.
 */

const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function authorize(req: NextRequest): boolean {
  const secret = process.env.ADMIN_API_SECRET;
  if (!secret) return false;
  const h = req.headers.get("authorization");
  if (h === `Bearer ${secret}`) return true;
  const url = new URL(req.url);
  return url.searchParams.get("secret") === secret;
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function POST(req: NextRequest) {
  if (!authorize(req)) return new Response("Unauthorized", { status: 401, headers: CORS });
  const body = (await req.json().catch(() => ({}))) as {
    slug?: string;
    mode?: "pending" | "all" | "one";
    email?: string;
  };
  if (!body.slug)
    return Response.json({ ok: false, error: "slug required" }, { status: 400, headers: CORS });
  const mode = body.mode ?? "pending";
  if (mode === "one" && !body.email)
    return Response.json({ ok: false, error: "email required when mode=one" }, { status: 400, headers: CORS });

  const supabase = await createSupabaseAdminClient();
  const post = await getPostBySlug(body.slug);
  if (!post) return Response.json({ ok: false, error: "post not found or draft" }, { status: 404, headers: CORS });

  let subsQuery = supabase
    .from("blog_subscribers")
    .select("email, unsubscribe_token, status")
    .or("status.eq.active,status.is.null");
  if (mode === "one") subsQuery = subsQuery.eq("email", body.email!.toLowerCase());
  const { data: subs, error: subsErr } = await subsQuery;
  if (subsErr) return Response.json({ ok: false, error: subsErr.message }, { status: 400, headers: CORS });
  let targets = (subs ?? []).filter((s) => (s.status ?? "active") === "active");

  if (mode === "pending") {
    const { data: sent } = await supabase.from("sent_blog_emails").select("email").eq("slug", body.slug);
    const sentSet = new Set((sent ?? []).map((r) => r.email as string));
    targets = targets.filter((s) => !sentSet.has(s.email));
  }

  const site = siteMetadata.siteUrl;
  const url = `${site}/blog/${post.slug}`;
  const resolvedCover = resolveCoverUrl(post.imageName);
  const coverImage = resolvedCover
    ? resolvedCover.startsWith("http") ? resolvedCover : `${site}${resolvedCover}`
    : undefined;
  const publishedAt = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
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
      // upsert so "all"/"one" mode also records the delivery
      await supabase
        .from("sent_blog_emails")
        .upsert({ slug: body.slug, email: sub.email }, { onConflict: "slug,email", ignoreDuplicates: true });
      sent++;
    } else {
      failed++;
    }
    await new Promise((r) => setTimeout(r, 150));
  }

  return Response.json(
    { ok: true, slug: body.slug, mode, targeted: targets.length, sent, failed },
    { headers: CORS },
  );
}
