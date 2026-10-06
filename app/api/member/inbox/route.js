import { requireMember } from "@/app/utils/auth";
import { ok, serverError } from "@/app/utils/http";
import { buildInbox } from "@/app/utils/inbox";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const auth = await requireMember(req);
    if (auth.error) return auth.error;
    return ok(await buildInbox(auth.user._id, "Member"));
  } catch (err) {
    return serverError(err, "member/inbox");
  }
}
