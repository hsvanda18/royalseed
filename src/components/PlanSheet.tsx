import { useId, useMemo, useState } from "react";
import type { Copy } from "../content";
import { useInk } from "../lib/hooks";

/* Geometry, in sheet units (viewBox 1000 × 640).
   The parcel outline is schematic and labelled as such. What is NOT
   schematic is the ratio: the first-phase block encloses 23.58% of the
   parcel's area, which is exactly 500 ÷ 2 120. Shoelace-verified. */
const PARCEL = [
  [70, 112],
  [398, 60],
  [706, 92],
  [906, 192],
  [932, 398],
  [812, 558],
  [470, 594],
  [186, 520],
  [92, 330],
] as const;

const BLOCK = [
  [262, 257],
  [688, 243],
  [700, 447],
  [274, 461],
] as const;

const toPath = (pts: readonly (readonly number[])[]) =>
  pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(" ") + " Z";

const PARCEL_D = toPath(PARCEL);
const BLOCK_D = toPath(BLOCK);
/** A watercourse crossing the parcel — drawn, like every line here, as a plan symbol. */
const WATER_D =
  "M 88 268 C 210 300, 268 214, 392 214 C 520 214, 566 178, 700 176 C 800 175, 872 196, 930 226";

export function PlanSheet({ copy }: { copy: Copy }) {
  const { ref, inkAttr } = useInk<HTMLElement>("-5% 0px -20% 0px");
  const [phase, setPhase] = useState(0);
  const uid = useId().replace(/:/g, "");
  const phases = copy.hero.phases;
  const current = phases[phase];

  const sliderLabel = useMemo(
    () => `${current.label}: ${current.value} ${current.unit}`,
    [current],
  );

  return (
    <section
      id="plan"
      ref={ref}
      {...inkAttr}
      className="relative z-10 px-4 pb-16 pt-20 sm:px-6 sm:pb-20 lg:px-8 lg:pt-24"
    >
      <div className="mx-auto max-w-[var(--sheet-max)]">
        {/* The drawing sheet: a ruled frame with corner registration marks. */}
        <div className="relative border border-[var(--rule-strong)] bg-paper/70">
          <CornerMarks />

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,27rem)_minmax(0,1fr)]">
            {/* Left margin: the title block copy. */}
            <div className="flex flex-col gap-9 border-b border-[var(--rule-strong)] p-6 sm:p-9 lg:border-b-0 lg:border-r lg:p-10">
              <div>
                <p
                  className="annot-sm ink-in text-ink-faint"
                  style={{ "--d": "80ms" } as React.CSSProperties}
                >
                  {copy.hero.company} · {copy.hero.sheetSub}
                </p>

                <h1
                  className="figure-xl ink-in mt-6 text-[clamp(2.4rem,5.2vw,3.9rem)] text-ink"
                  style={{ "--d": "180ms", textWrap: "balance" } as React.CSSProperties}
                >
                  {copy.hero.headline}
                </h1>

                <p
                  className="prose-sheet ink-in mt-6"
                  style={{ "--d": "300ms" } as React.CSSProperties}
                >
                  {copy.hero.standfirst}
                </p>
              </div>

              <div
                className="ink-in"
                style={{ "--d": "420ms" } as React.CSSProperties}
              >
                <a
                  href="#contact"
                  className="group inline-flex items-baseline gap-3 border-b-2 border-gold pb-1 text-ink transition-colors duration-300 hover:border-gold-ink"
                >
                  <span className="font-display text-[1.35rem] font-semibold">
                    {copy.hero.cta}
                  </span>
                  <span
                    aria-hidden
                    className="translate-x-0 text-gold-ink transition-transform duration-500 group-hover:translate-x-1.5"
                  >
                    →
                  </span>
                </a>
                <p className="annot-sm mt-3 text-ink-faint">{copy.hero.ctaSub}</p>
              </div>
            </div>

            {/* The plan itself. The figure and its control sit above the
                drawing: on a 900px laptop the drawing runs past the fold, and
                the reader must still meet the number and the control there. */}
            <div className="relative p-4 sm:p-6 lg:p-7">
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <h2 className="annot text-ink">{copy.hero.sheetTitle}</h2>
                <p className="annot-sm text-ink-faint">{copy.hero.scaleNote}</p>
              </div>

              <PhaseAxis
                copy={copy}
                phase={phase}
                setPhase={setPhase}
                sliderLabel={sliderLabel}
              />

              <div className="mt-4">
                <PlanDrawing copy={copy} phase={phase} uid={uid} />
              </div>

              <PlanLegend copy={copy} phase={phase} />
            </div>
          </div>

          {/* Sheet footer strip. */}
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-[var(--rule-strong)] px-6 py-3 sm:px-9">
            <p className="annot-sm text-ink-faint">{copy.hero.schematicNote}</p>
            <p className="annot-sm text-ink-faint">
              {copy.colophon.sheetLine.split(" · ")[0]}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * The sheet's legend, for the widths where the drawing's own leaders are too
 * small to letter. Entries dim rather than disappear as the phase axis moves,
 * so the legend never reflows under the reader.
 */
function PlanLegend({ copy, phase }: { copy: Copy; phase: number }) {
  const L = copy.hero.legend;
  const entries = [
    { key: "parcel", label: L.parcel, from: 0, tone: "ink" as const },
    { key: "water", label: L.watercourse, from: 0, tone: "faint" as const },
    { key: "block", label: L.block, from: 1, tone: "gold" as const },
    { key: "lattice", label: L.lattice, from: 2, tone: "ink" as const },
  ];

  return (
    <ul className="mt-6 border-t border-[var(--rule-strong)] pt-4 lg:hidden">
      {entries.map((e) => {
        const on = phase >= e.from;
        return (
          <li
            key={e.key}
            className="flex items-start gap-3 py-1.5 transition-opacity duration-500"
            style={{ opacity: on ? 1 : 0.32 }}
          >
            <span
              aria-hidden
              className={[
                "mt-[3px] h-2.5 w-2.5 shrink-0 border",
                e.tone === "gold"
                  ? "border-gold-ink bg-gold/45"
                  : e.tone === "faint"
                    ? "border-ink-faint"
                    : "border-ink bg-ink/5",
              ].join(" ")}
            />
            <span className="annot-sm text-ink-soft">{e.label}</span>
          </li>
        );
      })}
    </ul>
  );
}

function CornerMarks() {
  const marks = [
    "left-0 top-0 border-l-2 border-t-2",
    "right-0 top-0 border-r-2 border-t-2",
    "left-0 bottom-0 border-b-2 border-l-2",
    "right-0 bottom-0 border-b-2 border-r-2",
  ];
  return (
    <>
      {marks.map((m) => (
        <span
          key={m}
          aria-hidden
          className={`pointer-events-none absolute h-4 w-4 border-ink ${m}`}
        />
      ))}
    </>
  );
}

function PlanDrawing({
  copy,
  phase,
  uid,
}: {
  copy: Copy;
  phase: number;
  uid: string;
}) {
  const showBlock = phase >= 1;
  const showLattice = phase >= 2;
  const showYield = phase >= 3;
  const L = copy.hero.legend;

  return (
    <figure className="m-0">
      <svg
        viewBox="0 0 1000 576"
        className="block w-full"
        role="img"
        aria-label={`${copy.hero.sheetTitle}. ${copy.hero.schematicNote}`}
      >
        <defs>
          <pattern
            id={`hatch-${uid}`}
            width="9"
            height="9"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="9"
              stroke="var(--color-gold)"
              strokeWidth="1"
              opacity="0.55"
            />
          </pattern>

          {/* The planting lattice is a plan symbol, not a headcount: 231 000
              marks cannot be drawn. The annotation carries the real number. */}
          <pattern
            id={`lattice-${uid}`}
            width="14"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="3.5" cy="2.5" r="1.15" fill="var(--color-ink)" opacity="0.62" />
            <circle cx="10.5" cy="7.5" r="1.15" fill="var(--color-ink)" opacity="0.62" />
          </pattern>

          <clipPath id={`blockclip-${uid}`}>
            <path d={BLOCK_D} />
          </clipPath>
          <clipPath id={`parcelclip-${uid}`}>
            <path d={PARCEL_D} />
          </clipPath>
        </defs>

        <g transform="scale(1, 0.9)">
        {/* Coordinate ticks along the sheet frame. */}
        <g stroke="var(--color-ink)" strokeWidth="1" opacity="0.32">
          {Array.from({ length: 21 }, (_, i) => 40 + i * 46).map((x) => (
            <line key={`tx${x}`} x1={x} y1="14" x2={x} y2={x % 184 === 40 ? 30 : 22} />
          ))}
          {Array.from({ length: 13 }, (_, i) => 40 + i * 46).map((y) => (
            <line key={`ty${y}`} x1="14" y1={y} x2={y % 184 === 40 ? 30 : 22} y2={y} />
          ))}
        </g>

        {/* Parcel wash — the land the company holds. The tint lives on
            fill-opacity so the entrance can own `opacity` without flooding
            the parcel solid. */}
        <g className="wash-in" style={{ "--d": "250ms" } as React.CSSProperties}>
          <path d={PARCEL_D} fill="var(--color-ink)" fillOpacity={0.045} />
          <path d={PARCEL_D} fill="var(--color-terra)" fillOpacity={0.035} />
        </g>

        {/* Watercourse, clipped to the parcel. */}
        <g clipPath={`url(#parcelclip-${uid})`}>
          <path
            d={WATER_D}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="1.4"
            opacity="0.42"
            className="draw"
            style={{ "--len": 1100, "--d": "700ms" } as React.CSSProperties}
          />
        </g>

        {/* Parcel boundary. */}
        <path
          d={PARCEL_D}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="2.25"
          strokeLinejoin="round"
          className="draw"
          style={{ "--len": 2800, "--d": "120ms" } as React.CSSProperties}
        />
        {PARCEL.map(([x, y]) => (
          <rect
            key={`v${x}-${y}`}
            x={x - 3.5}
            y={y - 3.5}
            width="7"
            height="7"
            fill="var(--color-paper)"
            stroke="var(--color-ink)"
            strokeWidth="1.5"
            className="wash-in"
            style={{ "--d": "900ms" } as React.CSSProperties}
          />
        ))}

        {/* First-phase block. Gold, because it is a measured value. It is
            drawn from the first stop as a dashed proposed boundary — the
            argument of the sheet cannot wait for an interaction. */}
        <path
          d={BLOCK_D}
          fill="none"
          stroke="var(--color-gold-ink)"
          strokeWidth="1.75"
          strokeDasharray="10 7"
          className="wash-in"
          style={
            {
              "--d": "1150ms",
              opacity: showBlock ? 0 : undefined,
              transition: "opacity 620ms cubic-bezier(0.16,1,0.3,1)",
            } as React.CSSProperties
          }
        />
        <g
          style={{
            opacity: showBlock ? 1 : 0,
            transition: "opacity 620ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <path d={BLOCK_D} fill={`url(#hatch-${uid})`} />
          {/* At the last stop the block carries a gold wash: the same 500 ha,
              now read as the area the estimate is calculated over. */}
          <path
            d={BLOCK_D}
            fill="var(--color-gold)"
            fillOpacity={showYield ? 0.16 : 0}
            style={{ transition: "fill-opacity 620ms cubic-bezier(0.16,1,0.3,1)" }}
          />
          <path
            d={BLOCK_D}
            fill="none"
            stroke="var(--color-gold-ink)"
            strokeWidth="2.25"
            strokeLinejoin="miter"
          />
        </g>

        {/* Planting lattice, clipped to the block. */}
        <g
          clipPath={`url(#blockclip-${uid})`}
          style={{
            opacity: showLattice ? 1 : 0,
            transition: "opacity 720ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <rect x="250" y="230" width="470" height="250" fill={`url(#lattice-${uid})`} />
        </g>

        {/* Annotations arrive along their own leader lines. */}
        <Leader
          from={[906, 192]}
          to={[820, 118]}
          label={L.parcel}
          anchor="end"
          tone="ink"
          delay="1000ms"
        />
        <Leader
          from={[420, 243]}
          to={[352, 198]}
          label={L.block}
          anchor="start"
          tone="gold"
          delay="1250ms"
        />
        <Leader
          from={[420, 461]}
          to={[540, 548]}
          label={L.lattice}
          anchor="middle"
          tone="ink"
          hidden={!showLattice}
        />
        <Leader
          from={[300, 226]}
          to={[214, 172]}
          label={L.watercourse}
          anchor="end"
          tone="faint"
          delay="1250ms"
        />

        </g>

        <NorthArrow label={copy.hero.north} />
        <ScaleBar />
      </svg>

      <figcaption className="sr-only">{copy.hero.schematicNote}</figcaption>
    </figure>
  );
}

function Leader({
  from,
  to,
  label,
  anchor,
  tone,
  delay = "0ms",
  hidden = false,
}: {
  from: [number, number];
  to: [number, number];
  label: string;
  anchor: "start" | "middle" | "end";
  tone: "ink" | "gold" | "faint";
  delay?: string;
  hidden?: boolean;
}) {
  const color =
    tone === "gold"
      ? "var(--color-gold-ink)"
      : tone === "faint"
        ? "var(--color-ink-faint)"
        : "var(--color-ink)";
  const textY = to[1] < from[1] ? to[1] - 9 : to[1] + 17;

  /* Two entrance owners would fight each other, so a leader tied to a phase
     stop is driven by that stop, and only an always-present leader inherits
     the sheet's drafting-hand delay. */
  const phaseDriven = hidden !== undefined && delay === "0ms";

  return (
    <g
      className={`plan-leader${phaseDriven ? "" : " wash-in"}`}
      style={
        {
          "--d": delay,
          opacity: hidden ? 0 : phaseDriven ? 1 : undefined,
          transition: "opacity 500ms cubic-bezier(0.16,1,0.3,1)",
        } as React.CSSProperties
      }
    >
      <line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} stroke={color} strokeWidth="1" />
      <circle cx={from[0]} cy={from[1]} r="2.75" fill={color} />
      <text
        x={to[0]}
        y={textY}
        textAnchor={anchor}
        className="annot-sm"
        fill={color}
        fontSize="11.5"
      >
        {label}
      </text>
    </g>
  );
}

function NorthArrow({ label }: { label: string }) {
  return (
    <g
      transform="translate(58, 496)"
      className="wash-in"
      style={{ "--d": "1350ms" } as React.CSSProperties}
    >
      <path
        d="M 0 -30 L 8.5 12 L 0 5 L -8.5 12 Z"
        fill="var(--color-ink)"
        stroke="var(--color-ink)"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <text
        x="0"
        y="34"
        textAnchor="middle"
        className="annot-sm"
        fill="var(--color-ink)"
        fontSize="12"
      >
        {label}
      </text>
    </g>
  );
}

function ScaleBar() {
  return (
    <g
      transform="translate(132, 516)"
      className="wash-in"
      style={{ "--d": "1450ms" } as React.CSSProperties}
    >
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={i * 42}
          y="0"
          width="42"
          height="7"
          fill={i % 2 === 0 ? "var(--color-ink)" : "var(--color-paper)"}
          stroke="var(--color-ink)"
          strokeWidth="1"
        />
      ))}
      <text x="0" y="24" className="annot-sm" fill="var(--color-ink-faint)" fontSize="10.5">
        0
      </text>
      <text
        x="168"
        y="24"
        textAnchor="end"
        className="annot-sm"
        fill="var(--color-ink-faint)"
        fontSize="10.5"
      >
        2 KM
      </text>
    </g>
  );
}

/**
 * The phase axis. It is gold because it is the control, and on this sheet
 * gold marks a control or a measured value and nothing else.
 */
function PhaseAxis({
  copy,
  phase,
  setPhase,
  sliderLabel,
}: {
  copy: Copy;
  phase: number;
  setPhase: (n: number) => void;
  sliderLabel: string;
}) {
  const phases = copy.hero.phases;
  const current = phases[phase];
  const helpId = "phase-axis-help";

  return (
    <div className="border-t border-[var(--rule-strong)] pt-5">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div className="min-w-0">
          <p className="annot-sm text-ink-faint">{current.label}</p>
          <p className="figure-xl mt-2 text-[clamp(2.6rem,7vw,4.25rem)] text-ink">
            {current.value}
            <span className="ml-3 font-sans text-[0.9rem] font-semibold uppercase tracking-[0.18em] text-ink-soft">
              {current.unit}
            </span>
          </p>
        </div>
        <p className="prose-sheet max-w-[22rem] text-[0.9375rem]">{current.note}</p>
      </div>

      <div className="mt-6">
        <label htmlFor="phase-axis" className="annot-sm text-ink-faint">
          {copy.hero.axisLabel}
        </label>

        <input
          id="phase-axis"
          type="range"
          min={0}
          max={phases.length - 1}
          step={1}
          value={phase}
          aria-describedby={helpId}
          aria-valuetext={sliderLabel}
          onChange={(e) => setPhase(Number(e.target.value))}
          className="axis-input mt-3 block w-full"
          style={
            {
              "--pct": `${(phase / (phases.length - 1)) * 100}%`,
            } as React.CSSProperties
          }
        />

        <ol className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-4">
          {phases.map((p, i) => (
            <li key={p.key}>
              <button
                type="button"
                onClick={() => setPhase(i)}
                aria-current={i === phase ? "step" : undefined}
                className={[
                  "annot-sm w-full text-left transition-colors duration-300",
                  i === phase ? "text-ink" : "text-ink-faint hover:text-ink-soft",
                ].join(" ")}
              >
                {p.label}
              </button>
            </li>
          ))}
        </ol>

        <p id={helpId} className="sr-only">
          {copy.hero.axisHelp}
        </p>
      </div>
    </div>
  );
}
