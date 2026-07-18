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
    ? `<a href="${url}"><img src="${coverImage}" alt="${escapeHtml(title)}" width="504" style="width:100%;max-width:504px;height:auto;border-radius:12px;display:block;margin:0 0 20px 0;border:1px solid ${BRAND.border};" /></a>`
    : "";

  const body = `
    ${cover}
    <div style="color:${BRAND.muted};font-size:12px;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;">New post · ${escapeHtml(publishedAt)}</div>
    <h1 style="margin:0 0 12px 0;font-size:22px;line-height:1.3;color:#fff;">
      <a href="${url}" style="color:#fff;text-decoration:none;">${escapeHtml(title)}</a>
    </h1>
    <p style="margin:0 0 22px 0;color:${BRAND.text};">${escapeHtml(summary)}</p>
    <p style="margin:0 0 8px 0;">
      <a href="${url}" style="display:inline-block;background:${BRAND.accent};color:#fff;text-decoration:none;padding:11px 20px;border-radius:10px;font-weight:600;font-size:14px;">Read the post →</a>
    </p>
    <p style="margin:24px 0 0 0;color:${BRAND.muted};font-size:13px;">— Syed</p>
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
