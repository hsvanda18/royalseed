import { useState } from "react";
import { PHOTOS, type Copy } from "../content";
import { useInk } from "../lib/hooks";
import { Photo } from "./Photo";

const plateSoft = "text-[color-mix(in_srgb,var(--color-paper)_66%,var(--color-plate))]";
const plateRule = "border-[color-mix(in_srgb,var(--color-paper)_20%,transparent)]";

/**
 * The first viewport: the headline, the schedule of areas beside it, and the
 * orchard photograph under both. The schedule is the argument — measured
 * ground — so it sits in the title block, not a scroll away.
 */
export function Overview({ copy }: { copy: Copy }) {
  const { ref, inkAttr } = useInk<HTMLElement>("-5% 0px -20% 0px");
  const h = copy.hero;

  return (
    <section
      id="plan"
      ref={ref}
      {...inkAttr}
      className="relative z-10 px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8"
    >
      <div className="mx-auto max-w-[var(--sheet-max)]">
        <div className="relative border border-[var(--rule-strong)] bg-paper/70">
          <CornerMarks />

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)]">
            <div className="flex flex-col justify-between gap-9 p-6 sm:p-9 lg:p-12">
              <div>
                <h1
                  className="figure-xl ink-in text-[clamp(2.6rem,6vw,4.75rem)] text-ink"
                  style={{ "--d": "120ms", textWrap: "balance" } as React.CSSProperties}
                >
                  {h.headline}
                </h1>

                <p
                  className="prose-sheet ink-in mt-7"
                  style={{ "--d": "240ms" } as React.CSSProperties}
                >
                  {h.standfirst}
                </p>
              </div>

              <div className="ink-in" style={{ "--d": "360ms" } as React.CSSProperties}>
                <a
                  href="#contact"
                  className="group inline-flex items-baseline gap-3 border-b-2 border-gold pb-1 text-ink transition-colors duration-300 hover:border-gold-ink"
                >
                  <span className="font-display text-[1.35rem] font-semibold">{h.cta}</span>
                  <span
                    aria-hidden
                    className="inline-block text-gold-ink transition-transform duration-500 group-hover:translate-x-1.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-1.5"
                  >
                    →
                  </span>
                </a>
                <p className="annot-sm mt-3 text-ink-faint">{h.ctaSub}</p>
              </div>
            </div>

            <AreaTable copy={copy} />
          </div>

          <Photo
            {...PHOTOS.overview}
            alt={h.photo.alt}
            ratioClass="aspect-[3/2] sm:aspect-[2/1] lg:aspect-[5/2] border-x-0 border-b-0"
            sizes="(min-width: 88rem) 88rem, 100vw"
            eager
            className="wash-in"
          />
          <p className="annot-sm border-t border-[var(--rule-strong)] px-6 py-3 text-ink-faint sm:px-9">
            {h.photo.caption}
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * The schedule of areas, compacted into the title block. The ground is
 * survey green so the figures can be set in gold and still clear contrast.
 */
function AreaTable({ copy }: { copy: Copy }) {
  const [revealed, setRevealed] = useState(false);
  const s = copy.schedule;

  return (
    <div className="on-plate bg-plate p-6 text-paper sm:p-8">
      <h2 className="annot-sm ink-in text-gold-bright" style={{ "--d": "160ms" } as React.CSSProperties}>
        {s.title}
      </h2>

      <dl className={`mt-4 border-t ${plateRule}`}>
        {s.rows.map((row, i) => (
          <div
            key={row.label}
            className={`ink-in grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-5 border-b py-3.5 ${plateRule}`}
            style={{ "--d": `${220 + i * 70}ms` } as React.CSSProperties}
          >
            <div>
              <dt className="annot text-paper">{row.label}</dt>
              <dd className={`annot-sm mt-1 ${plateSoft}`}>{row.note}</dd>
            </div>
            {/* Below sm the unit drops under its figure: "colaboradores" beside
                "231.000" leaves the label no room at 390px. */}
            <dd className="flex flex-col items-end gap-1 sm:flex-row sm:items-baseline sm:gap-2">
              <span className="figure-xl text-[clamp(1.9rem,3.6vw,2.6rem)] text-gold-bright">
                {row.value}
              </span>
              <span className={`annot-sm ${plateSoft}`}>{row.unit}</span>
            </dd>
          </div>
        ))}
      </dl>

      <div
        className="ink-in mt-5 grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,13rem)]"
        style={{ "--d": "520ms" } as React.CSSProperties}
      >
        {/* Derived figures: arithmetic on the stated numbers, labelled as
            arithmetic. */}
        <div>
          <h3 className={`annot-sm ${plateSoft}`}>{s.derivedTitle}</h3>
          <ul className="mt-2.5 space-y-1.5">
            {s.derived.map((d) => (
              <li key={d.label} className="flex flex-wrap items-baseline gap-x-2.5">
                <span className="font-display text-[1.15rem] font-semibold tabular-nums text-paper">
                  {d.value}
                </span>
                <span className={`text-[0.875rem] ${plateSoft}`}>{d.label}</span>
                <span className={`annot-sm ${plateSoft}`}>{d.note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* The one estimate the company owns waits behind its qualifier. */}
        <div className="border border-[color-mix(in_srgb,var(--color-gold-bright)_55%,transparent)] p-3.5">
          <p className="annot-sm text-gold-bright">{s.estimateFlag}</p>
          {revealed ? (
            <>
              <p className="figure-xl mt-2 text-[1.9rem] text-gold-bright">
                {s.estimateValue}
                <span className={`ms-2 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.16em] ${plateSoft}`}>
                  {s.estimateUnit}
                </span>
              </p>
              <p className={`mt-2 text-[0.8125rem] leading-snug ${plateSoft}`}>{s.estimateBody}</p>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="mt-2 inline-flex items-center gap-2 border-b border-gold-bright pb-0.5 text-start font-display text-[0.9375rem] font-semibold text-paper transition-colors duration-300 hover:text-gold-bright"
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
          className={`pointer-events-none absolute z-10 h-4 w-4 border-ink ${m}`}
        />
      ))}
    </>
  );
}
