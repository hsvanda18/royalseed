import { useMemo, useRef } from "react";
import { FACTS, type Copy } from "../content";
import { useInk, useTallyColumns } from "../lib/hooks";

const CELL_W = 13;
const CELL_H = 17;

/** One sapling mark, drawn at the cell's origin. */
const mark = (x: number, y: number) =>
  `M${x} ${y}v-9.5M${x} ${y - 6.5}l-3.2-3.2M${x} ${y - 6.5}l3.2-3.2`;

function tally(from: number, count: number, cols: number) {
  let d = "";
  for (let i = 0; i < count; i++) {
    const n = from + i;
    const col = n % cols;
    const row = Math.floor(n / cols);
    d += mark(col * CELL_W + CELL_W / 2, row * CELL_H + CELL_H - 2);
  }
  return d;
}

/**
 * 710 people, drawn one at a time. The figure is the whole point of the
 * region: a workforce printed as "710" is a statistic, and a workforce
 * printed as 710 marks is a payroll you can see the size of.
 */
export function Workforce({ copy }: { copy: Copy }) {
  const { ref, inkAttr } = useInk<HTMLElement>();
  const plotRef = useRef<HTMLDivElement>(null);
  const cols = useTallyColumns(plotRef);
  const w = copy.people;

  const { permanentD, seasonalD, height } = useMemo(() => {
    const rows = Math.ceil(FACTS.workersHarvest / cols);
    return {
      permanentD: tally(0, FACTS.workersPermanent, cols),
      seasonalD: tally(FACTS.workersPermanent, FACTS.workersSeasonal, cols),
      height: rows * CELL_H,
    };
  }, [cols]);

  return (
    <section
      id="people"
      ref={ref}
      {...inkAttr}
      className="relative z-10 border-t border-[var(--rule-strong)] px-5 py-12 sm:px-8 lg:py-14"
    >
      <div className="mx-auto max-w-[var(--sheet-max)]">
        <div className="grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:items-end">
          <div>
            <h2
              className="figure-xl ink-in text-[clamp(2.2rem,4.6vw,3.4rem)] text-ink"
              style={{ "--d": "0ms" } as React.CSSProperties}
            >
              {w.title}
            </h2>
            <p
              className="ink-in mt-4 max-w-[30rem] font-display text-[1.3rem] leading-[1.4] text-ink"
              style={{ "--d": "80ms" } as React.CSSProperties}
            >
              {w.lede}
            </p>
          </div>
          <p
            className="prose-sheet ink-in"
            style={{ "--d": "160ms" } as React.CSSProperties}
          >
            {w.body}
          </p>
        </div>

        {/* The tally. */}
        <div
          ref={plotRef}
          className="wash-in mt-8 border-t border-[var(--rule-strong)] pt-6"
          style={{ "--d": "260ms" } as React.CSSProperties}
        >
          <svg
            viewBox={`0 0 ${cols * CELL_W} ${height}`}
            className="block w-full"
            role="img"
            aria-label={`${w.harvest}: ${FACTS.workersHarvest}. ${w.permanent}: ${FACTS.workersPermanent}. ${w.seasonal}: ${FACTS.workersSeasonal}.`}
          >
            <path
              d={permanentD}
              stroke="var(--color-ink)"
              strokeWidth="1.25"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d={seasonalD}
              stroke="var(--color-terra)"
              strokeWidth="1.25"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Legend and totals. */}
        <div className="mt-6 grid gap-x-10 gap-y-6 border-t border-[var(--rule-strong)] pt-5 sm:grid-cols-3">
          <Total
            label={w.permanent}
            value={FACTS.workersPermanent}
            tone="ink"
            keyLabel={w.keyPermanent}
            delay="0ms"
          />
          <Total
            label={w.seasonal}
            value={FACTS.workersSeasonal}
            tone="terra"
            keyLabel={w.keySeasonal}
            delay="90ms"
          />
          <div
            className="ink-in sm:text-end"
            style={{ "--d": "180ms" } as React.CSSProperties}
          >
            <p className="annot-sm text-ink-faint">{w.harvest}</p>
            <p className="figure-xl mt-2 text-[clamp(3rem,7vw,4.5rem)] text-ink">
              {FACTS.workersHarvest}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Total({
  label,
  value,
  tone,
  keyLabel,
  delay,
}: {
  label: string;
  value: number;
  tone: "ink" | "terra";
  keyLabel: string;
  delay: string;
}) {
  const color = tone === "terra" ? "var(--color-terra)" : "var(--color-ink)";
  return (
    <div className="ink-in" style={{ "--d": delay } as React.CSSProperties}>
      <div className="flex items-center gap-2.5">
        <svg viewBox="0 0 14 17" className="h-4 w-3.5 shrink-0" aria-hidden>
          <path
            d={mark(7, 15)}
            stroke={color}
            strokeWidth="1.25"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <p className="annot-sm text-ink-faint">{keyLabel}</p>
      </div>
      <p className="figure-xl mt-3 text-[clamp(2.25rem,5vw,3.25rem)]" style={{ color }}>
        {value}
      </p>
      <p className="annot-sm mt-2 text-ink-soft">{label}</p>
    </div>
  );
}
