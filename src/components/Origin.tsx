import type { Copy } from "../content";
import { useInk } from "../lib/hooks";
import { Gallery } from "./Gallery";

export function Origin({ copy }: { copy: Copy }) {
  const { ref, inkAttr } = useInk<HTMLElement>();
  const o = copy.origin;

  return (
    <section
      id="origin"
      ref={ref}
      {...inkAttr}
      className="relative z-10 border-t border-[var(--rule-strong)] px-5 py-12 sm:px-8 lg:py-14"
    >
      <div className="mx-auto grid max-w-[var(--sheet-max)] items-center gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
        <div>
          <h2
            className="figure-xl ink-in text-[clamp(2.2rem,4vw,3.2rem)] text-ink"
            style={{ "--d": "0ms" } as React.CSSProperties}
          >
            {o.title}
          </h2>
          <p
            className="prose-sheet ink-in mt-5"
            style={{ "--d": "90ms" } as React.CSSProperties}
          >
            {o.body}
          </p>
          <blockquote
            className="ink-in mt-6 border-s border-[var(--rule-strong)] ps-5"
            style={{ "--d": "180ms" } as React.CSSProperties}
          >
            <p className="font-display text-[clamp(1.1rem,1.7vw,1.35rem)] italic leading-[1.45] text-ink">
              {o.quote}
            </p>
          </blockquote>
        </div>

        <div className="ink-in min-w-0" style={{ "--d": "240ms" } as React.CSSProperties}>
          <Gallery copy={copy} />
        </div>
      </div>
    </section>
  );
}
