import { motion } from "framer-motion";

type Variant = "mono" | "accent";

/**
 * Zalaltor brand mark.
 *
 * Rebuilt from the uploaded logo as clean SVG so it renders crisp at any size,
 * inherits currentColor for the mono variant, and picks up the site's brand
 * gradient (--brand → --accent2) for the accent variant.
 *
 * The mark: a rounded circle field containing two tall rounded "1" pillars,
 * with the vertical wordmark "Zalaltor" set inside the left pillar — matching
 * the original identity while feeling native to the site's luxury aesthetic.
 */
export function ZalaltorMark({
  size = 32,
  variant = "accent",
  className = "",
  animated = true,
}: {
  size?: number;
  variant?: Variant;
  className?: string;
  animated?: boolean;
}) {
  const gradId = `zalaltor-grad-${variant}`;
  const useGradient = variant === "accent";

  const Wrapper = animated ? motion.svg : "svg";
  const wrapperProps = animated
    ? {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
        whileHover: { rotate: -3, scale: 1.05 },
      }
    : {};

  return (
    <Wrapper
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-label="Zalaltor"
      role="img"
      {...wrapperProps}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--brand)" />
          <stop offset="100%" stopColor="var(--accent2)" />
        </linearGradient>
        <radialGradient id={`${gradId}-glow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Circular field */}
      <circle cx="50" cy="50" r="48" fill="var(--ink)" />
      {useGradient && (
        <circle cx="50" cy="50" r="48" fill={`url(#${gradId}-glow)`} />
      )}
      <circle
        cx="50"
        cy="50"
        r="47"
        fill="none"
        stroke={useGradient ? `url(#${gradId})` : "currentColor"}
        strokeOpacity={useGradient ? 0.55 : 0.35}
        strokeWidth="1"
      />

      {/* Left "1" pillar with vertical Zalaltor wordmark inside */}
      <g>
        <rect
          x="30"
          y="20"
          width="14"
          height="60"
          rx="7"
          fill={useGradient ? `url(#${gradId})` : "currentColor"}
        />
        <text
          x="37"
          y="50"
          textAnchor="middle"
          dominantBaseline="middle"
          transform="rotate(-90 37 50)"
          fill="var(--ink)"
          fontFamily="var(--font-display), system-ui, sans-serif"
          fontSize="8"
          fontWeight="700"
          letterSpacing="0.5"
        >
          Zalaltor
        </text>
      </g>

      {/* Right "1" pillar */}
      <rect
        x="56"
        y="20"
        width="14"
        height="60"
        rx="7"
        fill={useGradient ? `url(#${gradId})` : "currentColor"}
      />
    </Wrapper>
  );
}

/**
 * Full lockup: mark + wordmark. Used in header and footer.
 */
export function ZalaltorLogo({
  size = 32,
  variant = "accent",
  showWordmark = true,
  className = "",
}: {
  size?: number;
  variant?: Variant;
  showWordmark?: boolean;
  className?: string;
}) {
  return (
    <span className={`group inline-flex items-center gap-2.5 ${className}`}>
      <ZalaltorMark size={size} variant={variant} />
      {showWordmark && (
        <span className="font-display text-lg font-semibold tracking-wide">
          Zalaltor
        </span>
      )}
    </span>
  );
}