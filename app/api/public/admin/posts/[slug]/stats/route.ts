import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/app/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/public/admin/posts/[slug]/stats
 * Returns delivery stats + optional recipient list for a post.
 *   ?includeRecipients=true  → returns array of { email, sent_at }
 * Protected by ADMIN_API_SECRET.
 */

const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!authorize(req)) return new Response("Unauthorized", { status: 401, headers: CORS });
  const { slug } = await params;
  const url = new URL(req.url);
  const includeRecipients = url.searchParams.get("includeRecipients") === "true";

  const supabase = await createSupabaseAdminClient();

  const { count: activeSubs } = await supabase
    .from("blog_subscribers")
    .select("email", { count: "exact", head: true })
    .or("status.eq.active,status.is.null");

  const sentQuery = includeRecipients
    ? supabase.from("sent_blog_emails").select("email, sent_at").eq("slug", slug).order("sent_at", { ascending: false })
    : supabase.from("sent_blog_emails").select("email", { count: "exact", head: true }).eq("slug", slug);
  const { data: sentData, count: sentCount, error } = await sentQuery;
  if (error) return Response.json({ ok: false, error: error.message }, { status: 400, headers: CORS });

  const sent = includeRecipients ? (sentData?.length ?? 0) : (sentCount ?? 0);
  const total = activeSubs ?? 0;
  return Response.json(
    {
      ok: true,
      slug,
      totalActiveSubscribers: total,
      sentCount: sent,
      pendingCount: Math.max(0, total - sent),
      recipients: includeRecipients ? sentData ?? [] : undefined,
    },
    { headers: CORS },
  );
}
