type HardwareDataItem = {
  title: string;
  description: string;
  link: string;
};

type SoftwareDataItem = {
  title: string;
  imgSrc: string;
  link: string;
};

const softwareData: SoftwareDataItem[] = [
  {
    title: "VSCode",
    imgSrc: "/vscode_logo.webp",
    link: "https://code.visualstudio.com/",
  },
  {
    title: "Cursor",
    imgSrc: "https://cursor.sh/apple-touch-icon.png",
    link: "https://cursor.sh/",
  },
  {
    title: "GitHub",
    imgSrc: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
    link: "https://github.com/",
  },
  {
    title: "ChatGPT",
    imgSrc: "/chatgpt_logo.webp",
    link: "https://chat.openai.com/",
  },
  {
    title: "Claude",
    imgSrc: "/claude_logo.webp",
    link: "https://claude.ai/",
  },
  {
    title: "Supabase",
    imgSrc: "https://supabase.com/favicon/favicon-196x196.png",
    link: "https://supabase.com/",
  },
  {
    title: "Vercel",
    imgSrc: "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png",
    link: "https://vercel.com/",
  },
  {
    title: "Next.js",
    imgSrc: "https://nextjs.org/favicon.ico",
    link: "https://nextjs.org/",
  },
  {
    title: "Figma",
    imgSrc: "/figma_logo.webp",
    link: "https://www.figma.com/",
  },
  {
    title: "Notion",
    imgSrc: "/notion_logo.webp",
    link: "https://www.notion.so/",
  },
  {
    title: "Linear",
    imgSrc: "/linear_logo.webp",
    link: "https://linear.app/",
  },
  {
    title: "Postman",
    imgSrc: "https://www.postman.com/_ar-assets/images/favicon-1-48.png",
    link: "https://www.postman.com/",
  },
  {
    title: "Docker",
    imgSrc: "https://www.docker.com/app/uploads/2024/02/cropped-docker-logo-favicon-192x192.png",
    link: "https://www.docker.com/",
  },
  {
    title: "Spotify",
    imgSrc: "/spotify_logo.webp",
    link: "https://www.spotify.com/",
  },
  {
    title: "Arc",
    imgSrc: "/arc_logo.webp",
    link: "https://arc.net/",
  },
  {
    title: "Raycast",
    imgSrc: "/raycast_logo.webp",
    link: "https://raycast.com/",
  },
];

const hardwareData: HardwareDataItem[] = [
  {
    title: "Asus Vivobook 15",
    description:
      "My daily driver for shipping AI-powered apps, full-stack builds, and long coding sessions.",
    link: "https://www.asus.com/laptops/for-home/vivobook/",
  },
  {
    title: "External 27\" Monitor",
    description:
      "Extra screen real-estate for splitting code, terminal, browser preview, and AI chat side-by-side.",
    link: "https://www.lg.com/",
  },
  {
    title: "Mechanical Keyboard",
    description:
      "A tactile mechanical keyboard that makes long coding and writing sessions genuinely enjoyable.",
    link: "https://www.keychron.com/",
  },
  {
    title: "Logitech MX Master 3S",
    description:
      "Smooth, quiet, and precise — the mouse I rely on for design work and navigating large codebases.",
    link: "https://www.logitech.com/en-us/products/mice/mx-master-3s.html",
  },
  {
    title: "iPhone",
    description:
      "For testing responsive UIs on real hardware, capturing ideas on the go, and staying connected.",
    link: "https://www.apple.com/iphone/",
  },
  {
    title: "Noise-Cancelling Headphones",
    description:
      "Deep-work fuel — blocks out noise so I can stay in flow while building and shipping.",
    link: "https://www.sony.com/",
  },
];

export { hardwareData, softwareData };
