import { useState } from "react";
import { PHOTOS, type Copy } from "../content";
import { useInk } from "../lib/hooks";

const plateSoft = "text-[color-mix(in_srgb,var(--color-paper)_66%,var(--color-plate))]";
const plateRule = "border-[color-mix(in_srgb,var(--color-paper)_20%,transparent)]";

/**
 * The first screen: the orchard photograph fills it, the headline and the
 * schedule of areas sit on it. On large screens everything is held to the
 * viewport and the photograph gives up its sky first; on phones the three
 * stack.
 */
export function Overview({ copy }: { copy: Copy }) {
  const { ref, inkAttr } = useInk<HTMLElement>("-5% 0px -20% 0px");
  const h = copy.hero;

  return (
    <section
      id="plan"
      ref={ref}
      {...inkAttr}
      className="relative z-10 px-4 pb-10 pt-[5.25rem] sm:px-6 sm:pt-[5.75rem] lg:px-8"
    >
      {/* Below lg the three stack (card, photograph, schedule). From lg the
          photograph fills the frame and the card and schedule sit on its
          bottom edge side by side, at one height. */}
      <div className="relative mx-auto flex max-w-[var(--sheet-max)] flex-col border border-[var(--rule-strong)] lg:grid lg:h-[calc(100svh-7rem)] lg:min-h-[34rem] lg:grid-cols-[minmax(0,1fr)_minmax(0,31rem)] lg:content-end lg:items-stretch lg:gap-6 lg:p-8">
        <CornerMarks />

        <img
          src={PHOTOS.overview.src}
          width={PHOTOS.overview.width}
          height={PHOTOS.overview.height}
          alt={h.photo.alt}
          fetchPriority="high"
          decoding="async"
          className="wash-in order-2 block aspect-[4/3] w-full object-cover object-[center_80%] sm:aspect-[16/9] lg:absolute lg:inset-0 lg:aspect-auto lg:h-full"
        />

        <div className="relative order-1 flex flex-col justify-end bg-paper p-6 sm:p-9 lg:max-w-[36rem] lg:bg-paper/94 lg:p-9 lg:backdrop-blur-[2px]">
          <h1
            className="figure-xl ink-in text-[clamp(2.6rem,5vw,4.25rem)] text-ink"
            style={{ "--d": "120ms", textWrap: "balance" } as React.CSSProperties}
          >
            {h.headline}
          </h1>

          <div className="ink-in mt-7" style={{ "--d": "260ms" } as React.CSSProperties}>
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

        <div className="relative order-3 flex">
          <AreaTable copy={copy} />
        </div>
      </div>
    </section>
  );
}

/**
 * The schedule of areas, reduced to four figures on a 2 × 2 key so it holds
 * the same height as the headline card. The ground is survey green so the
 * figures can be set in gold and still clear contrast.
 */
function AreaTable({ copy }: { copy: Copy }) {
  const [revealed, setRevealed] = useState(false);
  const s = copy.schedule;

  return (
    <div className="on-plate flex w-full flex-col justify-between bg-plate p-6 text-paper sm:p-7 lg:bg-plate/95">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <h2 className="annot-sm ink-in text-gold-bright" style={{ "--d": "160ms" } as React.CSSProperties}>
          {s.title}
        </h2>

        {/* The one estimate the company owns waits behind its qualifier. */}
        {revealed ? (
          <p className="annot-sm text-gold-bright">
            {s.estimateFlag}:{" "}
            <span className="font-display text-[1.05rem] font-semibold normal-case tracking-normal text-paper">
              {s.estimateValue} {s.estimateUnit}
            </span>
          </p>
        ) : (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="inline-flex items-center gap-1.5 border-b border-gold-bright pb-0.5 text-start font-display text-[0.875rem] font-semibold text-paper transition-colors duration-300 hover:text-gold-bright"
          >
            {s.estimateReveal}
            <span aria-hidden className="text-gold-bright">
              ↓
            </span>
          </button>
        )}
      </div>

      <dl className={`mt-4 grid grid-cols-2 border-t ${plateRule}`}>
        {s.rows.map((row, i) => (
          <div
            key={row.label}
            className={`ink-in flex flex-col justify-between border-b py-3 ${plateRule} ${i % 2 === 0 ? `border-e pe-4` : "ps-4"}`}
            style={{ "--d": `${220 + i * 70}ms` } as React.CSSProperties}
          >
            <dt className={`annot-sm ${plateSoft}`}>{row.label}</dt>
            <dd className="mt-1.5 flex flex-wrap items-baseline gap-x-2">
              <span className="figure-xl text-[clamp(1.8rem,2.6vw,2.3rem)] text-gold-bright">
                {row.value}
              </span>
              <span className={`annot-sm ${plateSoft}`}>{row.unit}</span>
            </dd>
          </div>
        ))}
      </dl>

      {/* Derived figures: arithmetic on the stated numbers, labelled as
          arithmetic. */}
      <p
        className={`ink-in mt-3 text-[0.8125rem] leading-snug ${plateSoft}`}
        style={{ "--d": "520ms" } as React.CSSProperties}
      >
        <span className="annot-sm me-2">{s.derivedTitle}</span>
        {s.derived.map((d, i) => (
          <span key={d.label}>
            {i > 0 && " · "}
            <span className="font-semibold text-paper tabular-nums">{d.value}</span> {d.label}
          </span>
        ))}
      </p>

      {revealed && (
        <p className={`mt-2 text-[0.8125rem] leading-snug ${plateSoft}`}>{s.estimateBody}</p>
      )}
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
