import Asset from "@/app/api/models/Asset";
import Member from "@/app/api/models/Member";
import Committee from "@/app/api/models/Committee";
import { requireUser, adminCanManageMember } from "@/app/utils/auth";
import { fail, serverError, isObjectId } from "@/app/utils/http";

export const dynamic = "force-dynamic";

const SAFE_TYPES = ["image/jpeg", "image/png", "image/webp"];

async function canView(auth, asset) {
  const me = String(auth.user._id);
  const owner = String(asset.uploadedBy || "");
  if (owner === me) return true;
  if (auth.isAdmin && auth.user.isSuperAdmin) return true;

  if (auth.isAdmin && asset.onModel === "Member") {
    const member = await Member.findById(owner).select("organizers createdBy referredBy");
    if (member && adminCanManageMember(auth.user, member)) return true;
    // Join request documents: the member is waiting to join one of my BCs.
    return !!(await Committee.exists({ createdBy: me, $or: [{ pendingMembers: owner }, { members: owner }] }));
  }

  if (!auth.isAdmin && asset.onModel === "Admin") {
    // Payout proof from my organizer for a BC I am in.
    const url = `/api/assets/${asset._id}`;
    return !!(await Committee.exists({ createdBy: owner, members: me, "payouts.screenshot": url }));
  }
  return false;
}

// GET -> the image, only for people allowed to see it. Use <SecureImage> on the client (sends the token).
export async function GET(req, { params }) {
  try {
    const auth = await requireUser(req);
    if (auth.error) return auth.error;
    if (!isObjectId(params.id)) return fail(400, "Invalid file.");
    const asset = await Asset.findById(params.id).lean();
    if (!asset) return fail(404, "File not found.");
    if (!(await canView(auth, asset))) return fail(403, "You can't view this file.");

    const match = typeof asset.data === "string" && asset.data.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) return fail(404, "File not found.");
    const type = SAFE_TYPES.includes(match[1]) ? match[1] : "application/octet-stream";
    return new Response(Buffer.from(match[2], "base64"), {
      status: 200,
      headers: {
        "Content-Type": type,
        "Content-Disposition": type === "application/octet-stream" ? "attachment" : "inline",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; sandbox",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (err) {
    return serverError(err, "assets GET");
  }
}
