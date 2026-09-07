import type { Copy } from "../content";
import { useInk } from "../lib/hooks";
import { MarkCaliper, MarkContour, MarkEmitter, MarkMonument } from "./figures";

const VALUE_MARKS = [MarkContour, MarkEmitter, MarkCaliper, MarkMonument];

/**
 * Mission, vision and values get three deliberately unequal treatments. A
 * mission that shares a container with its own footnotes is not a mission;
 * a plan gives its principal note the width of the sheet and files the rest
 * in the margin.
 */
export function Charter({ copy }: { copy: Copy }) {
  const { ref, inkAttr } = useInk<HTMLElement>();
  const c = copy.charter;

  return (
    <section
      id="charter"
      ref={ref}
      {...inkAttr}
      className="relative z-10 px-5 py-20 sm:px-8 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-[var(--sheet-max)]">
        {/* Mission — the principal note, at the width of the sheet. */}
        <div className="grid gap-x-12 gap-y-4 lg:grid-cols-[minmax(0,10rem)_minmax(0,1fr)]">
          <h2
            className="annot ink-in pt-3 text-ink-faint"
            style={{ "--d": "0ms" } as React.CSSProperties}
          >
            {c.missionTitle}
          </h2>
          <p
            className="figure-xl ink-in max-w-[46rem] text-[clamp(1.6rem,3.4vw,2.6rem)] leading-[1.16] text-ink"
            style={{ "--d": "90ms", textWrap: "pretty" } as React.CSSProperties}
          >
            {c.mission}
          </p>
        </div>

        {/* Vision — filed in the margin, at margin scale. */}
        <div className="mt-16 flex justify-end lg:mt-20">
          <div
            className="ink-in max-w-[30rem] border-t-2 border-ink pt-5"
            style={{ "--d": "220ms" } as React.CSSProperties}
          >
            <h2 className="annot text-ink-faint">{c.visionTitle}</h2>
            <p className="mt-4 font-display text-[1.3rem] leading-[1.45] text-ink">
              {c.vision}
            </p>
          </div>
        </div>

        {/* Values — a legend key: symbol, entry, gloss. */}
        <div className="mt-16 border-t border-[var(--rule-strong)] pt-8 lg:mt-24">
          <h2
            className="annot ink-in text-ink-faint"
            style={{ "--d": "0ms" } as React.CSSProperties}
          >
            {c.valuesTitle}
          </h2>

          {/* A ruled legend schedule, not four equal icon columns: on a plan
              a key is read down, symbol against entry against definition. */}
          <dl className="mt-7">
            {c.values.map((v, i) => {
              const Mark = VALUE_MARKS[i];
              return (
                <div
                  key={v.name}
                  className="ink-in grid grid-cols-[2rem_minmax(0,1fr)] items-baseline gap-x-5 gap-y-1 border-b border-[var(--rule)] py-5 last:border-b-0 sm:grid-cols-[2rem_minmax(0,14rem)_minmax(0,1fr)] sm:gap-x-8"
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
