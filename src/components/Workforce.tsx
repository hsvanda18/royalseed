import { FACTS, PHOTOS, type Copy } from "../content";
import { useInk } from "../lib/hooks";

/** One sapling mark, drawn at the cell's origin. */
const mark = (x: number, y: number) =>
  `M${x} ${y}v-9.5M${x} ${y - 6.5}l-3.2-3.2M${x} ${y - 6.5}l3.2-3.2`;

/**
 * 710 people at harvest, held as three figures and the company's own
 * illustrations of the work.
 */
export function Workforce({ copy }: { copy: Copy }) {
  const { ref, inkAttr } = useInk<HTMLElement>();
  const w = copy.people;

  const columns = [
    {
      keyLabel: w.keyPermanent,
      value: FACTS.workersPermanent,
      tone: "ink" as const,
      photo: PHOTOS.workforce[0],
      alt: w.illustrations[0],
    },
    {
      keyLabel: w.keySeasonal,
      value: FACTS.workersSeasonal,
      tone: "terra" as const,
      photo: PHOTOS.workforce[1],
      alt: w.illustrations[1],
    },
    {
      keyLabel: w.harvest,
      value: FACTS.workersHarvest,
      tone: "ink" as const,
      photo: PHOTOS.workforce[2],
      alt: w.illustrations[2],
    },
  ];

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
          <p className="callout ink-in" style={{ "--d": "160ms" } as React.CSSProperties}>
            {w.body}
          </p>
        </div>

        {/* Each figure centred directly above its own photograph, the three
            columns held to equal width so the numbers land at equal
            intervals — the count and the work it describes, read together. */}
        <div className="mt-8 grid grid-cols-1 gap-8 border-t border-[var(--rule-strong)] pt-6 sm:grid-cols-3 sm:gap-5">
          {columns.map((col, i) => {
            const color = col.tone === "terra" ? "var(--color-terra)" : "var(--color-ink)";
            return (
              <div
                key={col.keyLabel}
                className="ink-in flex flex-col items-center text-center"
                style={{ "--d": `${i * 90}ms` } as React.CSSProperties}
              >
                <div className="flex items-center gap-2.5">
                  <svg viewBox="0 0 14 17" className="h-4 w-3.5 shrink-0" aria-hidden>
                    <path d={mark(7, 15)} stroke={color} strokeWidth="1.25" strokeLinecap="round" fill="none" />
                  </svg>
                  <p className="annot-sm text-ink-faint">{col.keyLabel}</p>
                </div>
                <p className="figure-xl mt-2 text-[clamp(2.25rem,5vw,3.25rem)]" style={{ color }}>
                  {col.value}
                </p>
                <img
                  src={col.photo.src}
                  width={col.photo.width}
                  height={col.photo.height}
                  alt={col.alt}
                  loading="lazy"
                  decoding="async"
                  className="mt-4 block h-auto w-full border border-[var(--rule-strong)] bg-paper-deep"
                />
              </div>
            );
          })}
        </div>
        <p className="annot-sm mt-2.5 text-center text-ink-faint">{w.illustrationNote}</p>
      </div>
    </section>
  );
}
