import { Fraunces } from "next/font/google";

export const poemSerif = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-poem-serif",
  axes: ["SOFT", "opsz"],
});
