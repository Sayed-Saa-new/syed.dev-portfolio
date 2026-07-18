import { BRAND, escapeHtml, shell, unsubscribeUrl } from "./base";

export function welcomeEmail(opts: { email: string; token: string }) {
  const body = `
    <h1 style="margin:0 0 12px 0;font-size:22px;color:#fff;">Welcome aboard 👋</h1>
    <p style="margin:0 0 14px 0;">Hey — Syed here. Thanks for subscribing to my newsletter.</p>
    <p style="margin:0 0 14px 0;">
      I write about building AI-powered products, authentication systems, and the day-to-day of
      shipping side projects. You'll get an email whenever I publish a new post — no spam, no fluff.
    </p>
    <p style="margin:0 0 22px 0;">While you wait, here are a few good starting points:</p>
    <p style="margin:0 0 8px 0;">
      → <a href="${BRAND.siteUrl}/blog" style="color:${BRAND.accent};text-decoration:none;">Read the blog</a><br/>
      → <a href="${BRAND.siteUrl}/projects" style="color:${BRAND.accent};text-decoration:none;">See my projects</a><br/>
      → <a href="${BRAND.siteUrl}/about" style="color:${BRAND.accent};text-decoration:none;">About me</a>
    </p>
    <p style="margin:0;color:${BRAND.muted};font-size:13px;">— Syed</p>
  `;

  return {
    subject: "Welcome to Syed's newsletter 👋",
    html: shell({
      title: "Welcome",
      preheader: "Thanks for subscribing — here's what to expect.",
      bodyHtml: body,
      unsubscribeUrl: unsubscribeUrl(opts.token),
    }),
  };
}
