"use client";

import SetPasswordForm from "../../Components/Auth/SetPasswordForm";

export default function InvitePage({ params }) {
  return <SetPasswordForm token={params.token} />;
}
