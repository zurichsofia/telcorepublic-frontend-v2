import type { Metadata } from "next";
import { Inter, Syne, Geist } from "next/font/google";
import "./globals.css";
import { GlobalTvGrainOverlay } from "@/components/global-tv-grain-overlay";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
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
      className={cn(inter.variable, syne.variable, "font-sans", geist.variable, "dark")}
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
