import { Suspense } from "react";
import { RegisterView } from "@/components/RegisterView";

export const metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterView />
    </Suspense>
  );
}
