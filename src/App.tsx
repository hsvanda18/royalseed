import { Charter } from "./components/Charter";
import { Colophon, Contact } from "./components/Contact";
import { Method } from "./components/Method";
import { Origin } from "./components/Origin";
import { Overview } from "./components/Overview";
import { Product } from "./components/Product";
import { SheetHeader } from "./components/SheetHeader";
import { Workforce } from "./components/Workforce";
import { useLang } from "./lib/hooks";

export default function App() {
  const { lang, setLang, copy } = useLang();

  return (
    <>
      <a
        href="#plan"
        className="annot-sm sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:border focus:border-ink focus:bg-paper focus:px-4 focus:py-3 focus:text-ink"
      >
        {copy.ui.skipToContent}
      </a>

      <SheetHeader copy={copy} lang={lang} setLang={setLang} />

      {/* Re-keying on language forces the drafting-hand entrances to replay
          for whichever regions are on screen, rather than leaving a
          half-inked sheet holding the other language's measure. */}
      <main key={lang}>
        <Overview copy={copy} />
        <Charter copy={copy} />
        <Product copy={copy} />
        <Method copy={copy} />
        <Origin copy={copy} />
        <Workforce copy={copy} />
        <Contact copy={copy} />
      </main>

      <Colophon copy={copy} />
    </>
  );
}
