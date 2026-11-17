"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthShell, fieldClass } from "@/components/AuthShell";
import { useShop } from "@/components/ShopProvider";
import { authMessage, postAuth, rememberDevCode } from "@/lib/auth-errors";
import { safeNext, withNext } from "@/lib/paths";

export function LoginView() {
  const search = useSearchParams();
  const next = safeNext(search.get("next"), "/account");
  const router = useRouter();
  const { t, ready, user, refreshAccount } = useShop();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const checkout = next.startsWith("/checkout");

  useEffect(() => {
    if (ready && user) router.replace(next);
  }, [ready, user, next, router]);

  async function onSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = await postAuth("/api/auth/login", { email, password });
    if (data.error === "NEEDS_VERIFICATION") {
      rememberDevCode(data.devCode);
      router.push(withNext(`/verify?email=${encodeURIComponent(email.trim().toLowerCase())}&purpose=register`, next));
      return;
    }
    if (!data.ok) {
      setError(authMessage(t, data.error));
      setBusy(false);
      return;
    }
    await refreshAccount();
    router.replace(next);
  }

  return (
    <AuthShell
      title={t("loginTitle")}
      subtitle={checkout ? t("loginToCheckout") : t("loginSubtitle")}
      footer={
        <p>
          {t("noAccount")}{" "}
          <Link href={withNext("/register", next)} className="font-semibold text-accent">
            {t("createOne")}
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="grid gap-4">
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
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={fieldClass}
          />
        </label>
        <Link href={withNext("/forgot", next)} className="justify-self-start text-sm font-semibold text-accent">
          {t("forgotPassword")}
        </Link>
        {error ? <p className="text-sm font-semibold text-accent" role="alert">{error}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-accent py-3.5 font-semibold text-white transition hover:bg-accent-hover disabled:opacity-50"
        >
          {busy ? t("pleaseWait") : t("loginAction")}
        </button>
      </form>
    </AuthShell>
  );
}
