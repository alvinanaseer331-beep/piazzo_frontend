export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  light?: boolean;
}) {
  return (
    <div
      className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : "text-left"}`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-[0.18em] ${
          light ? "text-flame" : "text-flame"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-3 font-[family-name:var(--font-outfit)] text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl ${
          light ? "text-white" : "text-charcoal"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-4 text-base leading-relaxed sm:text-lg ${
            light ? "text-white/65" : "text-ash"
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
