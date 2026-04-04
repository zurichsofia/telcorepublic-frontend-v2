import Image from "next/image";

export function HeroImageBackground() {
  return (
    <div className="relative h-full w-full">
      <Image
        src="/hero-alps.png"
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
        quality={92}
      />
    </div>
  );
}
