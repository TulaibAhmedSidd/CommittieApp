import connectToDatabase from "@/app/utils/db";
import { ok, fail, serverError, isObjectId } from "@/app/utils/http";
import { loadCommitteeFull, publicView } from "@/app/utils/committeeView";
import { stage } from "@/app/utils/bcRules";

export const dynamic = "force-dynamic";

// GET -> public info for a BC shared on WhatsApp. No login needed. Only BCs that are coming up.
export async function GET(_req, { params }) {
  try {
    if (!isObjectId(params.id)) return fail(400, "Invalid link.");
    await connectToDatabase();
    const c = await loadCommitteeFull(params.id);
    if (!c) return fail(404, "BC not found.");
    if (stage(c) !== "upcoming") return fail(410, "This BC has already started. Ask the organizer about the next one.");
    const view = publicView(c);
    return ok({ committee: { ...view, isPending: undefined, isMember: undefined } });
  } catch (err) {
    return serverError(err, "public/bc");
  }
}
