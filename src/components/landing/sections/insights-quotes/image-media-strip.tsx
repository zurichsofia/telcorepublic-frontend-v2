"use client";

import Image from "next/image";

const MEDIA_STRIP_CLASS =
  "relative h-[50vh] w-full overflow-hidden bg-telco-dark [content-visibility:auto] [contain-intrinsic-size:50vh] lg:h-[100vh] lg:[contain-intrinsic-size:100vh]";

export function ImageMediaStrip({ imageSrc }: { imageSrc: string }) {
  return (
    <div className={MEDIA_STRIP_CLASS} aria-hidden>
      <Image
        src={imageSrc}
        alt=""
        fill
        sizes="100vw"
        quality={75}
        fetchPriority="low"
        className="object-cover object-center"
        priority={false}
      />
    </div>
  );
}
