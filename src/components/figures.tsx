/**
 * Every mark in this file is drawn for this sheet, on one 32-unit grid at
 * one stroke weight, in the plan's own line grammar. No icon library, no
 * glyph substitutes: a survey drawing letters and draws its own symbols.
 */

type MarkProps = { className?: string };

const box = {
  viewBox: "0 0 32 32",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false as unknown as boolean,
};

/* ── Values ─────────────────────────────────────────────────────────────── */

/** Sustainability — contour lines over a watercourse. */
export const MarkContour = ({ className }: MarkProps) => (
  <svg {...box} className={className}>
    <path d="M2 22c5-6 9 4 14-2s9 2 14-4" />
    <path d="M2 27c5-6 9 4 14-2s9 2 14-4" opacity="0.55" />
    <path d="M8 4v9M8 13l4-3M8 13l-4-3" />
  </svg>
);

/** Innovation — a fertigation line and its emitter. */
export const MarkEmitter = ({ className }: MarkProps) => (
  <svg {...box} className={className}>
    <path d="M2 11h28" />
    <path d="M16 11v6" />
    <path d="M16 17c-2.4 3-3.6 4.6-3.6 6.4a3.6 3.6 0 0 0 7.2 0c0-1.8-1.2-3.4-3.6-6.4Z" />
    <path d="M6 9v4M26 9v4" opacity="0.55" />
  </svg>
);

/** Quality — a grading caliper on fruit. */
export const MarkCaliper = ({ className }: MarkProps) => (
  <svg {...box} className={className}>
    <circle cx="16" cy="18" r="7.5" />
    <path d="M4 6v18M28 6v18" />
    <path d="M4 6h9M28 6h-9" />
  </svg>
);

/** Integrity — a survey monument: the point everything else is measured from. */
export const MarkMonument = ({ className }: MarkProps) => (
  <svg {...box} className={className}>
    <path d="M16 5 25 21H7Z" />
    <circle cx="16" cy="16" r="1.6" fill="currentColor" stroke="none" />
    <path d="M4 26h24" />
    <path d="M11 21v5M21 21v5" opacity="0.55" />
  </svg>
);
