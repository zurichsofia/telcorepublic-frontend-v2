import type { Metadata } from "next";
import { FiberOpticScene } from "@/components/fiber-optic-scene";

export const metadata: Metadata = {
  title: "Fiber optic | Telcorepublic Research",
  description: "Dark horizon scene with animated fiber-optic light trails.",
};

export default function FiberOpticPage() {
  return (
    <main className="fixed inset-0 z-20 h-dvh w-full bg-[#030712]">
      <FiberOpticScene />
      <div className="pointer-events-none absolute inset-x-0 bottom-10 z-30 flex justify-between px-8 text-[10px] font-medium uppercase tracking-[0.35em] text-white/45">
        <span>Scroll to explore</span>
        <span className="opacity-60">—</span>
      </div>
    </main>
  );
}
