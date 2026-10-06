import { createPasswordLink } from "./tokens";
import { appUrl } from "./mailer";
import { waLink } from "./whatsapp";

/** Create an invite/reset link on the member (caller saves) and the WhatsApp message for it. */
export function makePasswordLinkMessage(member, organizerName) {
  const purpose = member.status === "invited" ? "invite" : "reset";
  const raw = createPasswordLink(member, purpose);
  const link = appUrl(`/invite/${raw}`);
  const text =
    purpose === "invite"
      ? `Assalam o Alaikum ${member.name}! ${organizerName} added you to CommittieApp for our BC. Open this link to set your password (works for 7 days): ${link}`
      : `Assalam o Alaikum ${member.name}! Here is your link to set a new CommittieApp password (works for 1 hour): ${link}`;
  return { link, purpose, text, waLink: waLink(member.phone, text), expiresAt: member.passwordLink.expiresAt };
}
