/**
 * One-shot migration: read every content/blog/*.mdx file, upload its cover
 * from public/blog/ to Supabase Storage (bucket: blog-covers), then insert a
 * matching row into public.blog_posts.
 *
 * Usage:
 *   npx tsx scripts/migrate-blog-to-supabase.ts
 *
 * Env required:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Idempotent: existing slugs are updated, not duplicated.
 * Prereq: run docs/blog-supabase-migration.sql AND create the "blog-covers"
 *         public bucket in Supabase Storage first.
 */

import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "blog-covers";
const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const COVERS_DIR = path.join(process.cwd(), "public", "blog");

function parseFrontmatter(raw: string) {
  const m = /^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/.exec(raw);
  if (!m) throw new Error("no frontmatter");
  const meta: Record<string, any> = {};
  for (const line of m[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val: any = line.slice(idx + 1).trim();
    if (val.startsWith("[") && val.endsWith("]")) {
      val = val
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      val = val.replace(/^["']|["']$/g, "");
    }
    meta[key] = val;
  }
  return { meta, content: m[2].trim() };
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }
  const supabase = createClient(url, key);

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
  console.log(`Found ${files.length} MDX files\n`);

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
    const { meta, content } = parseFrontmatter(raw);

    // Upload cover if it exists
    let coverUrl: string | null = null;
    if (meta.imageName) {
      const coverPath = path.join(COVERS_DIR, meta.imageName);
      if (fs.existsSync(coverPath)) {
        const buf = fs.readFileSync(coverPath);
        const ext = path.extname(meta.imageName).slice(1) || "webp";
        const objectPath = `${slug}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(objectPath, buf, {
            contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
            upsert: true,
          });
        if (upErr) {
          console.warn(`  cover upload failed for ${slug}: ${upErr.message}`);
        } else {
          coverUrl = supabase.storage.from(BUCKET).getPublicUrl(objectPath).data.publicUrl;
        }
      } else {
        console.warn(`  cover file missing: ${coverPath}`);
      }
    }

    const row = {
      slug,
      title: meta.title || slug,
      summary: meta.summary || "",
      content_mdx: content,
      cover_image_url: coverUrl,
      categories: Array.isArray(meta.categories) ? meta.categories : [],
      audio_file_url: meta.audioFile || null,
      canonical_url: meta.canonicalUrl || null,
      status: meta.draft === "true" ? "draft" : "published",
      published_at: meta.publishedAt
        ? new Date(meta.publishedAt).toISOString()
        : new Date().toISOString(),
    };

    const { error } = await supabase
      .from("blog_posts")
      .upsert(row, { onConflict: "slug" });
    if (error) {
      console.error(`✗ ${slug}: ${error.message}`);
    } else {
      console.log(`✓ ${slug}${coverUrl ? " (+ cover)" : ""}`);
    }
  }

  console.log("\nDone. Existing MDX files are untouched — the app now reads");
  console.log("from Supabase first and falls back to MDX for anything missing.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
