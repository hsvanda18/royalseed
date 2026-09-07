import type { Copy } from "../content";
import { useInk } from "../lib/hooks";

/**
 * A photograph slot. Pass `src` when the client's photography arrives and
 * the slot becomes the photograph — no layout, no surrounding design and no
 * copy changes. Until then it states plainly that it is empty, because a
 * generic field photograph here would be a lie about a place we have not
 * been shown.
 */
export function PhotoSlot({
  label,
  caption,
  ratio = "4 / 3",
  src,
  alt,
  className = "",
}: {
  label: string;
  caption: string;
  ratio?: string;
  src?: string;
  alt?: string;
  className?: string;
}) {
  if (src) {
    return (
      <figure className={`m-0 ${className}`}>
        <img
          src={src}
          alt={alt ?? caption}
          loading="lazy"
          decoding="async"
          className="block w-full border border-[var(--rule-strong)] object-cover"
          style={{ aspectRatio: ratio }}
        />
        <figcaption className="annot-sm mt-2.5 text-ink-faint">{caption}</figcaption>
      </figure>
    );
  }

  return (
    <figure className={`m-0 ${className}`}>
      <div
        className="relative grid place-items-center border border-dashed border-[var(--rule-strong)] bg-[repeating-linear-gradient(45deg,color-mix(in_srgb,var(--color-ink)_6%,transparent)_0_1px,transparent_1px_11px)]"
        style={{ aspectRatio: ratio }}
      >
        <span
          aria-hidden
          className="absolute left-2.5 top-2.5 h-3 w-3 border-l border-t border-ink-faint"
        />
        <span
          aria-hidden
          className="absolute bottom-2.5 right-2.5 h-3 w-3 border-b border-r border-ink-faint"
        />
        <p className="annot-sm max-w-[14rem] px-4 text-center text-ink-faint">{label}</p>
      </div>
      <figcaption className="annot-sm mt-2.5 text-ink-faint">{caption}</figcaption>
    </figure>
  );
}

export function Origin({ copy }: { copy: Copy }) {
  const { ref, inkAttr } = useInk<HTMLElement>();
  const o = copy.origin;

  return (
    <section
      id="origin"
      ref={ref}
      {...inkAttr}
      className="relative z-10 border-t border-[var(--rule-strong)] px-5 py-20 sm:px-8 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-[var(--sheet-max)]">
        <div className="grid gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
          <div>
            <h2
              className="figure-xl ink-in text-[clamp(2.2rem,4.6vw,3.4rem)] text-ink"
              style={{ "--d": "0ms" } as React.CSSProperties}
            >
              {o.title}
            </h2>
            <p
              className="prose-sheet ink-in mt-5"
              style={{ "--d": "90ms" } as React.CSSProperties}
            >
              {o.body}
            </p>

            <blockquote
              className="ink-in mt-9 border-l border-[var(--rule-strong)] pl-6"
              style={{ "--d": "180ms" } as React.CSSProperties}
            >
              <p className="max-w-[36rem] font-display text-[clamp(1.25rem,2.5vw,1.7rem)] italic leading-[1.42] text-ink">
                {o.quote}
              </p>
            </blockquote>
          </div>

          {/* The route, set out as a traverse: three stations, in order. */}
          <ol className="lg:pt-3">
            {o.stops.map((stop, i) => (
              <li
                key={stop.place}
                className="ink-in relative border-l border-[var(--rule-strong)] pb-8 pl-7 last:pb-0"
                style={{ "--d": `${240 + i * 100}ms` } as React.CSSProperties}
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-1.5 h-[9px] w-[9px] -translate-x-1/2 rotate-45 border border-ink bg-paper"
                />
                <p className="font-display text-[1.25rem] font-semibold leading-none text-ink">
                  {stop.place}
                </p>
                <p className="annot-sm mt-2 text-ink-soft">{stop.note}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Photography the client has said is coming. Marked, not filled. */}
        <div className="mt-16 lg:mt-20">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
            <PhotoSlot
              label={o.photoSlot}
              caption={o.stops[1].place}
              ratio="16 / 10"
              className="ink-in"
            />
            <PhotoSlot
              label={o.photoSlot}
              caption={o.stops[2].place}
              ratio="4 / 5"
              className="ink-in"
            />
            <PhotoSlot
              label={o.photoSlot}
              caption={o.stops[0].place}
              ratio="4 / 5"
              className="ink-in"
            />
          </div>
          <p className="annot-sm mt-5 max-w-[42rem] text-ink-faint">{o.photoSlotNote}</p>
        </div>
      </div>
    </section>
  );
}
