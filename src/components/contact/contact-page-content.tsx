"use client";

import Link from "next/link";

import { ContactForm } from "@/components/contact/contact-form";
import { FloatingLinesContactBackground } from "@/components/common/floating-lines/floating-lines-contact-background";

export function ContactPageContent() {
  return (
    <div className="bg-telco-dark text-white">
      <FloatingLinesContactBackground>
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-44">
          <p className="text-xs font-normal uppercase tracking-widest text-white/40">
            Get in touch
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-light leading-tight tracking-tight text-white sm:text-5xl">
            Let&apos;s talk about your next research brief.
          </h1>
          <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-white/60">
            Subscriptions, custom OSS and BSS coverage, or a one-off question - leave a
            message and we will respond shortly.
          </p>

          <div className="mt-12 lg:mt-16">
            <div className="rounded-3xl border border-white/10 bg-[#211b1b]/75 p-8 shadow-inner sm:p-10 lg:flex lg:gap-14 lg:p-12">
              <aside className="mb-10 flex flex-col gap-8 border-b border-white/10 pb-10 lg:mb-0 lg:min-w-0 lg:flex-1 lg:border-b-0 lg:border-r lg:border-white/10 lg:pb-0 lg:pr-10">
                <div>
                  <p className="text-xs font-normal uppercase tracking-widest text-white/40">
                    Email
                  </p>
                  <Link
                    href="mailto:info@telcorepublic.com"
                    className="mt-2 inline-block text-sm font-light text-white/90 underline decoration-white/20 underline-offset-4 transition hover:decoration-telco-red hover:text-white"
                  >
                    info@telcorepublic.com
                  </Link>
                </div>

                <div>
                  <p className="text-xs font-normal uppercase tracking-widest text-white/40">
                    LinkedIn
                  </p>
                  <Link
                    href="https://www.linkedin.com/company/telco-republic/"
                    className="mt-2 inline-block text-sm font-light text-white/90 underline decoration-white/20 underline-offset-4 transition hover:decoration-telco-red hover:text-white"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Telco Republic
                  </Link>
                </div>
                <div>
                  <p className="text-xs font-normal uppercase tracking-widest text-white/40">
                    Address
                  </p>
                  <p className="mt-2 text-sm font-light text-white/70">Telco Republic AG, Zurich, Switzerland
                  </p>
                </div>
              </aside>

              <div className="w-full lg:max-w-md lg:shrink-0">
                <ContactForm
                  className="border-0 bg-transparent p-0 shadow-none backdrop-blur-none"
                  variant="minimal"
                />
              </div>
            </div>
          </div>
        </div>
      </FloatingLinesContactBackground>
    </div>
  );
}
