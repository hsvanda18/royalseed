import type { Copy } from "../content";
import { useInk } from "../lib/hooks";
import {
  MarkCrown,
  MarkFertigation,
  MarkInstrument,
  MarkSeedling,
  MarkSoil,
  MarkStamp,
} from "./figures";

const PILLAR_MARKS = [
  MarkFertigation,
  MarkSeedling,
  MarkCrown,
  MarkInstrument,
  MarkSoil,
  MarkStamp,
];

/**
 * The six points, set out as a survey traverse: one continuous line with a
 * station on it for each. The line is the sequence — the production model
 * runs in this order — so no numbered labels are needed to say so.
 */
export function Method({ copy }: { copy: Copy }) {
  const { ref, inkAttr } = useInk<HTMLElement>();
  const m = copy.method;

  return (
    <section
      id="method"
      ref={ref}
      {...inkAttr}
      className="relative z-10 px-5 py-20 sm:px-8 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-[var(--sheet-max)]">
        <div className="grid gap-x-14 gap-y-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end">
          <h2
            className="figure-xl ink-in text-[clamp(2.2rem,4.6vw,3.4rem)] text-ink"
            style={{ "--d": "0ms" } as React.CSSProperties}
          >
            {m.title}
          </h2>
          <p
            className="prose-sheet ink-in"
            style={{ "--d": "100ms" } as React.CSSProperties}
          >
            {m.lede}
          </p>
        </div>

        <ol className="mt-14 grid grid-cols-1 gap-x-8 gap-y-9 sm:grid-cols-2 lg:mt-16 lg:grid-cols-6 lg:gap-x-6">
          {m.pillars.map((pillar, i) => {
            const Mark = PILLAR_MARKS[i];
            return (
              <li
                key={pillar.key}
                className="ink-in relative border-l border-[var(--rule-strong)] pl-6 lg:border-l-0 lg:border-t lg:pl-0 lg:pt-9"
                style={{ "--d": `${140 + i * 80}ms` } as React.CSSProperties}
              >
                {/* The station: where the traverse line is occupied. */}
                <span
                  aria-hidden
                  className="absolute left-0 top-1 h-[9px] w-[9px] -translate-x-1/2 rotate-45 border border-ink bg-paper lg:left-0 lg:top-0 lg:-translate-y-1/2 lg:translate-x-0"
                />
                <Mark className="h-8 w-8 text-ink-soft" />
                <h3 className="mt-4 font-display text-[1.15rem] font-semibold leading-[1.3] text-ink">
                  {pillar.title}
                </h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-soft">
                  {pillar.body}
                </p>
              </li>
            );
          })}
        </ol>

        <p
          className="ink-in mt-14 max-w-[44rem] border-t-2 border-ink pt-6 font-display text-[clamp(1.25rem,2.4vw,1.65rem)] leading-[1.4] text-ink lg:mt-16"
          style={{ "--d": "680ms" } as React.CSSProperties}
        >
          {m.closing}
        </p>
      </div>
    </section>
  );
}
