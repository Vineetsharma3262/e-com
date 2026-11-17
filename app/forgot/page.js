import { Suspense } from "react";
import { ForgotView } from "@/components/ForgotView";

export const metadata = { title: "Reset password" };

export default function ForgotPage() {
  return (
    <Suspense fallback={null}>
      <ForgotView />
    </Suspense>
  );
}
