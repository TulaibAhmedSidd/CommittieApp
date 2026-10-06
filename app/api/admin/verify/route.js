import Admin from "@/app/api/models/Admin";
import Member from "@/app/api/models/Member";
import Committee from "@/app/api/models/Committee";
import { requireAdmin, adminCanManageMember } from "@/app/utils/auth";
import { ok, fail, readJson, serverError, isObjectId } from "@/app/utils/http";
import { MEMBER_KYC } from "@/app/utils/fields";
import { notify } from "@/app/utils/notify";
import { createLog } from "@/app/utils/logger";

export const dynamic = "force-dynamic";

// GET -> identity checks waiting for me. Organizer: my members. Super admin: everyone + organizers.
export async function GET(req) {
  try {
    const auth = await requireAdmin(req);
    if (auth.error) return auth.error;
    const admin = auth.user;

    const memberFilter = { verificationStatus: "pending" };
    if (!admin.isSuperAdmin) {
      const mine = await Committee.find({ createdBy: admin._id }).select("members pendingMembers").lean();
      const inMyBcs = mine.flatMap((c) => [...(c.members || []), ...(c.pendingMembers || [])]);
      memberFilter.$or = [{ organizers: admin._id }, { createdBy: admin._id }, { referredBy: admin._id }, { _id: { $in: inMyBcs } }];
    }
    const members = await Member.find(memberFilter).select(MEMBER_KYC).limit(200).lean();
    const admins = admin.isSuperAdmin
      ? await Admin.find({ verificationStatus: "pending" }).select("name phone email city nicNumber nicImage verificationStatus").limit(200).lean()
      : [];

    const norm = (d) => ({ ...d, _id: String(d._id), phone: d.phone ? String(d.phone) : "" });
    return ok({ members: members.map(norm), admins: admins.map(norm) });
  } catch (err) {
    return serverError(err, "admin/verify GET");
  }
}

// PATCH { userId, role: "Member" | "Admin", status: "verified" | "unverified" }
export async function PATCH(req) {
  try {
    const auth = await requireAdmin(req);
    if (auth.error) return auth.error;
    const { userId, role, status } = await readJson(req);
    if (!isObjectId(userId)) return fail(400, "Invalid person.");
    if (!["verified", "unverified"].includes(status)) return fail(400, "Unknown status.");

    if (role === "Admin") {
      if (!auth.user.isSuperAdmin) return fail(403, "Only the super admin can verify organizers.");
      await Admin.updateOne({ _id: userId }, { verificationStatus: status });
      await notify({
        recipient: userId,
        model: "Admin",
        sender: auth.user._id,
        senderModel: "Admin",
        type: "verification",
        message: status === "verified" ? "Your identity is verified. You now have a blue tick." : "Your CNIC photo was not accepted. Please upload a clear photo again.",
        link: "/admin/profile",
      });
    } else {
      const member = await Member.findById(userId).select("organizers createdBy referredBy");
      const inMyBc = member && (await Committee.exists({ createdBy: auth.user._id, $or: [{ members: member._id }, { pendingMembers: member._id }] }));
      if (!member || !(adminCanManageMember(auth.user, member) || inMyBc)) return fail(404, "Member not found in your list.");
      await Member.updateOne({ _id: userId }, { verificationStatus: status });
      await notify({
        recipient: userId,
        model: "Member",
        sender: auth.user._id,
        senderModel: "Admin",
        type: "verification",
        message: status === "verified" ? "Your identity is verified. You now have a blue tick." : "Your documents were not accepted. Please upload clear photos again.",
        link: "/userDash/profile",
      });
    }
    await createLog({ action: status === "verified" ? "VERIFY_IDENTITY" : "REJECT_IDENTITY", performedBy: auth.user._id, onModel: "Admin", targetId: userId, details: { role } });
    return ok({ done: true });
  } catch (err) {
    return serverError(err, "admin/verify PATCH");
  }
}
