import { useLayoutEffect } from "react";
import { useFormValue, type StringInputProps } from "sanity";

const LIVE_URL =
  process.env.NEXT_PUBLIC_LIVE_SITE_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXT_PUBLIC_VERCEL_URL;

function normalizeBaseUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return `https://${trimmed}`;
}

function getLivePreviewHref(slug: string) {
  const base = LIVE_URL ? normalizeBaseUrl(LIVE_URL) : "";
  if (!base || !slug) return "";
  return `${base.replace(/\/$/, "")}/news/${slug}`;
}

const linkStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "4px 8px",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: "0.01em",
  textDecoration: "none",
  whiteSpace: "nowrap",
  color: "rgba(17, 24, 39, 0.92)",
  background: "transparent",
  border: "1px solid rgba(17, 24, 39, 0.14)",
};

const linkDisabledStyle: React.CSSProperties = {
  ...linkStyle,
  color: "rgba(17, 24, 39, 0.38)",
  borderColor: "rgba(17, 24, 39, 0.10)",
  cursor: "not-allowed",
};

function LivePreviewLink({ href, disabled }: { href: string; disabled: boolean; }) {
  const title = !LIVE_URL
    ? "Set NEXT_PUBLIC_LIVE_SITE_URL to enable live previews"
    : "Add a slug to enable live previews";

  const content = <>Live article →</>;

  if (disabled) {
    return (
      <span title={title} style={linkDisabledStyle}>
        {content}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      title="Open published article"
      style={linkStyle}
    >
      {content}
    </a>
  );
}

export function TitleWithLivePreviewInput(props: StringInputProps) {
  const slugValue = useFormValue(["slug", "current"]);
  const slug = typeof slugValue === "string" ? slugValue : "";
  const href = getLivePreviewHref(slug);

  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>('[id^="documentEditor-newsArticle-"]');
    const scroller = root?.querySelector<HTMLElement>('[class*="Scroller-sc-"]');
    if (!scroller) return;

    const prev = scroller.style.paddingBlockEnd;
    scroller.style.paddingBlockEnd = "4rem";
    return () => {
      scroller.style.paddingBlockEnd = prev;
    };
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          right: 0,
          top: -80,
          zIndex: 1,
        }}
      >
        <LivePreviewLink href={href} disabled={!href} />
      </div>
      {props.renderDefault(props)}
    </div>
  );
}
