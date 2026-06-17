const YOUTUBE_VIDEO_ID = "uSTGjYyT70s";

const embedSrc = `https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}`;

export function YoutubeVideoSection() {
  return (
    <section
      id="featured-video"
      className="w-full bg-white px-6 py-20 sm:px-10 lg:px-16 lg:py-28 xl:px-20"
      aria-label="Featured video"
    >
      <div className="mx-auto max-w-5xl">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-telco-dark shadow-lg">
          <iframe
            className="absolute inset-0 h-full w-full"
            src={embedSrc}
            title="Telco Republic featured video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
