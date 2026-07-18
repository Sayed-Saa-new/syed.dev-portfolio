import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/app/lib/supabase/server";
import { revalidatePath, revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/public/admin/posts/bulk
 * Body: { action: "delete"|"publish"|"unpublish", slugs: string[] }
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

function bustCaches(slugs: string[]) {
  try { (revalidateTag as unknown as (t: string) => void)("blog_posts"); } catch {}
  revalidatePath("/blog", "page");
  for (const s of slugs) revalidatePath(`/blog/${s}`, "page");
  revalidatePath("/rss.xml", "page");
  revalidatePath("/sitemap.xml", "page");
}

export async function POST(req: NextRequest) {
  if (!authorize(req)) return new Response("Unauthorized", { status: 401, headers: CORS });
  const body = (await req.json().catch(() => ({}))) as {
    action?: "delete" | "publish" | "unpublish";
    slugs?: string[];
  };
  if (!body.action || !Array.isArray(body.slugs) || body.slugs.length === 0)
    return Response.json({ ok: false, error: "action and slugs[] required" }, { status: 400, headers: CORS });

  const supabase = await createSupabaseAdminClient();
  let error: string | null = null;
  let affected = 0;

  if (body.action === "delete") {
    const { error: e, count } = await supabase
      .from("blog_posts").delete({ count: "exact" }).in("slug", body.slugs);
    if (e) error = e.message; else affected = count ?? 0;
  } else {
    const patch = body.action === "publish"
      ? { status: "published", published_at: new Date().toISOString() }
      : { status: "draft" };
    const { error: e, count } = await supabase
      .from("blog_posts").update(patch, { count: "exact" }).in("slug", body.slugs);
    if (e) error = e.message; else affected = count ?? 0;
  }

  if (error) return Response.json({ ok: false, error }, { status: 400, headers: CORS });
  bustCaches(body.slugs);
  return Response.json({ ok: true, action: body.action, affected }, { headers: CORS });
}
