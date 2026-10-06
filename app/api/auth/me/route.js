import { ok } from "@/app/utils/http";
import { requireUser } from "@/app/utils/auth";
import { publicAccount } from "@/app/utils/accounts";

export const dynamic = "force-dynamic";

// GET -> the logged-in account (safe fields). Used to refresh the session.
export async function GET(req) {
  const auth = await requireUser(req);
  if (auth.error) return auth.error;
  return ok({ account: publicAccount(auth.user, auth.role) });
}
