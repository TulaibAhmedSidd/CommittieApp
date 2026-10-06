import connectToDatabase from "@/app/utils/db";
import { ok, fail, serverError } from "@/app/utils/http";
import { findByLinkToken } from "@/app/utils/accounts";

export const dynamic = "force-dynamic";

// GET -> { firstName, purpose } so the set-password page can greet the user.
export async function GET(_req, { params }) {
  try {
    await connectToDatabase();
    const found = await findByLinkToken(params.token);
    if (!found) return fail(404, "This link has expired or was already used. Ask for a new one.");
    return ok({
      firstName: String(found.doc.name || "").split(" ")[0],
      purpose: found.doc.passwordLink?.purpose || "reset",
      role: found.role,
    });
  } catch (err) {
    return serverError(err, "auth/password-link");
  }
}
