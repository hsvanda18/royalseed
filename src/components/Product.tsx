import { PHOTOS, type Copy } from "../content";
import { useInk } from "../lib/hooks";
import { MarkCaliper, MarkContour, MarkEmitter, MarkMonument } from "./figures";
import { Photo } from "./Photo";

const VALUE_MARKS = [MarkContour, MarkEmitter, MarkCaliper, MarkMonument];

/**
 * The crop and the company's values in one screen. The photograph is shown
 * at its own proportions — never cropped or stretched — held to the screen's
 * height so it and the text read together.
 */
export function Product({ copy }: { copy: Copy }) {
  const { ref, inkAttr } = useInk<HTMLElement>();
  const p = copy.product;

  return (
    <section
      id="product"
      ref={ref}
      {...inkAttr}
      className="relative z-10 border-y border-[var(--rule-strong)] bg-paper-deep/55 px-5 py-12 sm:px-8 lg:py-14"
    >
      <div className="mx-auto grid max-w-[var(--sheet-max)] items-center gap-x-14 gap-y-12 lg:grid-cols-[auto_minmax(0,1fr)]">
        <Photo
          {...PHOTOS.product}
          alt={p.photo.alt}
          sizeClass="h-auto w-full"
          sizes="(min-width: 1024px) 22rem, 100vw"
          className="ink-in mx-auto w-full max-w-[22rem] lg:mx-0 lg:w-[calc(min(64svh,38rem)*0.5625)]"
        />

        <div>
          <h2
            className="figure-xl ink-in text-[clamp(2.4rem,5vw,3.6rem)] text-ink"
            style={{ "--d": "80ms" } as React.CSSProperties}
          >
            {p.title}
          </h2>

          <div
            className="ink-in mt-6 border-t-2 border-ink pt-4"
            style={{ "--d": "180ms" } as React.CSSProperties}
          >
            <h3 className="annot text-ink-faint">{p.why}</h3>
            <p className="callout mt-3 max-w-[44rem]">{p.whyBody}</p>
          </div>

          {/* Values — a legend key: symbol, entry, gloss. */}
          <div className="mt-8">
            <h3
              className="annot ink-in text-ink-faint"
              style={{ "--d": "280ms" } as React.CSSProperties}
            >
              {p.valuesTitle}
            </h3>
            <dl className="mt-3 grid gap-x-10 sm:grid-cols-2">
              {p.values.map((v, i) => {
                const Mark = VALUE_MARKS[i];
                return (
                  <div
                    key={v.name}
                    className="ink-in grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-4 border-t border-[var(--rule-strong)] py-3.5"
                    style={{ "--d": `${340 + i * 70}ms` } as React.CSSProperties}
                  >
                    <Mark className="row-span-2 mt-0.5 h-7 w-7 text-ink-soft" />
                    <dt className="font-display text-[1.2rem] font-semibold leading-tight text-ink">
                      {v.name}
                    </dt>
                    <dd className="mt-1 text-[0.9375rem] leading-relaxed text-ink-soft">{v.gloss}</dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
