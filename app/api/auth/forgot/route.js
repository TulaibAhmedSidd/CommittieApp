import connectToDatabase from "@/app/utils/db";
import { ok, fail, readJson, serverError } from "@/app/utils/http";
import { parseIdentifier } from "@/app/utils/phone";
import { findAccounts } from "@/app/utils/accounts";
import { createPasswordLink, linkUpdate } from "@/app/utils/tokens";
import { sendMail, appUrl } from "@/app/utils/mailer";
import { emails } from "@/app/utils/emailTemplates";
import { limit, clientIp } from "@/app/utils/rateLimit";

export const dynamic = "force-dynamic";

// POST { identifier }. Email users get a reset link by email.
// Phone-only users are told to ask their organizer for a new link (no SMS cost).
export async function POST(req) {
  try {
    const { identifier } = await readJson(req);
    const id = parseIdentifier(identifier);
    if (!id) return fail(400, "Enter your email or phone number.");

    await connectToDatabase();
    const limited = await limit([[`forgot:ip:${clientIp(req)}`, 10, 3600], [`forgot:id:${id.email || id.phone}`, 3, 3600]]);
    if (limited) return limited;
    const { admins, members } = await findAccounts(id, { withSecrets: false });
    const accounts = [...admins, ...members];
    const withEmail = accounts.filter((a) => a.email);

    for (const acc of withEmail) {
      const raw = createPasswordLink(acc, "reset");
      await acc.constructor.updateOne({ _id: acc._id }, linkUpdate(acc));
      const mail = emails.passwordReset({ name: acc.name, link: appUrl(`/reset-password?token=${raw}`) });
      await sendMail({ to: acc.email, ...mail });
    }

    if (id.phone && accounts.length && !withEmail.length) {
      return ok({ phoneOnly: true, message: "Ask your organizer to send you a new password link on WhatsApp." });
    }

    // Same answer whether or not the account exists.
    return ok({ message: "If this account has an email, a reset link has been sent. Otherwise ask your organizer for a new link." });
  } catch (err) {
    return serverError(err, "auth/forgot");
  }
}
