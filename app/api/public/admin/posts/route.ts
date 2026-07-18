import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/app/lib/supabase/server";
import { getAllPostsIncludingDrafts } from "@/app/lib/blog/posts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/public/admin/posts
 * Lists all published posts with subscriber counts + how many have received the email.
 * Used by the external Admin-dashboard project.
 * Protected by ADMIN_API_SECRET.
 * CORS: allowed for any origin (admin dashboard lives on a different domain).
 */

function authorize(req: NextRequest): boolean {
  const secret = process.env.ADMIN_API_SECRET;
  if (!secret) return false;
  const header = req.headers.get("authorization");
  if (header === `Bearer ${secret}`) return true;
  const url = new URL(req.url);
  if (url.searchParams.get("secret") === secret) return true;
  return false;
}

const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET(req: NextRequest) {
  if (!authorize(req)) return new Response("Unauthorized", { status: 401, headers: CORS });

  const supabase = await createSupabaseAdminClient();

  const { count: totalSubs } = await supabase
    .from("blog_subscribers")
    .select("email", { count: "exact", head: true })
    .or("status.eq.active,status.is.null");

  const { data: sentRows } = await supabase
    .from("sent_blog_emails")
    .select("slug, email");

  const sentBySlug = new Map<string, number>();
  for (const r of sentRows ?? []) {
    sentBySlug.set(r.slug as string, (sentBySlug.get(r.slug as string) ?? 0) + 1);
  }

  const allPosts = await getAllPostsIncludingDrafts();
  const list = allPosts
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      publishedAt: p.publishedAt,
      draft: p.draft ?? false,
      sentCount: sentBySlug.get(p.slug) ?? 0,
    }));

  return Response.json(
    { ok: true, totalSubscribers: totalSubs ?? 0, posts: list },
    { headers: CORS },
  );
}
