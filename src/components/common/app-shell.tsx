"use client";

import { usePathname } from "next/navigation";

import { Footer } from "@/components/common/footer";
import { Navigation } from "@/components/common/navigation";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const isNews = pathname === "/news" || pathname.startsWith("/news/");
  const isContact = pathname === "/contact";
  const darkShell = isNews || isContact;
  const isServiceDetail = /^\/services\/[^/]+$/.test(pathname);

  return (
    <div
      className={cn(
        "relative z-10 flex min-h-screen flex-col",
        darkShell ? "bg-telco-dark" : isServiceDetail ? "bg-transparent" : "bg-white",
      )}
    >
      <Navigation
        className={isServiceDetail ? "absolute top-0 right-0 left-0 z-30 w-full" : undefined}
        theme={darkShell ? "blog" : isServiceDetail ? "overlay" : "default"}
      />
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      <Footer className="mt-auto" />
    </div>
  );
}
