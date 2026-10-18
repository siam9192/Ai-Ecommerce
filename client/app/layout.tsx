import type { Metadata } from "next";
import { Poppins, Lato } from "next/font/google";
import "./globals.css";
import Header from "@/components/shared/header";
import Footer from "@/components/sections/footer";
import Provider from "@/providers/provider";
import AiButton from "@/components/ui/ai-button";

const poppinsSans = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const latoSans = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "AIShop | Smarter Shopping, Made Simple",
    template: "%s | AIShop",
  },
  description:
    "Discover quality products, compare options, and shop with AIShop's curated catalog, personalized product discovery, and convenient order tracking.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${poppinsSans.variable} ${latoSans.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
