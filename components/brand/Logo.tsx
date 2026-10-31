// components/brand/Logo.tsx — brand artwork from /jatin-rane-brandkit, inlined.
// Both mark and wordmark ship as paths so they cost no extra request, stay
// crisp at the footer's giant size, and never get re-typeset in a webfont
// (the kit forbids it). Theming is per-file: the mark follows `currentColor`,
// the wordmark carries its own three fills via `theme`.

const MARK =
  "M108 262 L66 172 L138 198 L122 98 L198 160 L226 48 L270 148 L322 64 L338 168 L412 104 L396 212 L452 196 L404 262 C404 360 340 442 256 454 C172 442 108 360 108 262 Z M200 222 H316 V350 C316 400 286 424 246 424 C214 424 192 408 184 384 L222 368 C227 380 236 388 248 388 C268 388 276 372 276 350 V258 H200 Z M126 280 L186 298 L182 316 L130 308 Z M392 280 L338 298 L342 316 L388 308 Z M150 192 L205 172 L252 196 L308 170 L372 190 L368 202 L308 184 L252 208 L205 186 L156 208 Z";
const SIMPLE =
  "M108 262 L84 120 L180 190 L256 40 L332 190 L428 120 L404 262 C404 360 340 442 256 454 C172 442 108 360 108 262 Z M200 222 H316 V350 C316 400 286 424 246 424 C214 424 192 408 184 384 L222 368 C227 380 236 388 248 388 C268 388 276 372 276 350 V258 H200 Z";

type MarkProps = React.SVGProps<SVGSVGElement> & {
  /** "full" = mascot with eyes + hairline. "simple" = required under 28px. */
  detail?: "full" | "simple";
  /** Accessible name. Pass "" when the mark sits inside a labelled link. */
  title?: string;
  height?: number;
  /** Tailwind text-colour class — Aura on Ink, Ember on Paper. */
  colorClass?: string;
};

export function JrMark({
  detail = "full",
  title = "Jatin Rane",
  height = 40,
  colorClass,
  className = "",
  ...rest
}: MarkProps) {
  const simple = detail === "simple";
  const vb = simple ? "84 40 344 414" : "66 48 386 406";
  // The mark is 386×406 (≈0.95:1); the box is derived so nothing reflows.
  const width = Math.round((height * (simple ? 344 / 414 : 386 / 406)) * 10) / 10;
  return (
    <svg
      viewBox={vb}
      width={width}
      height={height}
      role={title ? "img" : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      fill="currentColor"
      className={`${colorClass ?? ""} ${className}`.trim()}
      {...rest}
    >
      <path fillRule="evenodd" d={simple ? SIMPLE : MARK} />
    </svg>
  );
}

// The name, as delivered vector artwork (01-logo/svg/jatin-rane-wordmark-*.svg).
// Inlined rather than loaded as an image: it is above the fold on phones, and
// two paths cost less than a request. Never re-typeset this in a webfont.
const NAME =
  "M51.48 87.624Q46.656 87.624 43.092 85.85999999999999Q39.528 84.09599999999999 37.008 80.928L44.568 73.65599999999999Q45.864 75.45599999999999 47.628 76.392Q49.391999999999996 77.32799999999999 51.623999999999995 77.32799999999999Q53.784 77.32799999999999 55.367999999999995 76.428Q56.952 75.52799999999999 57.888 73.83599999999998Q58.824 72.14399999999999 58.824 69.624V36.0H70.19999999999999V68.976Q70.19999999999999 74.66399999999999 67.89599999999999 78.83999999999999Q65.592 83.01599999999999 61.416 85.32Q57.239999999999995 87.624 51.48 87.624ZM78.984 86.832 100.62504 36.0H107.67096L129.31199999999998 86.832H116.3124L104.148 58.25939994011378L91.9836 86.832ZM151.344 86.832V36.72H162.648V86.832ZM135.432 45.864V36.0H178.56V45.864ZM188.49599999999998 86.832V36.0H199.79999999999998V86.832ZM213.19199999999998 86.832V36.0H221.112L224.49599999999998 46.151999999999994V86.832ZM248.25599999999997 86.832 218.304 48.455999999999996 221.112 36.0 251.064 74.37599999999999ZM248.25599999999997 86.832 245.232 76.67999999999999V36.0H256.536V86.832Z";
const SURNAME =
  "M296.56800000000004 65.88V57.52799999999999H307.29600000000005Q310.68000000000006 57.52799999999999 312.5160000000001 55.8Q314.35200000000003 54.071999999999996 314.35200000000003 51.12Q314.35200000000003 48.38399999999999 312.552 46.583999999999996Q310.75200000000007 44.784 307.36800000000005 44.784H296.56800000000004V36.0H308.66400000000004Q313.70400000000006 36.0 317.52000000000004 37.908Q321.336 39.815999999999995 323.49600000000004 43.199999999999996Q325.65600000000006 46.583999999999996 325.65600000000006 50.976Q325.65600000000006 55.44 323.49600000000004 58.788Q321.336 62.135999999999996 317.44800000000004 64.008Q313.56000000000006 65.88 308.30400000000003 65.88ZM287.92800000000005 86.832V36.0H299.232V86.832ZM315.576 86.832 299.73600000000005 64.94399999999999 310.10400000000004 62.135999999999996 328.968 86.832ZM334.656 86.832 356.29704000000004 36.0H363.34296L384.98400000000004 86.832H371.98440000000005L359.82000000000005 58.25939994011378L347.6556 86.832ZM394.56000000000006 86.832V36.0H402.48L405.86400000000003 46.151999999999994V86.832ZM429.624 86.832 399.672 48.455999999999996 402.48 36.0 432.432 74.37599999999999ZM429.624 86.832 426.6 76.67999999999999V36.0H437.90400000000005V86.832ZM451.29600000000005 86.832V36.0H462.6V86.832ZM459.93600000000004 86.832V77.03999999999999H487.8V86.832ZM459.93600000000004 65.592V56.16H485.28000000000003V65.592ZM459.93600000000004 45.72V36.0H487.44000000000005V45.72Z";

const WORDMARK_COLORS: Record<
  "dark" | "light" | "mono-black" | "mono-white",
  [string, string, string]
> = {
  dark: ["#f5f1e8", "var(--logo-aura)", "var(--logo-spark)"],
  light: ["#0a0a0a", "var(--logo-ember)", "#1d4ed8"],
  "mono-black": ["#0a0a0a", "#0a0a0a", "#0a0a0a"],
  "mono-white": ["#ffffff", "#ffffff", "#ffffff"],
};

/**
 * The name as delivered artwork. `theme` picks the kit's surface variant:
 * "dark" = light name + Aura surname + Spark pixel (for black surfaces),
 * "light" = ink name + Ember surname + Spark-deep pixel (for white surfaces).
 * Aura never goes on a light background (2.3:1), so the variant is not
 * cosmetic — it is the contrast rule from the handoff.
 */
export function Wordmark({
  theme = "dark",
  height = 40,
  className = "",
  labelled = true,
}: {
  theme?: "dark" | "light" | "mono-black" | "mono-white";
  height?: number;
  className?: string;
  /** false when an accessible name is already provided by a parent link. */
  labelled?: boolean;
}) {
  const [name, surname, pixel] = WORDMARK_COLORS[theme];
  // 543×123 source box. The attributes carry the ratio (so nothing reflows
  // before paint); sizing itself is left to className.
  const width = Math.round(height * (543 / 123) * 10) / 10;
  return (
    <svg
      viewBox="0 0 543 123"
      width={width}
      height={height}
      role={labelled ? "img" : undefined}
      aria-label={labelled ? "Jatin Rane" : undefined}
      aria-hidden={labelled ? undefined : true}
      className={`block w-auto ${className}`}
    >
      <path fill={name} d={NAME} />
      <path fill={surname} d={SURNAME} />
      <rect x="495.72" y="75.31" width="11.52" height="11.52" fill={pixel} />
    </svg>
  );
}

/**
 * Header lockup: mark + wordmark (+ tagline on wide screens).
 * Kit responsive rule — >1024 with tagline, 640–1024 without, <640 mark only
 * (the wordmark then lives in the hero). Sizes step down from the spec's
 * 48/40 so the fixed header keeps the viewport on phones.
 * Heights come from CSS (they win over the SVG attributes) so one element
 * serves every breakpoint. The artwork keeps the brand's own Aura/Spark
 * colours; only the tagline text follows the site's type tokens.
 */
export function BrandLockup({
  theme = "dark",
  href = "#main",
  onClick,
}: {
  theme?: "dark" | "light";
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const dark = theme === "dark";
  return (
    <a
      href={href}
      onClick={onClick}
      aria-label="Jatin Rane — home"
      className="brand-link tap flex items-center gap-3 md:gap-4"
    >
      {/* 0.95:1 mark box; ≥28px everywhere so the full-detail mascot is legal */}
      <JrMark
        title=""
        className="brand-mark h-[30px] w-[28.5px] md:h-[36px] md:w-[34px] lg:h-[42px] lg:w-[40px]"
        colorClass={dark ? "text-[var(--logo-aura)]" : "text-[var(--logo-ember)]"}
      />

      <span className="hidden sm:flex flex-col items-start gap-1.5">
        {/* Fixed artwork, never re-typeset. The 543:123 source box keeps its
            ratio, so cap-height lands near 0.3 × the mark as drawn. */}
        <Wordmark theme={theme} height={26} labelled={false} className="lg:h-[30px]" />
        <span
          className={`hidden xl:block eyebrow leading-none ${
            dark ? "text-faint-on-dark" : "text-faint-on-light"
          }`}
        >
          Frontend Engineer&thinsp;/&thinsp;React Native
        </span>
      </span>
    </a>
  );
}
