import { BRAND, escapeHtml, shell, unsubscribeUrl } from "./base";

export function newPostEmail(opts: {
  token: string;
  title: string;
  summary: string;
  url: string;
  coverImage?: string;
  publishedAt: string;
}) {
  const { title, summary, url, coverImage, publishedAt } = opts;

  const cover = coverImage
    ? `<a href="${url}" style="display:block;margin:0 0 28px 0;">
         <img src="${coverImage}" alt="${escapeHtml(title)}" width="480"
              style="width:100%;max-width:480px;height:auto;border-radius:10px;display:block;border:1px solid ${BRAND.hairline};" />
       </a>`
    : "";

  const body = `
    ${cover}

    <div style="font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND.subtle};margin:0 0 16px 0;">
      New essay · ${escapeHtml(publishedAt)}
    </div>

    <h1 style="margin:0 0 16px 0;font-size:28px;line-height:1.2;letter-spacing:-0.02em;color:${BRAND.ink};font-weight:600;">
      <a href="${url}" style="color:${BRAND.ink};text-decoration:none;">${escapeHtml(title)}</a>
    </h1>

    <p style="margin:0 0 32px 0;color:${BRAND.text};font-size:15px;line-height:1.75;">
      ${escapeHtml(summary)}
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 32px 0;">
      <tr><td style="border-radius:10px;background:${BRAND.accent};">
        <a href="${url}"
           style="display:inline-block;padding:12px 22px;font-size:14px;font-weight:600;
                  color:${BRAND.accentText};text-decoration:none;letter-spacing:-0.005em;">
          Read the post &nbsp;→
        </a>
      </td></tr>
    </table>

    <div style="height:1px;background:${BRAND.hairline};margin:0 0 20px 0;"></div>

    <p style="margin:0;color:${BRAND.muted};font-size:13px;line-height:1.6;">
      Or open it in your browser:<br/>
      <a href="${url}" style="color:${BRAND.muted};text-decoration:underline;word-break:break-all;">${url}</a>
    </p>

    <p style="margin:28px 0 0 0;color:${BRAND.muted};font-size:14px;">— Syed</p>
  `;

  return {
    subject: title,
    html: shell({
      title,
      preheader: summary,
      bodyHtml: body,
      unsubscribeUrl: unsubscribeUrl(opts.token),
    }),
  };
}
