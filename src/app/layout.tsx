import type { Metadata } from "next";
import { Inter, Playfair_Display, Geist } from "next/font/google";
import "./globals.css";
import { GlobalTvGrainOverlay } from "@/components/global-tv-grain-overlay";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Telcorepublic Research | Networks, signals, insight",
  description:
    "Independent telecom research — spectrum, infrastructure, and the systems that connect the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(inter.variable, playfair.variable, "font-sans", geist.variable, "dark")}
    >
      <body
        className={`${inter.className} min-h-screen font-light text-[var(--fg)] antialiased`}
      >
        {children}
        <GlobalTvGrainOverlay />
      </body>
    </html>
  );
}
