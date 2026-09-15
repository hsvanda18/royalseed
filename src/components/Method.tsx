import { PHOTOS, type Copy } from "../content";
import { useInk } from "../lib/hooks";
import { Photo } from "./Photo";

/** Sum of width ÷ height across the row: the row's width at a height of 1. */
const ROW_RATIO = PHOTOS.method.reduce((sum, p) => sum + p.width / p.height, 0);

/**
 * The six points as plain text columns, with the photographs directly under
 * them, so the model and the ground it runs on share one screen.
 */
export function Method({ copy }: { copy: Copy }) {
  const { ref, inkAttr } = useInk<HTMLElement>();
  const m = copy.method;

  return (
    <section
      id="method"
      ref={ref}
      {...inkAttr}
      className="relative z-10 px-5 py-12 sm:px-8 lg:py-14"
    >
      <div className="mx-auto max-w-[var(--sheet-max)]">
        <div className="grid gap-x-14 gap-y-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:items-end">
          <h2
            className="figure-xl ink-in text-[clamp(2.2rem,4vw,3.2rem)] text-ink"
            style={{ "--d": "0ms" } as React.CSSProperties}
          >
            {m.title}
          </h2>
          <p
            className="ink-in border-s-2 border-ink ps-4 font-display text-[clamp(1.05rem,1.6vw,1.25rem)] leading-[1.4] text-ink"
            style={{ "--d": "100ms" } as React.CSSProperties}
          >
            {m.closing}
          </p>
        </div>

        <ol className="mt-8 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-6">
          {m.pillars.map((pillar, i) => (
            <li
              key={pillar.key}
              className="ink-in"
              style={{ "--d": `${140 + i * 70}ms` } as React.CSSProperties}
            >
              <h3 className="font-display text-[1.1rem] font-semibold leading-[1.3] text-ink">
                {pillar.title}
              </h3>
              <p className="mt-1.5 text-[0.9rem] leading-relaxed text-ink-soft">{pillar.body}</p>
            </li>
          ))}
        </ol>

        {/* The photographs are shown whole — never cropped. From lg they share
            one height: as tall as the sheet width allows, held back on short
            screens so the row stays in view, but never below 20rem — being
            seen matters more than fitting. Each frame is then as wide as its
            own ratio makes it. */}
        <div
          className="mt-8 grid grid-cols-2 items-start gap-3 lg:flex lg:justify-center"
          style={
            {
              "--row-h": `min(calc((min(var(--sheet-max), 100vw - 5rem) - 1.5rem) / ${ROW_RATIO.toFixed(4)}), max(20rem, calc(100svh - 32rem)))`,
            } as React.CSSProperties
          }
        >
          {PHOTOS.method.map((photo, i) => (
            <Photo
              key={photo.src}
              {...photo}
              alt={m.photos[i].alt}
              caption={m.photos[i].caption}
              sizeClass="h-auto w-full"
              sizes="(min-width: 1024px) 40vw, 50vw"
              className={`ink-in lg:w-[calc(var(--row-h)*var(--ratio))] lg:shrink-0 ${i === 2 ? "col-span-2" : ""}`}
              style={{ "--ratio": photo.width / photo.height } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
