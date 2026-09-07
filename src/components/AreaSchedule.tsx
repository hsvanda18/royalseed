import { useState } from "react";
import type { Copy } from "../content";
import { useInk } from "../lib/hooks";

/**
 * The schedule of areas, drawn as a plan's title block enlarged to the full
 * sheet. The ground goes to survey green so the figures can be set in gold
 * and still clear contrast — gold on paper never carries text here.
 */
export function AreaSchedule({ copy }: { copy: Copy }) {
  const { ref, inkAttr } = useInk<HTMLElement>();
  const [revealed, setRevealed] = useState(false);
  const s = copy.schedule;

  return (
    <section
      ref={ref}
      {...inkAttr}
      className="on-plate relative z-10 bg-plate text-paper"
    >
      <div className="mx-auto max-w-[var(--sheet-max)] px-5 py-20 sm:px-8 sm:py-24 lg:py-28">
        <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
          <div>
            <h2
              className="figure-xl ink-in text-[clamp(2rem,3.6vw,2.75rem)] text-paper"
              style={{ "--d": "0ms" } as React.CSSProperties}
            >
              {s.title}
            </h2>
            <p
              className="ink-in mt-5 max-w-[26rem] text-[1.0625rem] leading-relaxed text-[color-mix(in_srgb,var(--color-paper)_72%,var(--color-plate))]"
              style={{ "--d": "120ms" } as React.CSSProperties}
            >
              {s.intro}
            </p>
          </div>

          <div>
            <dl className="border-t border-[color-mix(in_srgb,var(--color-paper)_26%,transparent)]">
              {s.rows.map((row, i) => (
                <div
                  key={row.label}
                  className="ink-in grid grid-cols-1 items-baseline gap-x-8 gap-y-1 border-b border-[color-mix(in_srgb,var(--color-paper)_18%,transparent)] py-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:py-7"
                  style={{ "--d": `${160 + i * 90}ms` } as React.CSSProperties}
                >
                  <div className="order-2 sm:order-1">
                    <dt className="annot text-paper">{row.label}</dt>
                    <dd className="annot-sm mt-1.5 text-[color-mix(in_srgb,var(--color-paper)_58%,var(--color-plate))]">
                      {row.note}
                    </dd>
                  </div>
                  <dd className="order-1 flex items-baseline gap-3 sm:order-2 sm:justify-end">
                    <span className="figure-xl text-[clamp(3rem,8.5vw,5.25rem)] text-gold-bright">
                      {row.value}
                    </span>
                    <span className="annot-sm text-[color-mix(in_srgb,var(--color-paper)_62%,var(--color-plate))]">
                      {row.unit}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
              {/* Derived figures: arithmetic on the stated numbers, labelled
                  as arithmetic. */}
              <div
                className="ink-in"
                style={{ "--d": "540ms" } as React.CSSProperties}
              >
                <h3 className="annot-sm text-[color-mix(in_srgb,var(--color-paper)_62%,var(--color-plate))]">
                  {s.derivedTitle}
                </h3>
                <ul className="mt-4 space-y-3">
                  {s.derived.map((d) => (
                    <li
                      key={d.label}
                      className="flex flex-wrap items-baseline gap-x-3 gap-y-1"
                    >
                      <span className="font-display text-[1.5rem] font-semibold tabular-nums text-paper">
                        {d.value}
                      </span>
                      <span className="text-[0.9375rem] text-[color-mix(in_srgb,var(--color-paper)_72%,var(--color-plate))]">
                        {d.label}
                      </span>
                      <span className="annot-sm text-[color-mix(in_srgb,var(--color-paper)_60%,var(--color-plate))]">
                        {d.note}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* The one estimate the company owns waits behind its own
                  qualifier rather than shouting as fact. */}
              <div
                className="ink-in border border-[color-mix(in_srgb,var(--color-gold-bright)_55%,transparent)] p-5"
                style={{ "--d": "620ms" } as React.CSSProperties}
              >
                <p className="annot-sm text-gold-bright">{s.estimateFlag}</p>

                {revealed ? (
                  <div>
                    <p className="figure-xl mt-3 text-[clamp(2.5rem,6vw,3.5rem)] text-gold-bright">
                      {copy.hero.phases[3].value}
                      <span className="ml-2 font-sans text-[0.875rem] font-semibold uppercase tracking-[0.18em] text-[color-mix(in_srgb,var(--color-paper)_62%,var(--color-plate))]">
                        {copy.hero.phases[3].unit}
                      </span>
                    </p>
                    <p className="mt-4 text-[0.9375rem] leading-relaxed text-[color-mix(in_srgb,var(--color-paper)_72%,var(--color-plate))]">
                      {s.estimateBody}
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setRevealed(true)}
                    className="mt-4 inline-flex items-center gap-2.5 border-b border-gold-bright pb-1 text-left font-display text-[1.125rem] font-semibold text-paper transition-colors duration-300 hover:text-gold-bright"
                  >
                    {s.estimateReveal}
                    <span aria-hidden className="text-gold-bright">
                      ↓
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
