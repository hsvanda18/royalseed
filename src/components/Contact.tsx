import { useState } from "react";
import { CONTACT, FACTS, type Copy } from "../content";
import { useInk } from "../lib/hooks";

const cellBorder = "border-[color-mix(in_srgb,var(--color-paper)_20%,transparent)]";
const softText = "text-[color-mix(in_srgb,var(--color-paper)_66%,var(--color-plate))]";
const link =
  "underline decoration-[color-mix(in_srgb,var(--color-gold-bright)_60%,transparent)] decoration-1 underline-offset-4 transition-colors duration-300 hover:text-gold-bright";

/**
 * The title block. On a real plan this is where the drawing says who made
 * it and where, so it holds the addresses, set compactly beside the one
 * thing a visitor came here to do: write. Both columns are held to about
 * one screen.
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
      <div className="mx-auto max-w-[var(--sheet-max)] px-5 py-10 sm:px-8 lg:py-12">
        <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
          <h2
            className="figure-xl ink-in text-[clamp(2.2rem,4vw,3rem)] text-paper"
            style={{ "--d": "0ms" } as React.CSSProperties}
          >
            {c.title}
          </h2>
          <p
            className={`ink-in text-[1rem] leading-relaxed ${softText}`}
            style={{ "--d": "80ms" } as React.CSSProperties}
          >
            {c.lede}
          </p>
        </div>

        <div className="mt-7 grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)]">
          {/* The block itself: ruled cells, as drawn. */}
          <div
            className={`ink-in grid grid-cols-1 content-start border-t ${cellBorder} sm:grid-cols-2 lg:content-stretch`}
            style={{ "--d": "160ms" } as React.CSSProperties}
          >
            <Cell label={c.officeLabel}>
              <address className="not-italic">{CONTACT.office}</address>
            </Cell>

            <Cell label={c.siteLabel}>
              <address className="not-italic">{CONTACT.site}</address>
            </Cell>

            <Cell label={c.emailLabel}>
              <ul className="space-y-1">
                {CONTACT.emails.map((email) => (
                  <li key={email}>
                    <a href={`mailto:${email}`} className={link} dir="ltr">
                      {email}
                    </a>
                  </li>
                ))}
              </ul>
            </Cell>

            <Cell label={c.phoneLabel}>
              <ul className="space-y-1">
                {CONTACT.phones.map((phone) => (
                  <li key={phone}>
                    <a
                      href={`tel:+244${phone.replace(/\s/g, "")}`}
                      className={`tabular-nums ${link}`}
                      dir="ltr"
                    >
                      {phone}
                    </a>
                  </li>
                ))}
              </ul>
            </Cell>

            {/* Reserved, not linked: these accounts do not exist yet. */}
            <Cell label={c.socialLabel} className="sm:col-span-2">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <ul className="flex flex-wrap gap-1.5">
                  {CONTACT.socialPlanned.map((name) => (
                    <li
                      key={name}
                      className={`annot-sm border border-dashed px-2 py-1 ${cellBorder} ${softText}`}
                    >
                      {name}
                    </li>
                  ))}
                </ul>
                <p className={`annot-sm ${softText}`}>{c.socialNote}</p>
              </div>
            </Cell>
          </div>

          <MessageForm copy={copy} />
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
    <div className={`border-b ${cellBorder} py-3.5 sm:pe-6 ${className}`}>
      <p className="annot-sm text-gold-bright">{label}</p>
      <div className={`mt-1.5 text-[0.9375rem] leading-relaxed ${softText}`}>{children}</div>
    </div>
  );
}

type Status = "idle" | "sending" | "sent" | "error";

const fieldClass = `mt-1.5 block w-full border ${cellBorder} bg-[color-mix(in_srgb,var(--color-paper)_5%,transparent)] px-3 py-2.5 text-[1rem] text-paper placeholder:text-[color-mix(in_srgb,var(--color-paper)_40%,transparent)] transition-colors duration-300 focus:border-gold-bright focus:outline-none`;

/**
 * Writes straight to the company's main inbox. The site is static, so
 * delivery is relayed by the endpoint in CONTACT.formEndpoint; if that
 * fails, the visitor is handed the address instead of a dead end.
 */
function MessageForm({ copy }: { copy: Copy }) {
  const f = copy.contact.form;
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Bots fill every field; people never see this one.
    if (data.get("_honey")) return;

    setStatus("sending");
    try {
      const res = await fetch(CONTACT.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          _subject: f.subject,
          _template: "table",
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { success?: string | boolean };
      if (!res.ok || String(json.success) === "false") throw new Error("not delivered");
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const mainEmail = CONTACT.emails[0];

  return (
    <div
      className={`ink-in border ${cellBorder} p-5 sm:p-6`}
      style={{ "--d": "220ms" } as React.CSSProperties}
    >
      <h3 className="font-display text-[1.35rem] font-semibold leading-tight text-paper">
        {f.title}
      </h3>

      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input
          type="text"
          name="_honey"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="hidden"
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="annot-sm text-gold-bright">{f.name}</span>
            <input name="name" type="text" required autoComplete="name" className={fieldClass} />
          </label>

          <label className="block">
            <span className="annot-sm text-gold-bright">{f.email}</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              dir="ltr"
              className={`${fieldClass} rtl:text-end`}
            />
          </label>
        </div>

        <label className="block">
          <span className="annot-sm text-gold-bright">{f.message}</span>
          <textarea name="message" required rows={3} className={`${fieldClass} resize-y`} />
        </label>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="annot inline-flex w-full items-center justify-center gap-2 bg-gold-bright px-5 py-3 text-plate transition-colors duration-300 hover:bg-paper disabled:cursor-wait disabled:opacity-70 sm:w-auto"
        >
          {status === "sending" ? f.sending : f.send}
        </button>

        <p role="status" aria-live="polite" className="min-w-0 flex-1 text-[0.875rem] leading-snug">
          {status === "sent" && <span className="text-paper">{f.sent}</span>}
          {status === "error" && (
            <span className={softText}>
              {f.error}{" "}
              <a href={`mailto:${mainEmail}`} className={link} dir="ltr">
                {mainEmail}
              </a>
              .
            </span>
          )}
        </p>
        </div>
      </form>
    </div>
  );
}

export function Colophon({ copy }: { copy: Copy }) {
  const col = copy.colophon;
  return (
    <footer className="on-plate relative z-10 border-t border-[color-mix(in_srgb,var(--color-paper)_20%,transparent)] bg-plate text-paper">
      <div className="mx-auto grid max-w-[var(--sheet-max)] items-center gap-x-10 gap-y-4 px-5 py-5 sm:px-8 md:grid-cols-[auto_minmax(0,1fr)_auto]">
        {/* The mark, reversed for the plate: a colour treatment of the
            supplied artwork, never a recreation of it. */}
        <div className="flex items-center gap-4">
          <img
            src="/assets/royalseed-mark-reversed.png"
            width={686}
            height={322}
            alt="Royalseed Agro"
            loading="lazy"
            decoding="async"
            className="h-10 w-auto"
          />
          <p className={`annot-sm ${softText}`}>
            {CONTACT.domain}
            <br />
            {col.company} · {FACTS.founded}
          </p>
        </div>

        {/* What is still missing is stated on the sheet, not hidden. */}
        <p className={`annot-sm ${softText}`}>
          <span className="text-gold-bright">{col.pendingTitle}:</span> {col.pending.join(" · ")}
        </p>

        <p className={`annot-sm md:text-end ${softText}`}>
          {col.sheetLine}
          <br />© {new Date().getFullYear()} {col.company}. {col.rights}
        </p>
      </div>
    </footer>
  );
}
