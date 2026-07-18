import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get the query parameters
    const title = searchParams.get("title") || "Blog Post";
    const imageName = searchParams.get("image") || "";

    // Read images directly from the filesystem
    const publicDir = path.join(process.cwd(), "public");

    // Read the blog image (validate to prevent path traversal)
    let blogImageSrc = "";
    if (/^https?:\/\//i.test(imageName)) {
      // Full URL (e.g. Supabase Storage) — use directly; ImageResponse fetches it.
      blogImageSrc = imageName;
    } else {
      const safeName = path.basename(imageName);
      const isSafe =
        !!safeName &&
        safeName === imageName &&
        !imageName.includes("..") &&
        !imageName.includes("/") &&
        !imageName.includes("\\") &&
        /^[a-zA-Z0-9._-]+\.(jpg|jpeg|png|webp|gif)$/i.test(safeName);
      if (isSafe) {
        const blogDir = path.join(publicDir, "blog");
        const blogImagePath = path.resolve(blogDir, safeName);
        if (
          blogImagePath.startsWith(path.resolve(blogDir) + path.sep) &&
          fs.existsSync(blogImagePath)
        ) {
          const blogImageBuffer = fs.readFileSync(blogImagePath);
          const ext = path.extname(imageName).toLowerCase().slice(1);
          const mimeType = ext === "jpg" ? "jpeg" : ext;
          blogImageSrc = `data:image/${mimeType};base64,${blogImageBuffer.toString("base64")}`;
        }
      }
    }

    // Gradient overlay applied via CSS (no external overlay asset needed)

    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 128,
            background: "blue",
            width: "100%",
            height: "100%",
            display: "flex",
            textAlign: "left",
            position: "relative",
          }}
        >
          {blogImageSrc && (
            <img
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              src={blogImageSrc}
              alt="article background image"
            />
          )}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%)",
            }}
          />

          <h1
            style={{
              position: "absolute",
              bottom: -48,
              left: 0,
              paddingLeft: 88,
              width: "100%",
              color: "white",
              fontSize: 60,
              lineHeight: 1.2,
              maxWidth: 896,
            }}
          >
            {title}
          </h1>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
