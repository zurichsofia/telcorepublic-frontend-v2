import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SnowMountainHeroOverlayProps = {
  children: ReactNode;
  hideCursor?: boolean;
  className?: string;
};

export function SnowMountainHeroOverlay({
  children,
  hideCursor = false,
  className,
}: SnowMountainHeroOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <div
        className={cn(
          "relative mx-auto size-full",
          hideCursor && "cursor-none [&_a]:cursor-pointer",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
