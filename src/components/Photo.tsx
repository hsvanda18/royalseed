/**
 * A supplied photograph, set on the sheet with a ruled edge and a lettered
 * caption. `sizeClass` sets the drawn box (an aspect ratio or a height) and
 * the image fills it with object-cover; the intrinsic size is still passed
 * so the browser reserves space before the file arrives.
 */
export function Photo({
  src,
  width,
  height,
  alt,
  caption,
  sizeClass = "h-auto w-full aspect-[4/3]",
  className = "",
  eager = false,
  sizes,
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  sizeClass?: string;
  className?: string;
  eager?: boolean;
  sizes?: string;
}) {
  return (
    <figure className={`m-0 ${className}`}>
      <img
        src={src}
        width={width}
        height={height}
        alt={alt}
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={`block border border-[var(--rule-strong)] bg-paper-deep object-cover ${sizeClass}`}
      />
      {caption && (
        <figcaption className="annot-sm mt-2.5 text-ink-faint">{caption}</figcaption>
      )}
    </figure>
  );
}
