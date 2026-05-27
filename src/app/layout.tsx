import type { Metadata } from "next";
import localFont from "next/font/local";

import "swiper/css";

import "./globals.css";
import { AppShell } from "@/components/common/app-shell";
import { PageLoader } from "@/components/common/page-loader";
import { cn } from "@/lib/utils";

const helveticaNeue = localFont({
  src: "../fonts/helvetica-neue-lt-std-53-extended.otf",
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Telcorepublic Research | Networks, signals, insight",
  description:
    "Independent telecom research - spectrum, infrastructure, and the systems that connect the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(helveticaNeue.variable, "font-sans")}
    >
      <body
        className={`${helveticaNeue.className} relative min-h-screen font-light text-black antialiased`}
      >
        {/* <FloatingLinesAppBackground /> */}
        <PageLoader />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
