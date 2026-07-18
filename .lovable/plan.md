## Goal
Migrate blog from MDX files (`content/blog/*.mdx`) to Supabase. Cover images live in Supabase Storage. Admin dashboard creates/edits posts. On publish, subscribers get the email automatically. No redeploy needed for new posts.

Design, URLs, components, SEO — 100% same as now.

---

## 1. Database (Supabase migration)

**`blog_posts` table**
- `id` uuid pk
- `slug` text unique
- `title` text
- `summary` text
- `content_mdx` text — raw MDX source
- `cover_image_url` text — full Supabase Storage public URL
- `categories` text[]
- `audio_file_url` text nullable
- `canonical_url` text nullable
- `status` text — `draft` | `published`
- `published_at` timestamptz
- `created_at`, `updated_at` timestamptz

**Indexes:** `status`, `published_at desc`, `slug`.

**RLS:**
- `anon` + `authenticated`: `SELECT` where `status='published'`
- `service_role`: full (used by admin API)

**GRANTs:** `SELECT` to anon/authenticated; ALL to service_role.

**Storage bucket:** `blog-covers` — public read, service-role write.

## 2. MDX rendering — same design, on-demand compile

Add `app/lib/blog/compile.ts` — uses the same velite pipeline pieces (`@mdx-js/mdx` + `rehype-*` plugins Velite uses) to compile `content_mdx` string → JS code string at request time. Result plugs into existing `<MDXContent code={...} />` component unchanged.

Cache compiled output with Next `unstable_cache` keyed by `slug + updated_at` so re-renders are instant, invalidation is automatic on edit.

## 3. Data layer replacement

Replace `import { posts } from "#site/content"` usages with a new module `app/lib/blog/posts.ts`:
- `getAllPosts()` — published, ordered
- `getPostBySlug(slug)` — includes compiled code + headings
- `getPostsByCategory(cat)`
- `getRelatedPosts(post)`

Same `Blog` shape returned so `FeaturedBlogCard`, `BlogPostList`, `/blog/[slug]/page.tsx`, sitemap, RSS, related-posts, `/api/public/admin/posts`, `/api/public/send-blog-emails` all keep working with minimal edits (only the import + one `imageName` → `cover_image_url` swap).

Cover image: `<div style={{ backgroundImage: url(post.cover_image_url) }}>` instead of `/blog/${imageName}`.

Headings: extracted from MDX at compile time (reuse rehype-slug output) and stored in memory alongside compiled code.

## 4. Admin dashboard integration (portfolio side APIs)

New endpoints under `app/api/public/admin/` (all protected by `ADMIN_API_SECRET`, CORS open):

- `GET /admin/blog/posts` — list all posts (drafts + published)
- `GET /admin/blog/posts/[id]` — single post for edit
- `POST /admin/blog/posts` — create (draft or publish)
- `PATCH /admin/blog/posts/[id]` — update
- `DELETE /admin/blog/posts/[id]` — remove
- `POST /admin/blog/upload-cover` — accepts image, uploads to `blog-covers` bucket, returns public URL

**On publish (status → `published` and `published_at` set):** endpoint immediately triggers the existing send-blog-emails flow for that slug. No cron needed for new posts — auto send.

`published_at` future-dated posts stay hidden until the time passes; the existing daily cron picks them up.

## 5. Cleanup

- Delete `content/blog/*.mdx` (15 files) — migrate them into `blog_posts` first via a one-shot migration SQL insert generated from the current files.
- Delete `public/blog/*.webp` covers — reference them by uploading each into Storage as part of the same migration.
- Remove `posts` export from Velite config (keep changelog untouched).
- Update `app/rss.xml`, `app/sitemap.ts`, `app/blog/page.tsx`, `app/blog/category/[category]/page.tsx`, `app/blog/[slug]/page.tsx`, `app/lib/utils.ts` (`getRelatedBlogPosts`), `app/api/og/route.tsx`, admin posts route, send-blog-emails route — all switch to new `getAllPosts` / `getPostBySlug`.

## 6. Admin dashboard project (separate)

Ami ekhan theke sudhu portfolio side ready korbo. Admin-dashboard project e switch kore bolo, ami okhane:
- Blog list page (drafts + published)
- New / edit page with MDX editor + live preview + cover upload
- Publish button (auto-triggers email)
- "Send email now" manual button
- Later: auto-send on/off toggle (per post checkbox + global setting)

---

## Order of execution (this turn)

1. Enable Supabase Storage bucket
2. Run schema migration (`blog_posts`, RLS, grants, indexes)
3. Data-migration: read all `content/blog/*.mdx` → SQL insert with cover images pointing to `/blog/<file>.webp` (temporary — will move to Storage next)
4. Upload existing covers to `blog-covers` bucket, update rows with Storage URLs
5. Add `app/lib/blog/{posts,compile}.ts`
6. Rewrite blog pages/routes to use new data layer
7. Add admin CRUD + upload endpoints
8. Wire auto-email on publish
9. Delete old MDX files + `public/blog/*.webp`
10. Verify build

## Questions before I start

1. **Draft/Preview:** Admin dashboard e draft save korte parbe, then preview korte parbe publish er age? (recommended: yes)
2. **Scheduled publish:** `published_at` future date dile automatic publish + email — chao? (recommended: yes, free with existing cron)
3. **Auto-email on publish:** first version e always ON, na ekhon i per-post toggle chao? (recommended: always ON now, toggle next iteration jemon tumi bolso)

Ei 3 ta answer dile ami step 1 theke shuru korbo.