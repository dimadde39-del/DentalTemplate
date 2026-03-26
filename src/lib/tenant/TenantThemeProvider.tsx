import {
  DEFAULT_CLINIC_VARIANT,
  FONT_VARIABLES,
  type ClinicVariant,
  VARIANTS,
} from "./variants";

interface TenantThemeProviderProps {
  readonly variant?: ClinicVariant;
  readonly accent?: string | null;
  readonly children: React.ReactNode;
}

export function TenantThemeProvider({
  variant = DEFAULT_CLINIC_VARIANT,
  accent,
  children,
}: TenantThemeProviderProps) {
  const definition = VARIANTS[variant];
  const isPremiumMed = variant === "premium-med";

  const cssVariables = {
    ...definition.tokens,
    "--font-heading": FONT_VARIABLES[definition.fonts.heading],
    "--font-body": FONT_VARIABLES[definition.fonts.body],
    ...(accent?.trim() ? { "--accent": accent.trim() } : {}),
  } as Record<`--${string}`, string>;

  const style = {
    ...cssVariables,
    colorScheme: definition.colorScheme,
    color: "var(--text)",
    fontFamily: "var(--font-body), Arial, Helvetica, sans-serif",
  } as React.CSSProperties;

  const backgroundStyle = {
    backgroundImage: isPremiumMed
      ? "radial-gradient(circle at 82% 10%, var(--ambient), transparent 20%), linear-gradient(180deg, var(--page-top) 0%, var(--bg) 44%, var(--page-bottom) 100%)"
      : "radial-gradient(circle at 15% 15%, color-mix(in oklab, var(--accent) 12%, transparent), transparent 22%), radial-gradient(circle at 82% 18%, var(--ambient), transparent 18%), linear-gradient(180deg, var(--page-top) 0%, var(--bg) 36%, var(--page-bottom) 100%)",
  } as React.CSSProperties;

  const gridStyle = {
    backgroundImage:
      "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
    backgroundSize: isPremiumMed ? "96px 96px" : "80px 80px",
    maskImage: isPremiumMed
      ? "linear-gradient(180deg, transparent 0%, black 18%, black 82%, transparent 100%)"
      : "radial-gradient(circle at center, black 42%, transparent 95%)",
    opacity: "var(--grid-opacity)",
  } as React.CSSProperties;

  const noiseStyle = {
    backgroundImage: "radial-gradient(var(--noise-dot) 0.5px, transparent 0.5px)",
    backgroundSize: "5px 5px",
    opacity: "var(--noise-opacity)",
  } as React.CSSProperties;

  return (
    <div
      data-variant={variant}
      style={style}
      className="relative min-h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={backgroundStyle} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={gridStyle} />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 ${isPremiumMed ? "" : "mix-blend-soft-light"}`}
        style={noiseStyle}
      />
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
}
