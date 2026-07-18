-- ============================================================
-- Blog posts migration: MDX files → Supabase
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. blog_posts table
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  content_mdx text not null default '',
  cover_image_url text,
  categories text[] not null default '{}',
  audio_file_url text,
  canonical_url text,
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_status_published_at_idx
  on public.blog_posts (status, published_at desc);

create index if not exists blog_posts_slug_idx on public.blog_posts (slug);

-- 2. updated_at trigger
create or replace function public.tg_blog_posts_touch()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists blog_posts_touch on public.blog_posts;
create trigger blog_posts_touch
  before update on public.blog_posts
  for each row execute function public.tg_blog_posts_touch();

-- 3. Grants (Data API needs explicit grants)
grant select on public.blog_posts to anon;
grant select on public.blog_posts to authenticated;
grant all on public.blog_posts to service_role;

-- 4. RLS
alter table public.blog_posts enable row level security;

drop policy if exists "public read published" on public.blog_posts;
create policy "public read published"
  on public.blog_posts for select
  to anon, authenticated
  using (status = 'published' and (published_at is null or published_at <= now()));

-- service_role bypasses RLS automatically; admin API uses service key.

-- ============================================================
-- After running this SQL:
--   1. Go to Storage → New bucket → name: "blog-covers", public: ON
--   2. Run: npx tsx scripts/migrate-blog-to-supabase.ts
--      (uploads existing /public/blog/*.webp to blog-covers bucket
--       and inserts each MDX file as a row in blog_posts)
-- ============================================================
