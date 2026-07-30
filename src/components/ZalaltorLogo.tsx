import { motion } from "framer-motion";
import logoSrc from "@/assets/brand/zalaltor-logo.svg";

type Variant = "mono" | "accent";

/**
 * Zalaltor brand mark — the actual studio logo (black disc, silver "Z",
 * gold ascending stroke). Rendered as an image so it always matches the
 * real identity, with a subtle gold glow and hover lift to feel native to
 * the site's premium interactions.
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
  const Wrapper = animated ? motion.span : "span";
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
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full ${className}`}
      style={{ width: size, height: size }}
      aria-label="Zalaltor"
      role="img"
      {...wrapperProps}
    >
      {variant === "accent" && (
        <span
          className="pointer-events-none absolute -inset-1 rounded-full blur-md"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--brand) 45%, transparent) 0%, transparent 70%)",
          }}
        />
      )}
      <img
        src={logoSrc}
        alt="Zalaltor Studio logo"
        width={size}
        height={size}
        className="relative h-full w-full rounded-full object-cover"
        style={{
          boxShadow:
            variant === "accent"
              ? "0 0 0 1px color-mix(in oklab, var(--brand) 45%, transparent)"
              : "0 0 0 1px color-mix(in oklab, var(--foreground) 20%, transparent)",
        }}
      />
    </Wrapper>
  );
}

/**
 * Full lockup: mark + wordmark. Used in header and footer.
 */
export function ZalaltorLogo({
  size = 36,
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
    <span className={`group inline-flex items-center gap-3 ${className}`}>
      <ZalaltorMark size={size} variant={variant} />
      {showWordmark && (
        <span className="font-display text-xl font-semibold tracking-[0.18em] text-primary">
          Zalaltor Studio
        </span>
      )}
    </span>
  );
}