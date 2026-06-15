import { cn } from "@/lib/utils";

export const snowMountainHeroText = {
  primary: {
    headline: "Navigating the shift.",
    subheadline: "Leading the Techco Revolution.",
  },
  telco: {
    title: "Crossing the Telco Chasm",
    body: "We are the go-to, thought-provoking market research and advisory firm in the new telecommunications software market.",
  },
  mission: {
    title: "Our Mission",
    body: "We track ongoing disruption and innovation related to telecommunications business and operations.",
  },
} as const;

const heroCopy = "font-display leading-tight text-white";

const headlineClass = cn(
  heroCopy,
  "mt-2 max-w-xs text-[32px] tracking-tight md:max-w-5xl md:text-7xl",
);
const beatTitleClass = cn(heroCopy, "text-xl md:mt-2 md:text-5xl");
const beatBodyClass = cn(heroCopy, "text-xl max-sm:text-justify md:text-2xl max-sm:max-w-xs");

export function HeroHeadline() {
  const { headline, subheadline } = snowMountainHeroText.primary;

  return (
    <h1 className={headlineClass}>
      {headline}
      <span className="block sm:mt-1.5">{subheadline}</span>
    </h1>
  );
}

export function HeroBeatText({ title, body }: { title: string; body: string; }) {
  return (
    <div className="mb-12">
      <p className={beatTitleClass}>{title}</p>
      <p className={beatBodyClass}>{body}</p>
    </div>
  );
}
