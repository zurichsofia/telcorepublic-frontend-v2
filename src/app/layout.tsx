import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

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
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body
        className={`${inter.className} min-h-screen bg-[var(--bg)] font-light text-[var(--fg)] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
