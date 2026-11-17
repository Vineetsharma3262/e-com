"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthShell, fieldClass } from "@/components/AuthShell";
import { useShop } from "@/components/ShopProvider";
import { authMessage, postAuth, rememberDevCode } from "@/lib/auth-errors";
import { safeNext, withNext } from "@/lib/paths";

export function RegisterView() {
  const search = useSearchParams();
  const next = safeNext(search.get("next"), "/account");
  const router = useRouter();
  const { t, ready, user } = useShop();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace(next);
  }, [ready, user, next, router]);

  async function onSubmit(event) {
    event.preventDefault();
    if (password !== confirm) {
      setError(t("passwordMismatch"));
      return;
    }
    setBusy(true);
    setError("");
    const data = await postAuth("/api/auth/register", { name, email, password });
    if (!data.ok) {
      setError(authMessage(t, data.error));
      setBusy(false);
      return;
    }
    rememberDevCode(data.devCode);
    router.push(withNext(`/verify?email=${encodeURIComponent(data.email || email.trim().toLowerCase())}&purpose=register`, next));
  }

  return (
    <AuthShell
      title={t("registerTitle")}
      subtitle={t("registerSubtitle")}
      footer={
        <p>
          {t("haveAccount")}{" "}
          <Link href={withNext("/login", next)} className="font-semibold text-accent">
            {t("loginInstead")}
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <label className="grid gap-1.5 text-sm font-semibold">
          {t("fullName")}
          <input
            autoComplete="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={fieldClass}
          />
        </label>
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
        <label className="grid gap-1.5 text-sm font-semibold">
          {t("password")}
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
        <label className="grid gap-1.5 text-sm font-semibold">
          {t("confirmPassword")}
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
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
