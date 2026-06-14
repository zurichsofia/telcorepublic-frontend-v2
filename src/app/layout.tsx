import type { Viewport } from "next";
import localFont from "next/font/local";

import "swiper/css";

import "./globals.css";
import { getNewsArticleCount } from "@/data/news";
import { AppShell } from "@/components/common/app-shell";
import { defaultMetadata } from "@/lib/page-metadata";
import { cn } from "@/lib/utils";

const helveticaNeue = localFont({
  src: "../fonts/helvetica-neue-lt-std-53-extended.otf",
  variable: "--font-sans",
  display: "swap",
});

export const metadata = defaultMetadata;

export const viewport: Viewport = {
  // Lets `env(safe-area-inset-*)` resolve so the Safari toolbar tint strips can
  // sit in the chrome gutter. Initial tint is dark to match the boot loader.
  viewportFit: "cover",
  themeColor: "#150f0f",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const newsArticleCount = await getNewsArticleCount();

  return (
    <html
      lang="en"
      className={cn(helveticaNeue.variable, "font-sans")}
    >
      <body
        className={`${helveticaNeue.className} relative min-h-screen font-light text-telco-dark antialiased`}
      >
        <AppShell newsArticleCount={newsArticleCount}>{children}</AppShell>
      </body>
    </html>
  );
}
