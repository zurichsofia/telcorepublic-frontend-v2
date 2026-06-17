import Link from "next/link";

import { BrandLogoSignal } from "@/components/common/brand-logo-signal";
import { cn } from "@/lib/utils";

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterProps = {
  navLinks?: readonly FooterLink[];
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

const defaultNavLinks: readonly FooterLink[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
];

const defaultLegal: readonly FooterLink[] = [
  { label: "Disclaimer", href: "#" },
  { label: "Privacy", href: "#" },
];

const defaultSocial: readonly FooterLink[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/telco-republic/" },
  { label: "Twitter", href: "https://x.com/kurth_martina" },
];

const footerTextClass = "text-lg font-light text-white";
const footerLinkClass = cn(
  footerTextClass,
  "transition-colors hover:text-white/80",
);

/** Dark site footer: brand lockup + signal dots, then nav / company / social+legal columns. */
export function Footer({
  navLinks = defaultNavLinks,
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
        "bg-telco-dark px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-10",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-7xl">
        <BrandLogoSignal
          href={logoHref}
          variant="onDark"
          className="inline-block"
        />

        <div className="mt-16 flex w-full flex-col gap-12 pt-12 md:flex-row md:items-end md:justify-between md:gap-x-10 lg:gap-x-16">
          <nav aria-label="Footer" className="shrink-0">
            <ul className="leading-normal">
              {navLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={footerLinkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div
            className={cn(
              footerTextClass,
              "shrink-0 leading-normal md:text-left",
            )}
          >
            <p className="font-light">{companyName}</p>
            <p>{locationLine}</p>
            <p>
              <Link href={emailHref} className={footerLinkClass}>
                {email}
              </Link>
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-10 md:items-end md:text-right">
            <div className="w-full text-left">
              <p className={cn(footerTextClass, "font-light")}>{socialHeading}</p>
              <ul className="leading-normal">
                {socialLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={cn(
                        footerLinkClass,
                        "underline decoration-1 underline-offset-4 hover:no-underline",
                      )}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={cn(footerTextClass, "w-full text-left")}>
              <p>© {copyrightHolder}</p>
              <p>
                {legalLinks.map((item, index) => (
                  <span key={item.label}>
                    {index > 0 ? (
                      <span className="px-1.5" aria-hidden>
                        •
                      </span>
                    ) : null}
                    <Link href={item.href} className={footerLinkClass}>
                      {item.label}
                    </Link>
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
