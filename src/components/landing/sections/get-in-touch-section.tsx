import Link from "next/link";

export function GetInTouchSection() {
  return (
    <section
      id="get-in-touch"
      className="w-full bg-white px-6 py-24 sm:px-10 sm:py-32 lg:px-16 xl:px-20"
      aria-labelledby="get-in-touch-heading"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 text-center text-pretty sm:gap-12">
        <p className="text-sm md:text-lg uppercase tracking-widest text-telco-dark">
          Get in touch
        </p>

        <h2
          id="get-in-touch-heading"
          className="text-4xl leading-tight text-telco-red sm:text-5xl lg:text-6xl"
        >
          Let&apos;s talk about your
          <br />
          next research brief
        </h2>

        <p className="text-lg leading-tight tracking-wide text-telco-dark sm:text-lg lg:text-2xl">
          Subscriptions, custom OSS and BSS coverage, or a one-off question
          <br className="hidden sm:inline" /> leave a message and we will
          respond shortly.
        </p>

        <Link
          href="/contact"
          className="text-3xl text-telco-red underline underline-offset-[0.3em] hover:opacity-80 sm:text-4xl lg:text-5xl"
        >
          direct message
        </Link>
      </div>
    </section>
  );
}
