import Link from "next/link";

export function GetInTouchSection() {
  return (
    <section
      id="get-in-touch"
      className="relative isolate w-full bg-white px-6 py-24 sm:px-10 sm:py-28 md:py-32 lg:px-16 lg:py-36 xl:px-20"
      aria-labelledby="get-in-touch-heading"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <p className="text-xs font-normal uppercase tracking-widest text-black">
          Get in touch
        </p>

        <h2
          id="get-in-touch-heading"
          className="mt-8 text-pretty font-sans text-4xl font-normal leading-tight text-telco-red sm:mt-10 sm:text-5xl lg:text-6xl"
        >
          Let&apos;s talk about your
          <br />
          next research brief
        </h2>

        <p className="mt-10 max-w-3xl text-pretty font-sans text-base leading-tight tracking-wide text-black sm:mt-12 sm:text-lg lg:text-xl">
          Subscriptions, custom OSS and BSS coverage, or a one-off question
          <br className="hidden sm:inline" />
          {" "}
          leave a message and we will respond shortly.
        </p>

        <Link
          href="/contact"
          className="mt-12 text-pretty font-sans text-3xl font-normal text-telco-red underline decoration-telco-red underline-offset-[0.3em] transition hover:opacity-80 sm:mt-14 sm:text-4xl lg:text-5xl"
        >
          direct message
        </Link>
      </div>
    </section>
  );
}
