-- Run this once in Supabase SQL Editor.
-- Adds unsubscribe/status fields to the existing blog_subscribers table
-- and ensures sent_blog_emails exists.

alter table public.blog_subscribers
  add column if not exists unsubscribe_token text unique default encode(gen_random_bytes(24), 'hex'),
  add column if not exists status text not null default 'active',
  add column if not exists unsubscribed_at timestamptz,
  add column if not exists created_at timestamptz not null default now();

update public.blog_subscribers
set unsubscribe_token = encode(gen_random_bytes(24), 'hex')
where unsubscribe_token is null;

create index if not exists blog_subscribers_status_idx on public.blog_subscribers(status);
create index if not exists blog_subscribers_token_idx on public.blog_subscribers(unsubscribe_token);

create table if not exists public.sent_blog_emails (
  id bigserial primary key,
  slug text not null,
  email text not null,
  sent_at timestamptz not null default now(),
  unique (slug, email)
);
create index if not exists sent_blog_emails_slug_idx on public.sent_blog_emails(slug);
