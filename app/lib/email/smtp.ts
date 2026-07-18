import nodemailer, { type Transporter } from "nodemailer";

let cached: Transporter | null = null;

export function getTransporter(): Transporter {
  if (cached) return cached;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    throw new Error("SMTP env vars missing (SMTP_HOST/SMTP_USER/SMTP_PASS).");
  }
  cached = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return cached;
}

export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
  unsubscribeUrl?: string;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const from = process.env.SMTP_FROM || process.env.SMTP_USER!;
    const headers: Record<string, string> = {};
    if (opts.unsubscribeUrl) {
      headers["List-Unsubscribe"] = `<${opts.unsubscribeUrl}>`;
      headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
    }
    await getTransporter().sendMail({
      from,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      headers,
    });
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[smtp] send failed:", msg);
    return { ok: false, error: msg };
  }
}
