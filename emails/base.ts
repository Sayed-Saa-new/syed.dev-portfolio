// Shared email HTML shell used by all templates.
// Kept as plain string builders (no React deps) so it works everywhere.

export const BRAND = {
  name: "Syed",
  site: "syed.flinkeo.online",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://syed.flinkeo.online",
  logo: "https://syed.flinkeo.online/syed_logo.webp",
  accent: "#7c3aed",
  bg: "#0b0b0f",
  card: "#111116",
  text: "#e5e7eb",
  muted: "#9ca3af",
  border: "#1f2937",
};

export function shell(opts: {
  title: string;
  preheader?: string;
  bodyHtml: string;
  unsubscribeUrl: string;
}): string {
  const { title, preheader = "", bodyHtml, unsubscribeUrl } = opts;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="color-scheme" content="dark light" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:${BRAND.bg};color:${BRAND.text};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <span style="display:none!important;opacity:0;visibility:hidden;mso-hide:all;font-size:1px;color:${BRAND.bg};line-height:1px;max-height:0;max-width:0;">${escapeHtml(preheader)}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${BRAND.card};border:1px solid ${BRAND.border};border-radius:16px;overflow:hidden;">
          <tr><td style="padding:24px 28px 8px 28px;">
            <img src="${BRAND.logo}" alt="Syed" width="40" height="40" style="border-radius:8px;display:block;" />
          </td></tr>
          <tr><td style="padding:8px 28px 28px 28px;color:${BRAND.text};line-height:1.6;font-size:15px;">
            ${bodyHtml}
          </td></tr>
          <tr><td style="padding:20px 28px;border-top:1px solid ${BRAND.border};font-size:12px;color:${BRAND.muted};">
            You're receiving this because you subscribed at
            <a href="${BRAND.siteUrl}" style="color:${BRAND.muted};text-decoration:underline;">${BRAND.site}</a>.
            <br/>
            <a href="${unsubscribeUrl}" style="color:${BRAND.muted};text-decoration:underline;">Unsubscribe</a>
            &nbsp;·&nbsp;
            <a href="${BRAND.siteUrl}" style="color:${BRAND.muted};text-decoration:underline;">Visit site</a>
          </td></tr>
        </table>
        <div style="max-width:560px;color:${BRAND.muted};font-size:11px;margin-top:16px;text-align:center;">
          © ${new Date().getFullYear()} Abushaid Islam (Syed)
        </div>
      </td></tr>
    </table>
  </body>
</html>`;
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function unsubscribeUrl(token: string): string {
  return `${BRAND.siteUrl}/unsubscribe?token=${encodeURIComponent(token)}`;
}
