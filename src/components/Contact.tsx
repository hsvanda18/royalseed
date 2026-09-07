import { CONTACT, FACTS, type Copy } from "../content";
import { useInk } from "../lib/hooks";


const cellBorder =
  "border-[color-mix(in_srgb,var(--color-paper)_20%,transparent)]";
const softText = "text-[color-mix(in_srgb,var(--color-paper)_66%,var(--color-plate))]";

/**
 * The title block. On a real plan this is where the drawing says who made
 * it, where, and when — so it is where the site puts its addresses, and the
 * mark ships reversed for the plate — a colour treatment of the supplied
 * artwork, never a recreation of it.
 */
export function Contact({ copy }: { copy: Copy }) {
  const { ref, inkAttr } = useInk<HTMLElement>();
  const c = copy.contact;

  return (
    <section
      id="contact"
      ref={ref}
      {...inkAttr}
      className="on-plate relative z-10 bg-plate text-paper"
    >
      <div className="mx-auto max-w-[var(--sheet-max)] px-5 py-20 sm:px-8 sm:py-24 lg:py-28">
        <div className="grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end">
          <h2
            className="figure-xl ink-in text-[clamp(2.4rem,5.6vw,4rem)] text-paper"
            style={{ "--d": "0ms" } as React.CSSProperties}
          >
            {c.title}
          </h2>
          <p
            className={`ink-in text-[1.0625rem] leading-relaxed ${softText}`}
            style={{ "--d": "90ms" } as React.CSSProperties}
          >
            {c.lede}
          </p>
        </div>

        <a
          href={`mailto:${CONTACT.emails[0]}`}
          className="ink-in mt-10 inline-block border-b-2 border-gold-bright pb-2 font-display text-[clamp(1.75rem,4.6vw,3rem)] font-semibold leading-none text-gold-bright transition-colors duration-300 hover:border-paper hover:text-paper"
          style={{ "--d": "170ms" } as React.CSSProperties}
        >
          {c.cta}
        </a>

        {/* The block itself: ruled cells, as drawn. */}
        <div
          className={`ink-in mt-14 grid grid-cols-1 border-t ${cellBorder} sm:grid-cols-2 lg:grid-cols-4`}
          style={{ "--d": "250ms" } as React.CSSProperties}
        >
          <Cell label={c.officeLabel}>
            <address className="not-italic">{CONTACT.office}</address>
          </Cell>

          <Cell label={c.siteLabel}>
            <address className="not-italic">{CONTACT.site}</address>
          </Cell>

          <Cell label={c.emailLabel}>
            <ul className="space-y-1.5">
              {CONTACT.emails.map((email) => (
                <li key={email}>
                  <a
                    href={`mailto:${email}`}
                    className="underline decoration-[color-mix(in_srgb,var(--color-gold-bright)_60%,transparent)] decoration-1 underline-offset-4 transition-colors duration-300 hover:text-gold-bright"
                  >
                    {email}
                  </a>
                </li>
              ))}
            </ul>
          </Cell>

          <Cell label={c.phoneLabel}>
            <ul className="space-y-1.5">
              {CONTACT.phones.map((phone) => (
                <li key={phone}>
                  <a
                    href={`tel:+244${phone.replace(/\s/g, "")}`}
                    className="tabular-nums underline decoration-[color-mix(in_srgb,var(--color-gold-bright)_60%,transparent)] decoration-1 underline-offset-4 transition-colors duration-300 hover:text-gold-bright"
                  >
                    {phone}
                  </a>
                </li>
              ))}
            </ul>
          </Cell>

          {/* Reserved, not linked: these accounts do not exist yet. */}
          <Cell label={c.socialLabel} className="sm:col-span-2">
            <ul className="flex flex-wrap gap-2">
              {CONTACT.socialPlanned.map((name) => (
                <li
                  key={name}
                  className={`annot-sm border border-dashed px-2.5 py-1.5 ${cellBorder} ${softText}`}
                >
                  {name}
                </li>
              ))}
            </ul>
            <p className={`annot-sm mt-3 ${softText}`}>{c.socialNote}</p>
          </Cell>

          {/* The mark, reversed for the plate. A light box around it here read
              as a failed knockout at the page's last impression. */}
          <Cell label={CONTACT.domain} className="sm:col-span-2">
            <img
              src="/assets/royalseed-logo-reversed.png"
              width={742}
              height={382}
              alt="Royalseed Agro"
              loading="lazy"
              decoding="async"
              className="h-12 w-auto"
            />
            <p className={`annot-sm mt-4 ${softText}`}>
              {copy.colophon.company} · {FACTS.founded}
            </p>
          </Cell>
        </div>
      </div>
    </section>
  );
}

function Cell({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`border-b ${cellBorder} px-0 py-6 sm:px-6 sm:first:pl-0 ${className}`}>
      <p className="annot-sm text-gold-bright">{label}</p>
      <div className={`mt-3 text-[0.9375rem] leading-relaxed ${softText}`}>{children}</div>
    </div>
  );
}

export function Colophon({ copy }: { copy: Copy }) {
  const col = copy.colophon;
  return (
    <footer className="on-plate relative z-10 border-t border-[color-mix(in_srgb,var(--color-paper)_20%,transparent)] bg-plate text-paper">
      <div className="mx-auto max-w-[var(--sheet-max)] px-5 py-9 sm:px-8">
        {/* What is still missing is stated on the sheet, not hidden. */}
        <div className="mb-8">
          <p className="annot-sm text-gold-bright">{col.pendingTitle}</p>
          <ul className={`annot-sm mt-2.5 space-y-1 ${softText}`}>
            {col.pending.map((item) => (
              <li key={item}>— {item}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3 border-t border-[color-mix(in_srgb,var(--color-paper)_14%,transparent)] pt-6 sm:flex-row sm:items-baseline sm:justify-between">
          <p className={`annot-sm ${softText}`}>{col.sheetLine}</p>
          <p className={`annot-sm ${softText}`}>
            © {new Date().getFullYear()} {col.company}. {col.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
