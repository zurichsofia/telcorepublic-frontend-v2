"use client";

import { useActionState } from "react";

import { submitContactForm } from "@/app/contact/actions";
import { cn } from "@/lib/utils";

const inputClassDefault = cn(
  "w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm font-light text-white",
  "placeholder:text-white/35",
  "outline-none transition focus:border-telco-red/80 focus:ring-2 focus:ring-telco-red/35",
);

const inputClassMinimal = cn(
  "w-full border-0 border-b border-white/10 bg-transparent px-0 py-3 text-base font-light text-white",
  "placeholder:text-white/30",
  "outline-none transition focus:border-telco-red focus:ring-0",
);

const labelClassDefault =
  "mb-2 block text-xs font-normal uppercase tracking-wide text-white/55";

const labelClassMinimal =
  "mb-1 block text-xs font-normal uppercase tracking-widest text-white/40";

export type ContactFormProps = {
  className?: string;
  /** Inline fields (no outer card) — use inside a parent panel. */
  variant?: "default" | "minimal";
};

export function ContactForm({
  className,
  variant = "default",
}: ContactFormProps) {
  const [state, formAction, pending] = useActionState(submitContactForm, {});

  const inputClass = variant === "minimal" ? inputClassMinimal : inputClassDefault;
  const labelClass = variant === "minimal" ? labelClassMinimal : labelClassDefault;

  const successShell =
    variant === "minimal"
      ? "py-1"
      : "rounded-2xl border border-white/12 bg-telco-dark/80 p-8 backdrop-blur-md sm:p-10";

  if (state.ok) {
    return (
      <div className={cn(successShell, className)} role="status">
        <p className="font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">
          Thank you
        </p>
        <p className="mt-4 text-sm font-light leading-relaxed text-white/75">
          We will get back to you as soon as we can. For anything urgent, you can also
          write to us directly at{" "}
          <a
            href="mailto:info@telcorepublic.com"
            className="text-telco-red underline decoration-1 underline-offset-4 hover:text-white"
          >
            info@telcorepublic.com
          </a>
          .
        </p>
      </div>
    );
  }

  const formShell =
    variant === "minimal"
      ? ""
      : "rounded-2xl border border-white/12 bg-telco-dark/75 p-8 backdrop-blur-md sm:p-10";

  return (
    <form action={formAction} className={cn(formShell, className)} noValidate>
      <div className={variant === "minimal" ? "space-y-7" : "space-y-6"}>
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className={inputClass}
            disabled={pending}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={inputClass}
            disabled={pending}
          />
        </div>
        <div>
          <label htmlFor="contact-phone" className={labelClass}>
            Phone
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            required
            className={inputClass}
            disabled={pending}
          />
        </div>
        <div>
          <label htmlFor="contact-company" className={labelClass}>
            Company <span className="font-light normal-case text-white/35">(optional)</span>
          </label>
          <input
            id="contact-company"
            name="company"
            type="text"
            autoComplete="organization"
            className={inputClass}
            disabled={pending}
          />
        </div>
        <div>
          <label htmlFor="contact-message" className={labelClass}>
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            className={cn(inputClass, "min-h-36 resize-y")}
            disabled={pending}
          />
        </div>
      </div>

      {state.error ? (
        <p className="mt-6 text-sm text-telco-red" role="alert">
          {state.error}
        </p>
      ) : null}

      <div className={variant === "minimal" ? "mt-10" : "mt-8"}>
        <button
          type="submit"
          disabled={pending}
          className={cn(
            "inline-flex min-w-40 items-center justify-center transition disabled:cursor-not-allowed disabled:opacity-60",
            variant === "minimal"
              ? cn(
                  "rounded-full border border-white/20 bg-transparent px-10 py-2.5",
                  "text-xs font-normal uppercase tracking-widest text-white",
                  "hover:border-telco-red hover:bg-telco-red/10",
                )
              : cn(
                  "rounded-lg bg-telco-red px-8 py-3.5 text-sm font-normal tracking-wide text-white",
                  "hover:bg-telco-red/90",
                ),
          )}
        >
          {pending ? "Sending…" : variant === "minimal" ? "Send" : "Send message"}
        </button>
      </div>
    </form>
  );
}
