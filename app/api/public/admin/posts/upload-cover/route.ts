import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/app/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/public/admin/posts/upload-cover
 * multipart/form-data: `file` (image), optional `slug`.
 * Returns the public URL of the uploaded object in the `blog-covers` bucket.
 * Protected by ADMIN_API_SECRET. Called from the Admin-dashboard project.
 *
 * Prereq: create bucket `blog-covers` (public) in Supabase Storage.
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

function safeExt(name: string, mime: string): string {
  const ext = (name.split(".").pop() || "").toLowerCase();
  const allowed = ["jpg", "jpeg", "png", "webp", "gif", "avif"];
  if (allowed.includes(ext)) return ext === "jpeg" ? "jpg" : ext;
  if (mime.includes("png")) return "png";
  if (mime.includes("webp")) return "webp";
  if (mime.includes("gif")) return "gif";
  if (mime.includes("avif")) return "avif";
  return "jpg";
}

export async function POST(req: NextRequest) {
  if (!authorize(req)) return new Response("Unauthorized", { status: 401, headers: CORS });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ ok: false, error: "expected multipart/form-data" }, { status: 400, headers: CORS });
  }
  const file = form.get("file");
  if (!(file instanceof File)) {
    return Response.json({ ok: false, error: "file field required" }, { status: 400, headers: CORS });
  }
  const slug = (form.get("slug") as string | null)?.replace(/[^a-z0-9-_]/gi, "") || "cover";
  const folderRaw = (form.get("folder") as string | null) || "covers";
  // Allow only safe folder names like "covers", "inline", "inline/my-slug"
  const folder = folderRaw
    .split("/")
    .map((s) => s.replace(/[^a-z0-9-_]/gi, ""))
    .filter(Boolean)
    .join("/") || "covers";
  const ext = safeExt(file.name, file.type);
  const key = `${folder}/${slug}-${Date.now()}.${ext}`;

  const supabase = await createSupabaseAdminClient();
  const buf = new Uint8Array(await file.arrayBuffer());
  const { error } = await supabase.storage
    .from("blog-covers")
    .upload(key, buf, {
      contentType: file.type || `image/${ext}`,
      upsert: false,
    });
  if (error) return Response.json({ ok: false, error: error.message }, { status: 400, headers: CORS });

  const { data: pub } = supabase.storage.from("blog-covers").getPublicUrl(key);
  return Response.json({ ok: true, url: pub.publicUrl, key }, { headers: CORS });
}
