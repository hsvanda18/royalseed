import { PHOTOS, type Copy } from "../content";
import { useInk } from "../lib/hooks";
import { Photo } from "./Photo";

/**
 * The six points as plain text columns, with the photographs directly under
 * them, so the model and the ground it runs on share one screen.
 */
export function Method({ copy }: { copy: Copy }) {
  const { ref, inkAttr } = useInk<HTMLElement>();
  const m = copy.method;

  return (
    <section
      id="method"
      ref={ref}
      {...inkAttr}
      className="relative z-10 px-5 py-12 sm:px-8 lg:py-14"
    >
      <div className="mx-auto max-w-[var(--sheet-max)]">
        <div className="grid gap-x-14 gap-y-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-end">
          <h2
            className="figure-xl ink-in text-[clamp(2.2rem,4vw,3.2rem)] text-ink"
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

        <ol className="mt-8 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-6">
          {m.pillars.map((pillar, i) => (
            <li
              key={pillar.key}
              className="ink-in"
              style={{ "--d": `${140 + i * 70}ms` } as React.CSSProperties}
            >
              <h3 className="font-display text-[1.1rem] font-semibold leading-[1.3] text-ink">
                {pillar.title}
              </h3>
              <p className="mt-1.5 text-[0.9rem] leading-relaxed text-ink-soft">{pillar.body}</p>
            </li>
          ))}
        </ol>

        {/* One common height for the row, drawn from the screen: the nursery
            frames are portrait and the orchard is landscape, so each is
            cropped from its edges, the orchard from its sky. */}
        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-[1fr_1fr_2fr]">
          {PHOTOS.method.map((photo, i) => (
            <Photo
              key={photo.src}
              {...photo}
              alt={m.photos[i].alt}
              caption={m.photos[i].caption}
              sizeClass={`w-full h-[clamp(11rem,28svh,18rem)] ${i === 2 ? "object-[center_85%]" : ""}`}
              sizes={i === 2 ? "(min-width: 1024px) 44rem, 100vw" : "(min-width: 1024px) 22rem, 50vw"}
              className={`ink-in ${i === 2 ? "col-span-2 lg:col-span-1" : ""}`}
            />
          ))}
        </div>

        <p
          className="ink-in mt-7 max-w-[44rem] border-t-2 border-ink pt-4 font-display text-[clamp(1.1rem,1.8vw,1.35rem)] leading-[1.4] text-ink"
          style={{ "--d": "600ms" } as React.CSSProperties}
        >
          {m.closing}
        </p>
      </div>
    </section>
  );
}
