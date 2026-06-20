"use client";

import Image from "next/image";
import Link from "next/link";

const MEDIA_STRIP_CLASS =
  "relative h-[60vh] w-full overflow-hidden bg-telco-dark [content-visibility:auto] [contain-intrinsic-size:50vh] lg:h-[100vh] lg:[contain-intrinsic-size:100vh]";

const BODY_COPY_CLASS =
  "leading-tight text-white text-pretty text-lg sm:text-xl md:text-2xl";

export function ImageMediaStrip({ imageSrc }: { imageSrc: string; }) {
  return (
    <div className={MEDIA_STRIP_CLASS}>
      <Image
        src={imageSrc}
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 1280px"
        quality={75}
        fetchPriority="low"
        className="object-cover object-center"
        priority={false}
        aria-hidden
      />

      <div className="absolute inset-0 z-10 flex items-center justify-center px-6 sm:px-10 lg:px-12">
        <div className="max-w-4xl text-center">
          <p className="font-display text-4xl text-telco-red lg:text-5xl">
            Services
          </p>
          <p className={`${BODY_COPY_CLASS} mt-6 sm:mt-8`}>
            Market intelligence that drives growth.
          </p>
          <p className={BODY_COPY_CLASS}>
            From market assessments and competitive positioning to custom
            research and go-to-market strategies.
          </p>
          <Link
            href="/services"
            className="mt-8 inline-block font-light lowercase text-telco-red underline decoration-telco-red underline-offset-[0.2em] decoration-1 transition-colors sm:mt-10 text-3xl md:text-5xl cursor-pointer"
          >
            more
          </Link>
        </div>
      </div>
    </div>
  );
}
