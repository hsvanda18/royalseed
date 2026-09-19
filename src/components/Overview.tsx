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
      <div className="relative mx-auto flex max-w-[var(--sheet-max)] flex-col border border-[var(--rule-strong)] lg:grid lg:h-[calc(100svh-7rem)] lg:min-h-[max(34rem,56.25vw)] lg:grid-cols-[minmax(0,1fr)_minmax(0,31rem)] lg:content-end lg:items-stretch lg:gap-6 lg:p-8">
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
 * the same height as the headline card. The estimated production, the one
 * number the company does not hold a measurement for, closes the block at
 * its own scale — larger than the four measured figures above it, because
 * it is the number a buyer reads this card for, still carrying the word
 * "estimate" wherever it appears. The ground is survey green so the
 * figures can be set in gold and still clear contrast.
 */
function AreaTable({ copy }: { copy: Copy }) {
  const s = copy.schedule;

  return (
    <div className="on-plate flex w-full flex-col justify-between bg-plate p-6 text-paper sm:p-7 lg:bg-plate/95">
      <h2 className="annot-sm ink-in text-gold-bright" style={{ "--d": "160ms" } as React.CSSProperties}>
        {s.title}
      </h2>

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

      {/* The estimate, given the prominence the derived arithmetic used to
          take up: still flagged as an estimate, and its qualifying sentence
          stays on the sheet rather than behind a click. */}
      <div
        className="ink-in mt-4 border-t pt-3"
        style={{ "--d": "520ms", borderColor: "color-mix(in srgb, var(--color-gold-bright) 45%, transparent)" } as React.CSSProperties}
      >
        <p className="annot-sm text-gold-bright">{s.estimateFlag}</p>
        <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2.5">
          <span className="figure-xl text-[clamp(2.4rem,4.2vw,3.1rem)] text-gold-bright">
            {s.estimateValue}
          </span>
          <span className={`annot-sm ${plateSoft}`}>{s.estimateUnit}</span>
        </p>
        <p className={`mt-2 text-[0.8125rem] leading-snug ${plateSoft}`}>{s.estimateBody}</p>
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
