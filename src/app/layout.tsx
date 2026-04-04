import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen bg-[#0a0a0b] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
