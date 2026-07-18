import { BRAND, shell, unsubscribeUrl } from "./base";

export function welcomeEmail(opts: { email: string; token: string }) {
  const body = `
    <div style="font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND.subtle};margin:0 0 20px 0;">
      Welcome
    </div>

    <h1 style="margin:0 0 20px 0;font-size:28px;line-height:1.2;letter-spacing:-0.02em;color:${BRAND.ink};font-weight:600;">
      Glad you're here.
    </h1>

    <p style="margin:0 0 16px 0;color:${BRAND.text};font-size:15px;line-height:1.7;">
      Hey — Syed here. Thanks for subscribing.
    </p>
    <p style="margin:0 0 28px 0;color:${BRAND.text};font-size:15px;line-height:1.7;">
      I write about building AI-powered products, authentication systems, and the day-to-day
      of shipping side projects. You'll only hear from me when there's something new worth reading.
      No spam. No fluff.
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 32px 0;">
      <tr><td style="border-radius:10px;background:${BRAND.accent};">
        <a href="${BRAND.siteUrl}/blog"
           style="display:inline-block;padding:12px 22px;font-size:14px;font-weight:600;
                  color:${BRAND.accentText};text-decoration:none;letter-spacing:-0.005em;">
          Read the blog &nbsp;→
        </a>
      </td></tr>
    </table>

    <div style="height:1px;background:${BRAND.hairline};margin:0 0 28px 0;"></div>

    <div style="font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND.subtle};margin:0 0 14px 0;">
      Start here
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:6px 0;">
        <a href="${BRAND.siteUrl}/projects" style="color:${BRAND.ink};text-decoration:none;font-size:15px;font-weight:500;">Projects</a>
        <div style="color:${BRAND.muted};font-size:13px;line-height:1.5;margin-top:2px;">Things I've built — Aegis, Readoft, DMailova.</div>
      </td></tr>
      <tr><td style="padding:10px 0 6px 0;">
        <a href="${BRAND.siteUrl}/about" style="color:${BRAND.ink};text-decoration:none;font-size:15px;font-weight:500;">About</a>
        <div style="color:${BRAND.muted};font-size:13px;line-height:1.5;margin-top:2px;">A bit about me and how I work.</div>
      </td></tr>
      <tr><td style="padding:10px 0 0 0;">
        <a href="${BRAND.siteUrl}/toolbox" style="color:${BRAND.ink};text-decoration:none;font-size:15px;font-weight:500;">Toolbox</a>
        <div style="color:${BRAND.muted};font-size:13px;line-height:1.5;margin-top:2px;">The software and hardware I use daily.</div>
      </td></tr>
    </table>

    <p style="margin:32px 0 0 0;color:${BRAND.muted};font-size:14px;">— Syed</p>
  `;

  return {
    subject: "Welcome to Syed's newsletter",
    html: shell({
      title: "Welcome",
      preheader: "Thanks for subscribing — here's what to expect.",
      bodyHtml: body,
      unsubscribeUrl: unsubscribeUrl(opts.token),
    }),
  };
}
