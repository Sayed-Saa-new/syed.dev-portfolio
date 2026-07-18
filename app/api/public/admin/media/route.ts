import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/app/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Media library API for the Admin Dashboard.
 * Bucket: `blog-covers` (public).
 *
 * GET    ?folder=covers|inline|""   -> list files (recursive when folder empty)
 * DELETE { key }                    -> remove a file
 * Auth: Bearer ADMIN_API_SECRET (or ?secret=)
 */

const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const BUCKET = "blog-covers";

function authorize(req: NextRequest): boolean {
  const secret = process.env.ADMIN_API_SECRET;
  if (!secret) return false;
  const h = req.headers.get("authorization");
  if (h === `Bearer ${secret}`) return true;
  return new URL(req.url).searchParams.get("secret") === secret;
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

type Item = {
  key: string;
  name: string;
  folder: string;
  url: string;
  size: number | null;
  contentType: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

async function listFolder(
  supabase: Awaited<ReturnType<typeof createSupabaseAdminClient>>,
  prefix: string,
): Promise<Item[]> {
  const { data, error } = await supabase.storage.from(BUCKET).list(prefix, {
    limit: 1000,
    sortBy: { column: "created_at", order: "desc" },
  });
  if (error || !data) return [];
  const items: Item[] = [];
  for (const entry of data) {
    // Subfolders have no `id` in Supabase Storage listings.
    const isFolder = !entry.id;
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (isFolder) {
      items.push(...(await listFolder(supabase, path)));
      continue;
    }
    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
    const meta = (entry.metadata ?? {}) as {
      size?: number;
      mimetype?: string;
    };
    items.push({
      key: path,
      name: entry.name,
      folder: prefix,
      url: pub.publicUrl,
      size: meta.size ?? null,
      contentType: meta.mimetype ?? null,
      createdAt: entry.created_at ?? null,
      updatedAt: entry.updated_at ?? null,
    });
  }
  return items;
}

export async function GET(req: NextRequest) {
  if (!authorize(req)) return new Response("Unauthorized", { status: 401, headers: CORS });
  const url = new URL(req.url);
  const folder = (url.searchParams.get("folder") ?? "").replace(/^\/+|\/+$/g, "");
  const supabase = await createSupabaseAdminClient();
  const items = await listFolder(supabase, folder);
  items.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
  return Response.json(
    { ok: true, bucket: BUCKET, folder, count: items.length, items },
    { headers: CORS },
  );
}

export async function DELETE(req: NextRequest) {
  if (!authorize(req)) return new Response("Unauthorized", { status: 401, headers: CORS });
  const body = (await req.json().catch(() => ({}))) as { key?: string; keys?: string[] };
  const keys = body.keys?.length ? body.keys : body.key ? [body.key] : [];
  if (!keys.length)
    return Response.json({ ok: false, error: "key or keys required" }, { status: 400, headers: CORS });
  const supabase = await createSupabaseAdminClient();
  const { data, error } = await supabase.storage.from(BUCKET).remove(keys);
  if (error) return Response.json({ ok: false, error: error.message }, { status: 400, headers: CORS });
  return Response.json({ ok: true, removed: data?.length ?? 0 }, { headers: CORS });
}
