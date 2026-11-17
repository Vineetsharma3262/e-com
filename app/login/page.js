import { Suspense } from "react";
import { LoginView } from "@/components/LoginView";

export const metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginView />
    </Suspense>
  );
}
