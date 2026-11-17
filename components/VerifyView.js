"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthShell, fieldClass } from "@/components/AuthShell";
import { useShop } from "@/components/ShopProvider";
import { authMessage, DEV_OTP_KEY, postAuth, rememberDevCode } from "@/lib/auth-errors";
import { safeNext, withNext } from "@/lib/paths";

export function VerifyView() {
  const search = useSearchParams();
  const email = String(search.get("email") || "").trim().toLowerCase();
  const purpose = search.get("purpose") === "reset" ? "reset" : "register";
  const next = safeNext(search.get("next"), "/account");
  const router = useRouter();
  const { t, ready, user, refreshAccount } = useShop();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [devCode, setDevCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(45);

  useEffect(() => {
    if (ready && user && purpose === "register") router.replace(next);
  }, [ready, user, purpose, next, router]);

  useEffect(() => {
    setDevCode(sessionStorage.getItem(DEV_OTP_KEY) || "");
  }, []);

  useEffect(() => {
    if (wait <= 0) return undefined;
    const timer = window.setTimeout(() => setWait((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [wait]);

  async function onSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = await postAuth("/api/auth/verify", { email, code });
    if (!data.ok) {
      setError(authMessage(t, data.error));
      setBusy(false);
      return;
    }
    sessionStorage.removeItem(DEV_OTP_KEY);
    await refreshAccount();
    router.replace(next);
  }

  async function resend() {
    setError("");
    setNote("");
    const data = await postAuth("/api/auth/resend", { email, purpose });
    if (!data.ok) {
      setError(authMessage(t, data.error));
      return;
    }
    rememberDevCode(data.devCode);
    setDevCode(data.devCode || "");
    setNote(t("sentCode"));
    setWait(45);
  }

  if (!email) {
    return (
      <AuthShell title={t("verifyTitle")} subtitle={t("verifyMissing")}>
        <Link href={withNext("/register", next)} className="font-semibold text-accent">
          {t("createOne")}
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={t("verifyTitle")}
      subtitle={`${t("verifySubtitle")} ${email}`}
      footer={
        <Link href={withNext("/login", next)} className="font-semibold text-accent">
          {t("backToLogin")}
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        {devCode ? <p className="rounded-2xl bg-bg-alt px-4 py-3 text-sm text-ink">{t("devCodeNote").replace("{code}", devCode)}</p> : null}
        <label className="grid gap-1.5 text-sm font-semibold">
          {t("otpLabel")}
          <input
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            required
            value={code}
            placeholder="000000"
            onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
            className={`${fieldClass} tracking-[0.3em]`}
          />
        </label>
        {error ? <p className="text-sm font-semibold text-accent" role="alert">{error}</p> : null}
        {note ? <p className="text-sm text-muted">{note}</p> : null}
        <button
          type="submit"
          disabled={busy || code.length !== 6}
          className="rounded-full bg-accent py-3.5 font-semibold text-white transition hover:bg-accent-hover disabled:opacity-50"
        >
          {busy ? t("pleaseWait") : t("verifyAction")}
        </button>
        <button
          type="button"
          disabled={wait > 0}
          onClick={resend}
          className="text-sm font-semibold text-accent disabled:text-muted"
        >
          {wait > 0 ? t("resendIn").replace("{seconds}", String(wait)) : t("resendCode")}
        </button>
      </form>
    </AuthShell>
  );
}
