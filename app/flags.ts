import { flag } from "flags/next";
import { vercelAdapter } from "@flags-sdk/vercel";

export const showPoemFlag = flag<boolean>({
  key: "show-poem",
  adapter: vercelAdapter(),
  defaultValue: process.env.NODE_ENV === "development",
  description:
    "Show the personal poem page (/poem) and its link in the navbar.",
});
