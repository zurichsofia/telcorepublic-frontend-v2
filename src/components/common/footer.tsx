import Link from "next/link";

import { BrandLogoSignal } from "@/components/brand-logo-signal";
import { cn } from "@/lib/utils";

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterProps = {
  companyName?: string;
  locationLine?: string;
  email?: string;
  emailHref?: string;
  copyrightHolder?: string;
  legalLinks?: readonly FooterLink[];
  socialHeading?: string;
  socialLinks?: readonly FooterLink[];
  logoHref?: string;
  className?: string;
};

const defaultLegal: readonly FooterLink[] = [
  { label: "Disclaimer", href: "#" },
  { label: "Privacy", href: "#" },
];

const defaultSocial: readonly FooterLink[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/telco-republic/" },
  { label: "Twitter", href: "https://x.com/kurth_martina" },
];

/** Dark site footer: brand lockup + signal dots, then company / legal / social columns. */
export function Footer({
  companyName = "Telco Republic AG",
  locationLine = "Zurich • Switzerland",
  email = "info@telcorepublic.com",
  emailHref = "mailto:info@telcorepublic.com",
  copyrightHolder = "Telco Republic AG",
  legalLinks = defaultLegal,
  socialHeading = "Follow us",
  socialLinks = defaultSocial,
  logoHref = "/",
  className,
}: FooterProps) {
  return (
    <footer
      className={cn(
        "bg-telco-dark px-5 py-16 text-white sm:px-8 sm:py-20",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-md">
          <BrandLogoSignal
            href={logoHref}
            variant="onDark"
            className="inline-block"
          />
        </div>

        <div className="mt-16 grid gap-12 pt-12 md:grid-cols-3 md:items-end md:gap-8">
          <div className="space-y-3 text-sm font-light leading-relaxed text-white">
            <p className="font-normal">{companyName}</p>
            <p>{locationLine}</p>
            <p>
              <Link href={emailHref} className="hover:underline">
                {email}
              </Link>
            </p>
          </div>

          <div className="space-y-3 text-center text-sm font-light text-white md:justify-self-center">
            <p>© {copyrightHolder}</p>
            <p>
              {legalLinks.map((item, index) => (
                <span key={item.label}>
                  {index > 0 ? (
                    <span className="px-2 text-white/50" aria-hidden>
                      ·
                    </span>
                  ) : null}
                  <Link href={item.href} className="hover:underline">
                    {item.label}
                  </Link>
                </span>
              ))}
            </p>
          </div>

          <div className="md:justify-self-end md:text-right">
            <p className="text-sm font-normal text-white">{socialHeading}</p>
            <ul className="mt-3 space-y-2 text-sm font-light">
              {socialLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-white underline decoration-1 underline-offset-4 hover:no-underline"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
