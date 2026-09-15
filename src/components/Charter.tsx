import { PHOTOS, type Copy } from "../content";
import { useInk } from "../lib/hooks";
import { MarkCaliper, MarkContour, MarkEmitter, MarkMonument } from "./figures";
import { Photo } from "./Photo";

const VALUE_MARKS = [MarkContour, MarkEmitter, MarkCaliper, MarkMonument];

/**
 * Mission and vision sit beside the photograph so the statement and the
 * ground it is about read in one screen. The values follow as a legend key.
 */
export function Charter({ copy }: { copy: Copy }) {
  const { ref, inkAttr } = useInk<HTMLElement>();
  const c = copy.charter;

  return (
    <section
      id="charter"
      ref={ref}
      {...inkAttr}
      className="relative z-10 px-5 py-12 sm:px-8 lg:py-14"
    >
      <div className="mx-auto max-w-[var(--sheet-max)]">
        <div className="grid items-center gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div>
            <h2
              className="annot ink-in text-ink-faint"
              style={{ "--d": "0ms" } as React.CSSProperties}
            >
              {c.missionTitle}
            </h2>
            <p
              className="figure-xl ink-in mt-4 text-[clamp(1.6rem,3vw,2.5rem)] leading-[1.16] text-ink"
              style={{ "--d": "90ms", textWrap: "pretty" } as React.CSSProperties}
            >
              {c.mission}
            </p>

            <div
              className="ink-in mt-8 border-t-2 border-ink pt-4"
              style={{ "--d": "180ms" } as React.CSSProperties}
            >
              <h2 className="annot text-ink-faint">{c.visionTitle}</h2>
              <p className="mt-3 font-display text-[1.2rem] leading-[1.45] text-ink">{c.vision}</p>
            </div>
          </div>

          {/* The sky is the least informative part of the frame: it is what
              gives way when the screen is short. */}
          <Photo
            {...PHOTOS.mission}
            alt={c.photo.alt}
            caption={c.photo.caption}
            sizeClass="h-auto w-full aspect-[16/10] object-[center_92%] lg:aspect-auto lg:h-[min(48svh,26rem)]"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="ink-in"
          />
        </div>

        {/* Values — a legend key: symbol, entry, gloss. */}
        <div className="mt-12 border-t border-[var(--rule-strong)] pt-6">
          <h2
            className="annot ink-in text-ink-faint"
            style={{ "--d": "0ms" } as React.CSSProperties}
          >
            {c.valuesTitle}
          </h2>

          {/* A ruled legend schedule, not four equal icon columns: on a plan
              a key is read down, symbol against entry against definition. */}
          <dl className="mt-4">
            {c.values.map((v, i) => {
              const Mark = VALUE_MARKS[i];
              return (
                <div
                  key={v.name}
                  className="ink-in grid grid-cols-[2rem_minmax(0,1fr)] items-baseline gap-x-5 gap-y-1 border-b border-[var(--rule)] py-3.5 last:border-b-0 sm:grid-cols-[2rem_minmax(0,14rem)_minmax(0,1fr)] sm:gap-x-8"
                  style={{ "--d": `${120 + i * 80}ms` } as React.CSSProperties}
                >
                  <Mark className="h-7 w-7 translate-y-1 text-ink-soft" />
                  <dt className="font-display text-[1.3rem] font-semibold leading-none text-ink">
                    {v.name}
                  </dt>
                  <dd className="col-start-2 text-[0.9375rem] leading-relaxed text-ink-soft sm:col-start-3">
                    {v.gloss}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
