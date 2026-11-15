export function Logo({ tone = "ink", withWord = true, className = "" }) {
  const word = tone === "light" ? "text-white" : "text-ink";
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" aria-hidden>
        <rect width="32" height="32" rx="8" fill="#c4521c" />
        <path
          d="M6.4 7.4h3.15l2.55 11.2L15.2 9.6h1.6l3.1 9L22.45 7.4H25.6L20.7 24.6h-3.35L16 16.15l-1.35 8.45H11.3L6.4 7.4Z"
          fill="#fff7f2"
        />
      </svg>
      {withWord ? (
        <span className={`font-serif text-xl font-semibold leading-none tracking-tight ${word}`}>Wearveltho</span>
      ) : null}
    </span>
  );
}
