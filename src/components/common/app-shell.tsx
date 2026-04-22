"use client";

import { usePathname } from "next/navigation";

import { Footer } from "@/components/common/footer";
import { Navigation } from "@/components/common/navigation";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const isNews = pathname === "/news" || pathname.startsWith("/news/");

  return (
    <div
      className={cn(
        "relative z-10 flex min-h-screen flex-col",
        isNews ? "bg-telco-dark" : "bg-white",
      )}
    >
      <Navigation theme={isNews ? "blog" : "default"} />
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      <Footer className="mt-auto" />
    </div>
  );
}
