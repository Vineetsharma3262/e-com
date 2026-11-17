export const fieldClass =
  "w-full rounded-xl border border-line bg-bg px-4 py-3 font-normal text-ink placeholder:text-muted/70 focus:border-ink focus:outline-none";

export function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-12">
      <h1 className="font-serif text-4xl font-semibold">{title}</h1>
      {subtitle ? <p className="mt-2 text-muted">{subtitle}</p> : null}
      <div className="mt-8 rounded-3xl border border-line bg-card p-6 sm:p-8">{children}</div>
      {footer ? <div className="mt-6 text-sm leading-relaxed text-muted">{footer}</div> : null}
    </div>
  );
}
