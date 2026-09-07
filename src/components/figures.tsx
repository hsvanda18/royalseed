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

/* ── Production pillars ─────────────────────────────────────────────────── */

/** Fertigation — main line, lateral, tree. */
export const MarkFertigation = ({ className }: MarkProps) => (
  <svg {...box} className={className}>
    <path d="M2 8h28" />
    <path d="M9 8v7M23 8v7" />
    <path d="M9 15c-1.8 2.3-2.7 3.5-2.7 4.8a2.7 2.7 0 0 0 5.4 0c0-1.3-.9-2.5-2.7-4.8Z" />
    <path d="M23 15c-1.8 2.3-2.7 3.5-2.7 4.8a2.7 2.7 0 0 0 5.4 0c0-1.3-.9-2.5-2.7-4.8Z" />
    <path d="M2 27h28" opacity="0.55" />
  </svg>
);

/** Certified seedlings — the graft union, marked. */
export const MarkSeedling = ({ className }: MarkProps) => (
  <svg {...box} className={className}>
    <path d="M16 28V11" />
    <path d="M16 15c-3.6 0-6-2.2-6-5.4 3.6 0 6 2.2 6 5.4Z" />
    <path d="M16 13c3.6 0 6-2.2 6-5.4-3.6 0-6 2.2-6 5.4Z" />
    <path d="M11 20h10" />
    <path d="M8 28h16" opacity="0.55" />
  </svg>
);

/** Good practice — a pruned crown, open centre. */
export const MarkCrown = ({ className }: MarkProps) => (
  <svg {...box} className={className}>
    <path d="M16 28v-9" />
    <path d="M16 19 8 11M16 19l8-8" />
    <path d="M8 11V5M24 11V5" />
    <path d="M4 15l4-4M28 15l-4-4" opacity="0.55" />
    <path d="M8 28h16" opacity="0.55" />
  </svg>
);

/** Technical management — the instrument on its tripod. */
export const MarkInstrument = ({ className }: MarkProps) => (
  <svg {...box} className={className}>
    <rect x="10" y="5" width="12" height="7" />
    <path d="M22 8.5h5" />
    <path d="M16 12v4" />
    <path d="M16 16 7 28M16 16l9 12M16 16v12" />
  </svg>
);

/** Environmental sustainability — the soil profile. */
export const MarkSoil = ({ className }: MarkProps) => (
  <svg {...box} className={className}>
    <path d="M3 10h26M3 17h26M3 24h26" />
    <path d="M3 6v22M29 6v22" />
    <path d="M10 10V6M20 10V6" opacity="0.55" />
    <path d="M6 20.5h3M13 20.5h4M22 20.5h3" opacity="0.55" />
  </svg>
);

/** Organised for certification — the stamped block. */
export const MarkStamp = ({ className }: MarkProps) => (
  <svg {...box} className={className}>
    <rect x="4" y="7" width="24" height="18" />
    <path d="M4 13h24" />
    <path d="M9 19h6M9 22h10" opacity="0.55" />
    <circle cx="22" cy="20" r="4.5" />
    <path d="m20 20 1.6 1.6L24.2 18.4" />
  </svg>
);

/* ── Fig. 1 — the fruit itself ──────────────────────────────────────────── */

/**
 * Persea americana cv. Hass, longitudinal section. Drawn as a technical
 * figure with leader lines, the way a monograph plate is drawn — not as a
 * photograph substitute, and not pretending to be one.
 */
export function HassFigure({
  labels,
  className,
}: {
  labels: { key: string; label: string }[];
  className?: string;
}) {
  const by = (k: string) => labels.find((l) => l.key === k)?.label ?? "";

  return (
    <svg
      viewBox="0 0 520 430"
      className={className}
      role="img"
      aria-label={by("skin")}
      fill="none"
      stroke="currentColor"
    >
      {/* Fruit outline: pyriform, narrow at the neck, widest low in the
          bulb — the Hass silhouette, not a generic pear. */}
      <path
        d="M260 52c22 0 36 22 38 56 2 32 4 44 20 68 28 42 44 78 44 118 0 50-44 90-102 90s-102-40-102-90c0-40 16-76 44-118 16-24 18-36 20-68 2-34 16-56 38-56Z"
        strokeWidth="2"
        className="draw"
        style={{ "--len": 1000, "--d": "60ms" } as React.CSSProperties}
      />

      {/* Stem. */}
      <path
        d="M260 52V22"
        strokeWidth="2.6"
        className="draw"
        style={{ "--len": 34, "--d": "0ms" } as React.CSSProperties}
      />

      {/* The rind is thick, and on a Hass that thickness is the product's
          case: it travels. */}
      <path
        d="M206 196c-24 38-38 70-38 104 0 42 40 74 92 74s92-32 92-74c0-34-14-66-38-104"
        strokeWidth="1.3"
        opacity="0.55"
        className="draw"
        style={{ "--len": 520, "--d": "340ms" } as React.CSSProperties}
      />

      {/* Stone. */}
      <ellipse
        cx="260"
        cy="306"
        rx="56"
        ry="60"
        strokeWidth="1.7"
        className="draw"
        style={{ "--len": 380, "--d": "500ms" } as React.CSSProperties}
      />
      <path
        d="M228 268c-9 14-13 30-13 46"
        strokeWidth="1.1"
        opacity="0.45"
        className="draw"
        style={{ "--len": 60, "--d": "640ms" } as React.CSSProperties}
      />

      {/* Pebbling, seated on the outline itself. */}
      <g opacity="0.32" strokeWidth="1">
        {[
          [172, 268],
          [161, 312],
          [172, 356],
          [200, 386],
          [348, 268],
          [359, 312],
          [348, 356],
          [320, 386],
        ].map(([x, y], i) => (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx="6"
            ry="4.5"
            className="wash-in"
            style={{ "--d": `${720 + i * 40}ms` } as React.CSSProperties}
          />
        ))}
      </g>

      {/* Leaders. Single-word entries only: anything longer runs off the
          plate at the widths this figure is drawn at. */}
      <g
        className="wash-in"
        style={{ "--d": "900ms" } as React.CSSProperties}
        strokeWidth="1"
      >
        <path d="M272 30h86" />
        <circle cx="272" cy="30" r="2.5" fill="currentColor" stroke="none" />
        <text x="366" y="34" className="annot-sm" fontSize="12.5" fill="currentColor" stroke="none">
          {by("stem")}
        </text>

        <path d="M162 312H108" />
        <circle cx="162" cy="312" r="2.5" fill="currentColor" stroke="none" />
        <text
          x="100"
          y="316"
          textAnchor="end"
          className="annot-sm"
          fontSize="12.5"
          fill="currentColor"
          stroke="none"
        >
          {by("skin")}
        </text>

        <path d="M190 232H124" />
        <circle cx="190" cy="232" r="2.5" fill="currentColor" stroke="none" />
        <text
          x="116"
          y="236"
          textAnchor="end"
          className="annot-sm"
          fontSize="12.5"
          fill="currentColor"
          stroke="none"
        >
          {by("flesh")}
        </text>

        <path d="M312 330h94" />
        <circle cx="312" cy="330" r="2.5" fill="currentColor" stroke="none" />
        <text x="414" y="334" className="annot-sm" fontSize="12.5" fill="currentColor" stroke="none">
          {by("stone")}
        </text>
      </g>
    </svg>
  );
}
