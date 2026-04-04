"use client";

import {
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  /** Horizontal entrance direction */
  from?: "left" | "right";
  delayMs?: number;
};

export function ScrollReveal({
  children,
  className = "",
  from = "left",
  delayMs = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const fromClass =
    from === "right"
      ? "translate-x-8 sm:translate-x-12"
      : "-translate-x-8 sm:-translate-x-12";

  return (
    <div ref={ref} className={className}>
      <div
        className={[
          "transition-[opacity,transform] duration-700 ease-out motion-reduce:duration-0",
          visible ? "translate-x-0 opacity-100" : `opacity-0 ${fromClass}`,
        ].join(" ")}
        style={{ transitionDelay: visible ? `${delayMs}ms` : "0ms" }}
      >
        {children}
      </div>
    </div>
  );
}
