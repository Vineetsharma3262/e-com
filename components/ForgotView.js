"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthShell, fieldClass } from "@/components/AuthShell";
import { useShop } from "@/components/ShopProvider";
import { authMessage, postAuth } from "@/lib/auth-errors";
import { safeNext, withNext } from "@/lib/paths";

export function ForgotView() {
  const search = useSearchParams();
  const next = safeNext(search.get("next"), "/account");
  const router = useRouter();
  const { t, refreshAccount } = useShop();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState("email");
  const [devCode, setDevCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(0);

  useEffect(() => {
    if (wait <= 0) return undefined;
    const timer = window.setTimeout(() => setWait((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [wait]);

  async function sendCode(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = await postAuth("/api/auth/forgot", { email });
    setBusy(false);
    if (!data.ok) {
      setError(authMessage(t, data.error));
      return;
    }
    setDevCode(data.devCode || "");
    setStep("reset");
    setWait(45);
  }

  async function resend() {
    setError("");
    const data = await postAuth("/api/auth/resend", { email, purpose: "reset" });
    if (!data.ok) {
      setError(authMessage(t, data.error));
      return;
    }
    setDevCode(data.devCode || "");
    setWait(45);
  }

  async function reset(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = await postAuth("/api/auth/reset", { email, code, password });
    if (!data.ok) {
      setError(authMessage(t, data.error));
      setBusy(false);
      return;
    }
    await refreshAccount();
    router.replace(next);
  }

  if (step === "reset") {
    return (
      <AuthShell title={t("resetTitle")} subtitle={`${t("verifySubtitle")} ${email}`}>
        <form onSubmit={reset} className="grid gap-4">
          {devCode ? <p className="rounded-2xl bg-bg-alt px-4 py-3 text-sm">{t("devCodeNote").replace("{code}", devCode)}</p> : null}
          <label className="grid gap-1.5 text-sm font-semibold">
            {t("otpLabel")}
            <input
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              required
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              className={`${fieldClass} tracking-[0.3em]`}
            />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">
            {t("newPassword")}
            <input
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={fieldClass}
            />
          </label>
          {error ? <p className="text-sm font-semibold text-accent" role="alert">{error}</p> : null}
          <button
            type="submit"
            disabled={busy || code.length !== 6}
            className="rounded-full bg-accent py-3.5 font-semibold text-white transition hover:bg-accent-hover disabled:opacity-50"
          >
            {busy ? t("pleaseWait") : t("resetAction")}
          </button>
          <button type="button" disabled={wait > 0} onClick={resend} className="text-sm font-semibold text-accent disabled:text-muted">
            {wait > 0 ? t("resendIn").replace("{seconds}", String(wait)) : t("resendCode")}
          </button>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={t("forgotTitle")}
      subtitle={t("forgotSubtitle")}
      footer={
        <Link href={withNext("/login", next)} className="font-semibold text-accent">
          {t("backToLogin")}
        </Link>
      }
    >
      <form onSubmit={sendCode} className="grid gap-4">
        <label className="grid gap-1.5 text-sm font-semibold">
          {t("email")}
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={fieldClass}
          />
        </label>
        {error ? <p className="text-sm font-semibold text-accent" role="alert">{error}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-accent py-3.5 font-semibold text-white transition hover:bg-accent-hover disabled:opacity-50"
        >
          {busy ? t("pleaseWait") : t("sendCode")}
        </button>
      </form>
    </AuthShell>
  );
}
