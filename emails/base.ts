// Shared email HTML shell used by all templates.
// Ultra-clean editorial aesthetic — light paper, refined typography, generous whitespace.
// Inspired by Stripe / Linear / Vercel transactional emails.

export const BRAND = {
  name: "Syed",
  site: "syed.flinkeo.online",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://syed.flinkeo.online",
  logo: "https://syed.flinkeo.online/syed_logo.webp",
  // Palette — light, editorial
  bg: "#f4f4f2",        // outer canvas (warm off-white)
  card: "#ffffff",       // paper
  ink: "#0a0a0a",        // primary text
  text: "#1f1f1f",       // body
  muted: "#6b6b6b",      // secondary
  subtle: "#9a9a9a",     // tertiary / footer
  hairline: "#eaeaea",   // borders
  accent: "#0a0a0a",     // buttons — monochrome premium
  accentText: "#ffffff",
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
    <meta name="color-scheme" content="light only" />
    <meta name="supported-color-schemes" content="light" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:${BRAND.bg};color:${BRAND.text};font-family:ui-sans-serif,-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
    <span style="display:none!important;opacity:0;visibility:hidden;mso-hide:all;font-size:1px;color:${BRAND.bg};line-height:1px;max-height:0;max-width:0;overflow:hidden;">${escapeHtml(preheader)}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};padding:48px 16px;">
      <tr><td align="center">

        <!-- Wordmark header -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 0 20px 0;">
          <tr>
            <td style="padding:0 4px;">
              <a href="${BRAND.siteUrl}" style="text-decoration:none;color:${BRAND.ink};display:inline-flex;align-items:center;gap:10px;">
                <img src="${BRAND.logo}" alt="" width="24" height="24" style="border-radius:6px;display:inline-block;vertical-align:middle;" />
                <span style="font-size:14px;font-weight:600;letter-spacing:-0.01em;color:${BRAND.ink};vertical-align:middle;">Syed</span>
              </a>
            </td>
            <td align="right" style="padding:0 4px;">
              <a href="${BRAND.siteUrl}" style="font-size:12px;color:${BRAND.subtle};text-decoration:none;letter-spacing:0.02em;">${BRAND.site}</a>
            </td>
          </tr>
        </table>

        <!-- Paper card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${BRAND.card};border:1px solid ${BRAND.hairline};border-radius:14px;overflow:hidden;box-shadow:0 1px 2px rgba(15,15,15,0.04);">
          <tr><td style="padding:40px 40px 36px 40px;color:${BRAND.text};line-height:1.65;font-size:15px;">
            ${bodyHtml}
          </td></tr>
        </table>

        <!-- Footer -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin-top:24px;">
          <tr><td style="padding:0 4px;font-size:12px;color:${BRAND.subtle};line-height:1.7;text-align:center;">
            You're receiving this because you subscribed at
            <a href="${BRAND.siteUrl}" style="color:${BRAND.muted};text-decoration:underline;">${BRAND.site}</a>.
            <br/>
            <a href="${unsubscribeUrl}" style="color:${BRAND.muted};text-decoration:underline;">Unsubscribe</a>
            <span style="color:${BRAND.hairline};">&nbsp;·&nbsp;</span>
            <a href="${BRAND.siteUrl}" style="color:${BRAND.muted};text-decoration:underline;">Visit site</a>
            <br/><br/>
            <span style="color:${BRAND.subtle};">© ${new Date().getFullYear()} Abushaid Islam</span>
          </td></tr>
        </table>

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
