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

const bodyClass = "mt-2 max-w-2xl text-lg leading-relaxed text-white sm:text-xl";
const beatTitleClass =
  "mt-2 font-display text-5xl leading-tight tracking-tight text-white";

export function HeroHeadline() {
  const { headline, subheadline } = snowMountainHeroText.primary;

  return (
    <h1 className="mt-2 font-display text-7xl leading-[1.05] tracking-tight text-white">
      {headline}
      <span className="mt-1 block sm:mt-1.5">{subheadline}</span>
    </h1>
  );
}

export function HeroBeatText({ title, body }: { title: string; body: string }) {
  return (
    <>
      <p className={beatTitleClass}>{title}</p>
      <p className={bodyClass}>{body}</p>
    </>
  );
}
