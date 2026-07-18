import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/app/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/public/admin/posts/[slug]
 * Returns the FULL blog_posts row for the given slug (including content_mdx,
 * cover_image_url, categories, etc.) so the external Admin dashboard can
 * populate its edit form. Protected by ADMIN_API_SECRET.
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
  if (!authorize(req))
    return new Response("Unauthorized", { status: 401, headers: CORS });

  const { slug } = await params;
  if (!slug)
    return Response.json(
      { ok: false, error: "slug required" },
      { status: 400, headers: CORS },
    );

  const supabase = await createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "id, slug, title, summary, content_mdx, cover_image_url, categories, audio_file_url, canonical_url, status, published_at, created_at, updated_at",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error)
    return Response.json(
      { ok: false, error: error.message },
      { status: 400, headers: CORS },
    );
  if (!data)
    return Response.json(
      { ok: false, error: "not found" },
      { status: 404, headers: CORS },
    );

  return Response.json({ ok: true, post: data }, { headers: CORS });
}
