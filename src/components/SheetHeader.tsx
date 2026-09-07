import { useEffect, useState } from "react";
import type { Copy, Lang } from "../content";
import { useActiveRegion } from "../lib/hooks";

const REGIONS = ["plan", "charter", "product", "method", "origin", "people", "contact"] as const;

export function Logo({ className = "" }: { className?: string }) {
  return (
    <img
      src="/assets/royalseed-logo.png"
      width={742}
      height={382}
      alt="Royalseed Agro"
      className={className}
      decoding="async"
    />
  );
}

export function SheetHeader({
  copy,
  lang,
  setLang,
}: {
  copy: Copy;
  lang: Lang;
  setLang: (l: Lang) => void;
}) {
  const active = useActiveRegion(REGIONS as unknown as string[]);
  const [lifted, setLifted] = useState(false);
  const [open, setOpen] = useState(false);
  const legendLabel = lang === "pt" ? "Legenda" : "Legend";

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A panel left open across a resize into the desktop layout would be
  // hidden but still focusable.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-500",
        lifted
          ? "border-b border-[var(--rule-strong)] bg-paper/92 backdrop-blur-[6px] shadow-[0_10px_30px_-24px_rgba(18,48,15,0.9)]"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-[var(--sheet-max)] items-center gap-4 px-5 sm:px-8">
        <a
          href="#plan"
          className="shrink-0"
          aria-label={lang === "pt" ? "Royalseed Agro — início" : "Royalseed Agro — home"}
        >
          <Logo className="h-8 w-auto sm:h-9" />
        </a>

        {/* The legend is the navigation: on a plan, the legend is how you
            find anything. */}
        <nav
          aria-label={lang === "pt" ? "Legenda da folha" : "Sheet legend"}
          className="ml-auto hidden lg:block"
        >
          <ul className="flex items-center gap-1">
            {REGIONS.map((id) => {
              const isActive = active === id;
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    aria-current={isActive ? "location" : undefined}
                    className="annot-sm group relative flex items-center gap-2 px-3 py-2 text-ink-soft transition-colors duration-300 hover:text-ink"
                  >
                    <span
                      aria-hidden
                      className={[
                        "h-[7px] w-[7px] shrink-0 border transition-all duration-400",
                        isActive
                          ? "border-gold-ink bg-gold"
                          : "border-[var(--rule-strong)] bg-transparent group-hover:border-ink-soft",
                      ].join(" ")}
                    />
                    <span className={isActive ? "text-ink" : undefined}>{copy.nav[id]}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3 lg:ml-4">
          <LangToggle lang={lang} setLang={setLang} copy={copy} />

          {/* Below lg the legend collapses into a disclosure. The sheet is one
              continuous document, so this lists where things are rather than
              pretending to be a site map. */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="legend-panel"
            className="annot-sm flex items-center gap-2 border border-[var(--rule-strong)] px-3 py-2.5 text-ink-soft transition-colors duration-300 hover:text-ink lg:hidden"
          >
            {legendLabel}
            <span
              aria-hidden
              className="transition-transform duration-400"
              style={{ transform: open ? "rotate(180deg)" : "none" }}
            >
              ↓
            </span>
          </button>

          {/* At 390px the logo, the language pair, the legend and this button
              do not fit on one row. Below sm the action lives in the legend
              panel's own contact entry and in the hero, both a thumb away. */}
          <a
            href="#contact"
            className="annot-sm hidden border border-gold-ink px-3 py-2.5 text-gold-ink transition-colors duration-300 hover:bg-gold-ink hover:text-paper sm:inline-block sm:px-4"
          >
            {copy.hero.cta}
          </a>
        </div>
      </div>

      {/* The collapsed legend. */}
      <div
        id="legend-panel"
        hidden={!open}
        className="border-t border-[var(--rule-strong)] bg-paper lg:hidden"
      >
        <ul className="mx-auto max-w-[var(--sheet-max)] px-5 py-3 sm:px-8">
          {REGIONS.map((id) => {
            // Contact carries the action below sm, where the header button
            // is dropped for width.
            const isAction = id === "contact";
            return (
              <li key={id} className="border-b border-[var(--rule)] last:border-b-0">
                <a
                  href={`#${id}`}
                  onClick={() => setOpen(false)}
                  aria-current={active === id ? "location" : undefined}
                  className={[
                    "annot-sm flex items-center gap-3 py-3.5",
                    isAction ? "text-gold-ink" : "text-ink-soft",
                  ].join(" ")}
                >
                  <span
                    aria-hidden
                    className={[
                      "h-[7px] w-[7px] shrink-0 border",
                      active === id || isAction
                        ? "border-gold-ink bg-gold"
                        : "border-[var(--rule-strong)]",
                    ].join(" ")}
                  />
                  {isAction ? copy.hero.cta : copy.nav[id]}
                  {isAction && (
                    <span aria-hidden className="ml-auto">
                      →
                    </span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}

function LangToggle({
  lang,
  setLang,
  copy,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  copy: Copy;
}) {
  return (
    <div
      role="group"
      aria-label={copy.langLabel}
      className="flex items-stretch border border-[var(--rule-strong)]"
    >
      {(["pt", "en"] as const).map((code) => {
        const isOn = lang === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={isOn}
            className={[
              "annot-sm px-2.5 py-2 transition-colors duration-300",
              isOn ? "bg-ink text-paper" : "text-ink-soft hover:text-ink",
            ].join(" ")}
          >
            {code.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
