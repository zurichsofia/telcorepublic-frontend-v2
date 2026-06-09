import Image from "next/image";

export type ServiceDetailDiagramProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export function ServiceDetailDiagram({
  src,
  alt,
  width,
  height,
}: ServiceDetailDiagramProps) {
  return (
    <figure className="mx-auto w-full max-w-5xl px-5 sm:px-8">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="mx-auto h-auto w-full"
        sizes="(max-width: 768px) 100vw, 896px"
      />
    </figure>
  );
}
