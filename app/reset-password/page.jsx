"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SetPasswordForm from "../Components/Auth/SetPasswordForm";

function Inner() {
  return <SetPasswordForm token={useSearchParams().get("token")} />;
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <Inner />
    </Suspense>
  );
}
