import { useCallback, useEffect, useRef, useState } from "react";
import { COPY, LANGS, type Lang } from "../content";

/**
 * The drafting hand. One observer per element; once a region is inked it
 * stays inked — a survey plan is not redrawn every time you scroll past it.
 */
export function useInk<T extends HTMLElement>(rootMargin = "-12% 0px -8% 0px") {
  const ref = useRef<T | null>(null);
  const [inked, setInked] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || inked) return;

    if (typeof IntersectionObserver === "undefined") {
      setInked(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInked(true);
            io.disconnect();
          }
        }
      },
      { rootMargin, threshold: 0.01 },
    );

    io.observe(node);
    return () => io.disconnect();
  }, [inked, rootMargin]);

  return { ref, inked, inkAttr: { "data-inked": inked } as const };
}

const STORE_KEY = "royalseed.lang";

function detectLang(): Lang {
  if (typeof window === "undefined") return "pt";
  try {
    const stored = window.localStorage.getItem(STORE_KEY);
    if (stored && (LANGS as string[]).includes(stored)) return stored as Lang;
  } catch {
    /* private mode, blocked storage — fall through to navigator */
  }
  const nav = window.navigator?.language?.toLowerCase() ?? "pt";
  return LANGS.find((code) => nav.startsWith(code)) ?? "pt";
}

export function useLang() {
  const [lang, setLangState] = useState<Lang>(detectLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORE_KEY, next);
    } catch {
      /* nothing to recover from: the choice simply does not persist */
    }
  }, []);

  const copy = COPY[lang];

  useEffect(() => {
    document.documentElement.lang = copy.htmlLang;
    document.documentElement.dir = copy.dir;
    document.title = copy.meta.title;
    const set = (selector: string, attr: string, value: string) => {
      const el = document.head.querySelector(selector);
      if (el) el.setAttribute(attr, value);
    };
    set('meta[name="description"]', "content", copy.meta.description);
    set('meta[property="og:title"]', "content", copy.meta.title);
    set('meta[property="og:description"]', "content", copy.meta.description);
    set('meta[property="og:image:alt"]', "content", copy.meta.ogAlt);
    set('meta[property="og:locale"]', "content", copy.ogLocale);
  }, [copy]);

  return { lang, setLang, copy };
}

/** Which sheet region the reader is currently standing in. */
export function useActiveRegion(ids: string[]) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const seen = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          seen.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        let best = ids[0];
        let bestRatio = 0;
        for (const id of ids) {
          const ratio = seen.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }
        if (bestRatio > 0) setActive(best);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.15, 0.5, 1] },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [ids]);

  return active;
}

/** Column count for the workforce tally, derived from the drawn width. */
export function useTallyColumns(ref: React.RefObject<HTMLElement | null>) {
  const [cols, setCols] = useState(40);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      // ~13px per mark keeps a permanent mark and a seasonal mark
      // distinguishable at arm's length on a phone.
      setCols(Math.max(14, Math.min(48, Math.floor(w / 13))));
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, [ref]);

  return cols;
}
