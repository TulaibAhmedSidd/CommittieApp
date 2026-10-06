import { redirect } from "next/navigation";

// Organizer's invite link: /join/REF-XXXXXX -> sign up linked to that organizer.
export default function JoinPage({ params }) {
  redirect(`/register?ref=${encodeURIComponent(params.code)}`);
}
