import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/app/lib/supabase/server";
import { randomBytes } from "crypto";
import { sendMail } from "@/app/lib/email/smtp";
import { welcomeEmail } from "@/emails/welcome";
import { unsubscribeUrl } from "@/emails/base";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Admin subscribers CRUD. Protected by ADMIN_API_SECRET.
 *
 * GET    /api/public/admin/subscribers?status=active|unsubscribed|all&search=&limit=&offset=
 * POST   { email, sendWelcome?: boolean }                            — add subscriber
 * PATCH  { email, status: "active"|"unsubscribed" }                  — update status
 * DELETE { email }                                                    — hard delete
 */

const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
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
  const url = new URL(req.url);
  const status = url.searchParams.get("status") ?? "all";
  const search = url.searchParams.get("search")?.trim();
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "100"), 500);
  const offset = parseInt(url.searchParams.get("offset") ?? "0");

  const supabase = await createSupabaseAdminClient();
  let q = supabase
    .from("blog_subscribers")
    .select("email, status, unsubscribe_token, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status === "active") q = q.or("status.eq.active,status.is.null");
  else if (status === "unsubscribed") q = q.eq("status", "unsubscribed");
  if (search) q = q.ilike("email", `%${search}%`);

  const { data, count, error } = await q;
  if (error) return Response.json({ ok: false, error: error.message }, { status: 400, headers: CORS });

  return Response.json(
    { ok: true, total: count ?? 0, subscribers: data ?? [] },
    { headers: CORS },
  );
}

export async function POST(req: NextRequest) {
  if (!authorize(req)) return new Response("Unauthorized", { status: 401, headers: CORS });
  const body = (await req.json().catch(() => ({}))) as { email?: string; sendWelcome?: boolean };
  const email = body.email?.trim().toLowerCase();
  if (!email || !/^\S+@\S+\.\S+$/.test(email))
    return Response.json({ ok: false, error: "valid email required" }, { status: 400, headers: CORS });

  const supabase = await createSupabaseAdminClient();
  const token = randomBytes(24).toString("hex");
  const { data, error } = await supabase
    .from("blog_subscribers")
    .upsert(
      { email, status: "active", unsubscribe_token: token },
      { onConflict: "email", ignoreDuplicates: false },
    )
    .select()
    .single();
  if (error) return Response.json({ ok: false, error: error.message }, { status: 400, headers: CORS });

  if (body.sendWelcome) {
    const { subject, html } = welcomeEmail({ email, token: data.unsubscribe_token });
    await sendMail({
      to: email,
      subject,
      html,
      unsubscribeUrl: unsubscribeUrl(data.unsubscribe_token),
    });
  }

  return Response.json({ ok: true, subscriber: data }, { headers: CORS });
}

export async function PATCH(req: NextRequest) {
  if (!authorize(req)) return new Response("Unauthorized", { status: 401, headers: CORS });
  const body = (await req.json().catch(() => ({}))) as { email?: string; status?: "active" | "unsubscribed" };
  if (!body.email || !body.status)
    return Response.json({ ok: false, error: "email and status required" }, { status: 400, headers: CORS });
  const supabase = await createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("blog_subscribers")
    .update({ status: body.status })
    .eq("email", body.email.toLowerCase())
    .select()
    .single();
  if (error) return Response.json({ ok: false, error: error.message }, { status: 400, headers: CORS });
  return Response.json({ ok: true, subscriber: data }, { headers: CORS });
}

export async function DELETE(req: NextRequest) {
  if (!authorize(req)) return new Response("Unauthorized", { status: 401, headers: CORS });
  const body = (await req.json().catch(() => ({}))) as { email?: string };
  if (!body.email)
    return Response.json({ ok: false, error: "email required" }, { status: 400, headers: CORS });
  const supabase = await createSupabaseAdminClient();
  const { error } = await supabase.from("blog_subscribers").delete().eq("email", body.email.toLowerCase());
  if (error) return Response.json({ ok: false, error: error.message }, { status: 400, headers: CORS });
  return Response.json({ ok: true }, { headers: CORS });
}
