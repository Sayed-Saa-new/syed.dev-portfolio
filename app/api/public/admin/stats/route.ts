import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/app/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/public/admin/stats
 * High-level dashboard counters: posts, subscribers, emails delivered.
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

export async function GET(req: NextRequest) {
  if (!authorize(req)) return new Response("Unauthorized", { status: 401, headers: CORS });
  const supabase = await createSupabaseAdminClient();

  const [postsAll, postsPub, postsDraft, subsActive, subsUnsub, emails] = await Promise.all([
    supabase.from("blog_posts").select("slug", { count: "exact", head: true }),
    supabase.from("blog_posts").select("slug", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("blog_posts").select("slug", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("blog_subscribers").select("email", { count: "exact", head: true }).or("status.eq.active,status.is.null"),
    supabase.from("blog_subscribers").select("email", { count: "exact", head: true }).eq("status", "unsubscribed"),
    supabase.from("sent_blog_emails").select("email", { count: "exact", head: true }),
  ]);

  return Response.json(
    {
      ok: true,
      posts: {
        total: postsAll.count ?? 0,
        published: postsPub.count ?? 0,
        drafts: postsDraft.count ?? 0,
      },
      subscribers: {
        active: subsActive.count ?? 0,
        unsubscribed: subsUnsub.count ?? 0,
      },
      emails: {
        totalDelivered: emails.count ?? 0,
      },
    },
    { headers: CORS },
  );
}
