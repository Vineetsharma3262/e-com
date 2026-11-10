export function Logo({ tone = "ink", withWord = true, className = "" }) {
  const word = tone === "light" ? "text-white" : "text-ink";
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" aria-hidden>
        <rect width="32" height="32" rx="8" fill="#c4521c" />
        <path
          d="M16 6.2 7 26h3.6l1.8-4.6h7.2L21.4 26H25L16 6.2Zm0 7.4 2.3 5.8h-4.6L16 13.6Z"
          fill="#fff7f2"
        />
      </svg>
      {withWord ? (
        <span className={`font-serif text-xl font-semibold leading-none tracking-tight ${word}`}>Aurelle</span>
      ) : null}
    </span>
  );
}
