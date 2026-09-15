import { PHOTOS, type Copy } from "../content";
import { useInk } from "../lib/hooks";
import { Photo } from "./Photo";

/**
 * One crop, one place. The photograph carries the variety at its own
 * proportions — never cropped or stretched — held to the screen's height so
 * it and the text read together.
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
          caption={p.photo.caption}
          sizeClass="h-auto w-full"
          sizes="(min-width: 1024px) 22rem, 100vw"
          className="ink-in mx-auto w-full max-w-[22rem] lg:mx-0 lg:w-[calc(min(64svh,38rem)*0.5625)]"
        />

        <div>
          <h2
            className="figure-xl ink-in text-[clamp(2.4rem,5.6vw,4rem)] text-ink"
            style={{ "--d": "80ms" } as React.CSSProperties}
          >
            {p.title}
          </h2>

          <div
            className="ink-in mt-9 border-t-2 border-ink pt-5"
            style={{ "--d": "180ms" } as React.CSSProperties}
          >
            <h3 className="annot text-ink-faint">{p.why}</h3>
            <p className="prose-sheet mt-4 max-w-[38rem]">{p.whyBody}</p>
          </div>

          <dl className="mt-10 grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {[
              { term: p.variety, desc: p.varietyNote, d: "300ms" },
              { term: p.place, desc: p.placeNote, d: "380ms" },
            ].map((item) => (
              <div
                key={item.term}
                className="ink-in border-t border-[var(--rule-strong)] pt-4"
                style={{ "--d": item.d } as React.CSSProperties}
              >
                <dt className="annot-sm text-ink-faint">{item.term}</dt>
                <dd className="mt-2.5 font-display text-[1.1875rem] leading-[1.45] text-ink">
                  {item.desc}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
