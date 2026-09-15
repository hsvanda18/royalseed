import { PHOTOS, type Copy } from "../content";
import { useInk } from "../lib/hooks";
import { Photo } from "./Photo";

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
              className="ink-in mt-9 border-s border-[var(--rule-strong)] ps-6"
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
                className="ink-in relative border-s border-[var(--rule-strong)] pb-8 ps-7 last:pb-0"
                style={{ "--d": `${240 + i * 100}ms` } as React.CSSProperties}
              >
                <span
                  aria-hidden
                  className="absolute start-0 top-1.5 h-[9px] w-[9px] -translate-x-1/2 rotate-45 border border-ink bg-paper rtl:translate-x-1/2"
                />
                <p className="font-display text-[1.25rem] font-semibold leading-none text-ink">
                  {stop.place}
                </p>
                <p className="annot-sm mt-2 text-ink-soft">{stop.note}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* The study trip, in the client's own photographs. */}
        <div className="mt-16 border-t border-[var(--rule-strong)] pt-8 lg:mt-20">
          <h3 className="annot ink-in text-ink-faint">{o.galleryTitle}</h3>
          <div className="mt-6 grid gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {PHOTOS.origin.map((photo, i) => (
              <Photo
                key={photo.src}
                {...photo}
                alt={o.gallery[i].alt}
                caption={o.gallery[i].caption}
                ratioClass="aspect-[4/3]"
                sizes="(min-width: 1024px) 29rem, (min-width: 640px) 50vw, 100vw"
                className="ink-in"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
