import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/app/lib/supabase/server";
import { revalidatePath, revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Admin CRUD for blog_posts. Protected by ADMIN_API_SECRET.
 * Called by the external Admin-dashboard project.
 *
 * POST   { slug, title, summary, content_mdx, cover_image_url?, categories?,
 *          audio_file_url?, canonical_url?, status?, published_at?,
 *          autoSendEmail? }  — create new post
 * PATCH  { slug, ...same fields, autoSendEmail? }                   — update
 * DELETE { slug }                                                    — remove
 *
 * When `autoSendEmail: true` AND the post transitions to `published`
 * (either created as published or updated from draft → published),
 * the send-blog-emails endpoint is invoked in the background.
 */

const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, PATCH, DELETE, OPTIONS",
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

type PostInput = {
  slug: string;
  title?: string;
  summary?: string;
  content_mdx?: string;
  cover_image_url?: string | null;
  categories?: string[];
  audio_file_url?: string | null;
  canonical_url?: string | null;
  status?: "draft" | "published";
  published_at?: string | null;
  autoSendEmail?: boolean;
};

function bustCaches(slug: string) {
  revalidateTag("blog_posts");
  revalidatePath("/blog", "page");
  revalidatePath(`/blog/${slug}`, "page");
  revalidatePath("/rss.xml", "page");
  revalidatePath("/sitemap.xml", "page");
}

async function triggerEmail(req: NextRequest, slug: string) {
  const secret = process.env.ADMIN_API_SECRET!;
  const origin = new URL(req.url).origin;
  // fire-and-forget
  fetch(`${origin}/api/public/send-blog-emails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify({ slug }),
  }).catch(() => {});
}

export async function POST(req: NextRequest) {
  if (!authorize(req)) return new Response("Unauthorized", { status: 401, headers: CORS });
  const body = (await req.json().catch(() => ({}))) as PostInput;
  if (!body.slug || !body.title) {
    return Response.json({ ok: false, error: "slug and title required" }, { status: 400, headers: CORS });
  }
  const supabase = await createSupabaseAdminClient();
  const isPublished = body.status === "published";
  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      slug: body.slug,
      title: body.title,
      summary: body.summary ?? "",
      content_mdx: body.content_mdx ?? "",
      cover_image_url: body.cover_image_url ?? null,
      categories: body.categories ?? [],
      audio_file_url: body.audio_file_url ?? null,
      canonical_url: body.canonical_url ?? null,
      status: body.status ?? "draft",
      published_at: isPublished
        ? body.published_at ?? new Date().toISOString()
        : body.published_at ?? null,
    })
    .select()
    .single();
  if (error) return Response.json({ ok: false, error: error.message }, { status: 400, headers: CORS });

  bustCaches(body.slug);
  if (isPublished && body.autoSendEmail) await triggerEmail(req, body.slug);

  return Response.json({ ok: true, post: data, emailQueued: isPublished && !!body.autoSendEmail }, { headers: CORS });
}

export async function PATCH(req: NextRequest) {
  if (!authorize(req)) return new Response("Unauthorized", { status: 401, headers: CORS });
  const body = (await req.json().catch(() => ({}))) as PostInput;
  if (!body.slug) return Response.json({ ok: false, error: "slug required" }, { status: 400, headers: CORS });

  const supabase = await createSupabaseAdminClient();
  const { data: existing } = await supabase
    .from("blog_posts")
    .select("status")
    .eq("slug", body.slug)
    .maybeSingle();

  const patch: Record<string, unknown> = {};
  for (const k of [
    "title", "summary", "content_mdx", "cover_image_url", "categories",
    "audio_file_url", "canonical_url", "status", "published_at",
  ] as const) {
    if (body[k] !== undefined) patch[k] = body[k];
  }
  if (body.status === "published" && !patch.published_at && !existing?.status) {
    patch.published_at = new Date().toISOString();
  }
  if (body.status === "published" && existing?.status !== "published" && !patch.published_at) {
    patch.published_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .update(patch)
    .eq("slug", body.slug)
    .select()
    .single();
  if (error) return Response.json({ ok: false, error: error.message }, { status: 400, headers: CORS });

  bustCaches(body.slug);
  const transitionedToPublished =
    body.status === "published" && existing?.status !== "published";
  if (transitionedToPublished && body.autoSendEmail) await triggerEmail(req, body.slug);

  return Response.json(
    { ok: true, post: data, emailQueued: transitionedToPublished && !!body.autoSendEmail },
    { headers: CORS },
  );
}

export async function DELETE(req: NextRequest) {
  if (!authorize(req)) return new Response("Unauthorized", { status: 401, headers: CORS });
  const body = (await req.json().catch(() => ({}))) as { slug?: string };
  if (!body.slug) return Response.json({ ok: false, error: "slug required" }, { status: 400, headers: CORS });
  const supabase = await createSupabaseAdminClient();
  const { error } = await supabase.from("blog_posts").delete().eq("slug", body.slug);
  if (error) return Response.json({ ok: false, error: error.message }, { status: 400, headers: CORS });
  bustCaches(body.slug);
  return Response.json({ ok: true }, { headers: CORS });
}
