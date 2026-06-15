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


const beatTitleClass =
  "md:mt-2 font-display text-xl leading-tight text-white md:text-5xl";
const bodyClass =
  "mt-2 max-w-[80vw] md:max-w-2xl text-xl leading-tight md:leading-relaxed text-white md:text-xl max-sm:text-justify";
export function HeroHeadline() {
  const { headline, subheadline } = snowMountainHeroText.primary;

  return (
    <h1 className="mt-2 tracking-tight md:tracking-tight text-white font-display text-[32px] md:text-7xl max-w-xs md:max-w-5xl">
      {headline}
      <span className="block sm:mt-1.5">{subheadline}</span>
    </h1>
  );
}

export function HeroBeatText({ title, body }: { title: string; body: string; }) {
  return (
    <>
      <p className={beatTitleClass}>{title}</p>
      <p className={bodyClass}>{body}</p>
    </>
  );
}
