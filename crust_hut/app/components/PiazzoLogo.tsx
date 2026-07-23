type PiazzoLogoProps = {
  variant?: "full" | "mark" | "wordmark";
  /** Applied to the outer wrapper */
  className?: string;
  /** Mark size in px (width & height) */
  markSize?: number;
  /** Wordmark text color class */
  wordmarkClassName?: string;
  /** Icon fill treatment for dark or light surfaces */
  tone?: "onDark" | "onLight" | "brand";
};

/**
 * PIAZZO brand mark — wood-fired oven arch with a refined flame ember.
 * Minimal, geometric, built for international hospitality.
 */
export default function PiazzoLogo({
  variant = "full",
  className = "",
  markSize = 36,
  wordmarkClassName = "text-white",
  tone = "brand",
}: PiazzoLogoProps) {
  const flame = tone === "onLight" ? "#E22B20" : "#E22B20";
  const structure =
    tone === "onLight" ? "#121212" : tone === "onDark" ? "#FFFFFF" : "#FFFFFF";
  const structureMuted =
    tone === "onLight" ? "#121212" : "rgba(255,255,255,0.92)";

  const mark = (
    <svg
      width={markSize}
      height={markSize}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={variant !== "mark"}
      role={variant === "mark" ? "img" : undefined}
      aria-label={variant === "mark" ? "PIAZZO" : undefined}
    >
      {/* Soft tile / craft plate */}
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="12"
        stroke={structureMuted}
        strokeWidth="1.5"
        fill={tone === "brand" ? "rgba(226,43,32,0.12)" : "transparent"}
      />
      {/* Oven mouth — arched opening */}
      <path
        d="M14 34V22.5C14 16.15 19.15 11 25.5 11C31.85 11 37 16.15 37 22.5V34"
        stroke={structure}
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Hearth base */}
      <path
        d="M12 34H39"
        stroke={structure}
        strokeWidth="2.25"
        strokeLinecap="round"
      />
      {/* Ember / flame — artisan fire */}
      <path
        d="M24 30c0-3.2 2.1-5.1 2.1-7.4 0-.4-.1-.8-.2-1.2 1.6 1.1 2.7 2.9 2.7 5 0 2.3-1.8 4.1-2.6 5.1-.2.2-.5.1-.6-.1-.3-.7-.7-1.4-1.4-1.4Z"
        fill={flame}
      />
      <path
        d="M22.2 28.8c.4-1.8 1.5-2.9 1.5-4.6 0-1.2-.5-2.2-1.1-3 .9 2.2.4 3.5.4 4.8 0 1.1-.3 1.9-.8 2.8Z"
        fill={flame}
        opacity="0.7"
      />
    </svg>
  );

  const wordmark = (
    <span
      className={`font-[family-name:var(--font-outfit)] text-lg font-bold tracking-[-0.03em] sm:text-xl ${wordmarkClassName}`}
    >
      PIAZZO
    </span>
  );

  if (variant === "mark") return <span className={className}>{mark}</span>;
  if (variant === "wordmark") return <span className={className}>{wordmark}</span>;

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {mark}
      {wordmark}
    </span>
  );
}
