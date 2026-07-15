import { posts } from "#site/content";
import { siteMetadata } from "@/app/data/siteMetadata";

export const dynamic = "force-static";
export const revalidate = 3600; // regenerate hourly

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}

export async function GET() {
  const site = siteMetadata.siteUrl;

  const sorted = [...posts]
    .filter((p) => !p.draft)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

  const items = sorted
    .map((post) => {
      const url = `${site}/blog/${post.slug}`;
      const image = post.imageName ? `${site}/blog/${post.imageName}` : "";
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(post.summary || "")}</description>
      ${image ? `<enclosure url="${image}" type="image/webp" />` : ""}
      <author>${escapeXml(siteMetadata.email.replace("mailto:", ""))} (${escapeXml(siteMetadata.author)})</author>
    </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteMetadata.title)}</title>
    <link>${site}</link>
    <description>${escapeXml(siteMetadata.description)}</description>
    <language>${siteMetadata.language}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${site}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
