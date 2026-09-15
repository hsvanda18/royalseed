import { useEffect, useRef, useState } from "react";
import type { Copy } from "../content";
import { GALLERY, type GalleryPhoto } from "../gallery-data";

type Folder = keyof typeof GALLERY;
const FOLDERS: Folder[] = ["angola", "kenya"];

/**
 * The client's photographs, filed in two folders and kept in file order.
 * One row per folder so the section still reads in a single screen; a
 * photograph opens full size in a dialog.
 */
export function Gallery({ copy }: { copy: Copy }) {
  const o = copy.origin;
  const [folder, setFolder] = useState<Folder>("angola");
  const [open, setOpen] = useState<number | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const photos = GALLERY[folder];
  const rtl = copy.dir === "rtl";

  const altFor = (i: number) =>
    o.photoAlt
      .replace("{folder}", o.folders[folder])
      .replace("{n}", String(i + 1))
      .replace("{total}", String(photos.length));

  const scroll = (step: 1 | -1) => {
    const strip = stripRef.current;
    if (!strip) return;
    strip.scrollBy({ left: step * (rtl ? -1 : 1) * strip.clientWidth * 0.8, behavior: "smooth" });
  };

  // A folder switch starts its row from the first photograph.
  useEffect(() => {
    stripRef.current?.scrollTo({ left: 0 });
  }, [folder]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div role="tablist" aria-label={o.galleryTitle} className="flex border border-[var(--rule-strong)]">
          {FOLDERS.map((key) => {
            const on = key === folder;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls="gallery-strip"
                onClick={() => setFolder(key)}
                className={[
                  "annot flex items-baseline gap-2 px-4 py-2.5 transition-colors duration-300",
                  on ? "bg-ink text-paper" : "text-ink-soft hover:text-ink",
                ].join(" ")}
              >
                {o.folders[key]}
                <span className={on ? "text-gold-bright" : "text-ink-faint"}>{GALLERY[key].length}</span>
              </button>
            );
          })}
        </div>

        <div className="flex gap-2">
          <StepButton label={o.prev} onClick={() => scroll(-1)} glyph={rtl ? "→" : "←"} />
          <StepButton label={o.next} onClick={() => scroll(1)} glyph={rtl ? "←" : "→"} />
        </div>
      </div>

      <div
        id="gallery-strip"
        ref={stripRef}
        role="tabpanel"
        aria-label={o.folders[folder]}
        className="gallery-strip mt-4 flex h-[clamp(13rem,46svh,26rem)] snap-x snap-mandatory gap-3 overflow-x-auto pb-3"
      >
        {photos.map((photo, i) => (
          <button
            key={photo.thumb}
            type="button"
            onClick={() => setOpen(i)}
            className="group relative h-full shrink-0 snap-start overflow-hidden border border-[var(--rule-strong)] bg-paper-deep"
            style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
          >
            <img
              src={photo.thumb}
              alt={altFor(i)}
              width={photo.width}
              height={photo.height}
              loading={i < 4 ? "eager" : "lazy"}
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>

      {open !== null && (
        <Lightbox
          photos={photos}
          index={open}
          setIndex={setOpen}
          altFor={altFor}
          copy={copy}
        />
      )}
    </div>
  );
}

function StepButton({ label, onClick, glyph }: { label: string; onClick: () => void; glyph: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-10 w-10 place-items-center border border-[var(--rule-strong)] text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper"
    >
      <span aria-hidden>{glyph}</span>
    </button>
  );
}

function Lightbox({
  photos,
  index,
  setIndex,
  altFor,
  copy,
}: {
  photos: GalleryPhoto[];
  index: number;
  setIndex: (i: number | null) => void;
  altFor: (i: number) => string;
  copy: Copy;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const o = copy.origin;
  const rtl = copy.dir === "rtl";
  const photo = photos[index];
  const go = (step: number) => setIndex((index + step + photos.length) % photos.length);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      onClose={() => setIndex(null)}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(rtl ? -1 : 1);
        if (e.key === "ArrowLeft") go(rtl ? 1 : -1);
      }}
      aria-label={altFor(index)}
      className="lightbox m-auto max-h-none max-w-none bg-transparent p-0 text-paper backdrop:bg-plate/92"
    >
      <figure className="m-0 flex flex-col items-center gap-3 px-3">
        <img
          src={photo.full}
          alt={altFor(index)}
          width={photo.width}
          height={photo.height}
          className="block h-auto max-h-[82svh] w-auto max-w-[94vw] border border-[color-mix(in_srgb,var(--color-paper)_25%,transparent)] bg-plate"
        />
        <figcaption className="flex w-full max-w-[94vw] items-center justify-between gap-3">
          <span className="annot-sm text-[color-mix(in_srgb,var(--color-paper)_75%,transparent)]">
            {index + 1} / {photos.length}
          </span>
          <span className="flex gap-2">
            <LightboxButton label={o.prev} onClick={() => go(-1)} glyph={rtl ? "→" : "←"} />
            <LightboxButton label={o.next} onClick={() => go(1)} glyph={rtl ? "←" : "→"} />
            <LightboxButton label={o.close} onClick={() => ref.current?.close()} glyph="×" autoFocus />
          </span>
        </figcaption>
      </figure>
    </dialog>
  );
}

function LightboxButton({
  label,
  onClick,
  glyph,
  autoFocus,
}: {
  label: string;
  onClick: () => void;
  glyph: string;
  autoFocus?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      autoFocus={autoFocus}
      className="grid h-11 w-11 place-items-center border border-[color-mix(in_srgb,var(--color-paper)_40%,transparent)] text-[1.1rem] text-paper transition-colors duration-300 hover:bg-paper hover:text-plate"
    >
      <span aria-hidden>{glyph}</span>
    </button>
  );
}
