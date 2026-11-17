import { Suspense } from "react";
import { VerifyView } from "@/components/VerifyView";

export const metadata = { title: "Verify email" };

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyView />
    </Suspense>
  );
}
