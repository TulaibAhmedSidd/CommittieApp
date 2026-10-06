import crypto from "crypto";
import bcrypt from "bcryptjs";
import Member from "@/app/api/models/Member";
import Committee from "@/app/api/models/Committee";
import { requireAdmin } from "@/app/utils/auth";
import { ok, fail, readJson, serverError, isObjectId } from "@/app/utils/http";
import { normalizePkPhone, normalizeEmail } from "@/app/utils/phone";
import { findAccounts } from "@/app/utils/accounts";
import { makePasswordLinkMessage } from "@/app/utils/invites";
import { linkUpdate } from "@/app/utils/tokens";
import { createLog } from "@/app/utils/logger";
import { sendMail } from "@/app/utils/mailer";
import { emails } from "@/app/utils/emailTemplates";
import { addMemberToCommittee } from "@/app/utils/committeeOps";
import { notify } from "@/app/utils/notify";
import { stage } from "@/app/utils/bcRules";

export const dynamic = "force-dynamic";

const linkedTo = (adminId) => ({ $or: [{ organizers: adminId }, { createdBy: adminId }, { referredBy: adminId }] });

// GET -> my members (people linked to me) with the BCs of mine they are in.
export async function GET(req) {
  try {
    const auth = await requireAdmin(req);
    if (auth.error) return auth.error;
    const me = auth.user._id;

    const [members, myBcs] = await Promise.all([
      Member.find(linkedTo(me)).select("name phone email city status verificationStatus createdAt createdBy").sort({ name: 1 }).limit(1000).lean(),
      Committee.find({ createdBy: me }).select("name status members pendingMembers").lean(),
    ]);

    const bcsByMember = {};
    for (const bc of myBcs) {
      for (const id of bc.members || []) (bcsByMember[String(id)] ||= []).push({ _id: String(bc._id), name: bc.name });
    }

    return ok({
      members: members.map((m) => ({
        _id: String(m._id),
        name: m.name,
        phone: m.phone ? String(m.phone) : "",
        email: m.email || "",
        city: m.city || "",
        status: m.status,
        verificationStatus: m.verificationStatus,
        addedByMe: auth.user.isSuperAdmin || String(m.createdBy || "") === String(me),
        bcs: bcsByMember[String(m._id)] || [],
      })),
    });
  } catch (err) {
    return serverError(err, "admin/members GET");
  }
}

// POST { name, phone, email?, committeeId? } -> add a member. Returns an invite link to send on WhatsApp.
export async function POST(req) {
  try {
    const auth = await requireAdmin(req);
    if (auth.error) return auth.error;
    const admin = auth.user;
    const body = await readJson(req);

    const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";
    const phone = normalizePkPhone(body.phone);
    const email = body.email ? normalizeEmail(body.email) : null;
    if (name.length < 2) return fail(400, "Please enter the member's name.");
    if (!phone) return fail(400, "Please enter a valid mobile number, e.g. 0300 1234567.");
    if (body.email && !email) return fail(400, "That email does not look right. You can leave it empty.");

    let committee = null;
    if (body.committeeId) {
      if (!isObjectId(body.committeeId)) return fail(400, "Invalid BC.");
      committee = await Committee.findOne({ _id: body.committeeId, ...(admin.isSuperAdmin ? {} : { createdBy: admin._id }) });
      if (!committee) return fail(404, "BC not found.");
      if (stage(committee) !== "upcoming") return fail(400, "Members can only be added before the BC starts.");
      if ((committee.members?.length || 0) >= committee.maxMembers) return fail(400, "This BC is already full.");
    }

    const { members: existing } = await findAccounts({ phone }, { withSecrets: false });
    let member = existing[0] || null;
    let invite = null;
    let alreadyHadAccount = false;

    if (member) {
      const me = String(admin._id);
      const createdByMe = String(member.createdBy || "") === me;
      const linked = (member.organizers || []).some((o) => String(o) === me);

      if (member.status === "invited") {
        // Only the organizer who invited them may send a new invite.
        if (!createdByMe && !admin.isSuperAdmin) {
          return fail(409, "This person was already invited by another organizer. Ask them to open that invite first.");
        }
        invite = makePasswordLinkMessage(member, admin.name);
        await Member.updateOne({ _id: member._id }, linkUpdate(member));
      } else if (!linked && !createdByMe) {
        // Existing account that is not linked to me: ask for their consent, never link silently.
        await Member.updateOne({ _id: member._id }, { $addToSet: { pendingOrganizers: admin._id } });
        await notify({
          recipient: member,
          model: "Member",
          sender: admin._id,
          senderModel: "Admin",
          type: "connect_request",
          message: `${admin.name} (organizer) wants to add you to their members${committee ? ` for ${committee.name}` : ""}.`,
          details: { adminId: me },
          link: "/userDash/notifications",
        });
        await createLog({ action: "REQUEST_MEMBER_LINK", performedBy: admin._id, onModel: "Admin", targetId: member._id });
        return ok({ requestSent: true }, 202);
      }
      alreadyHadAccount = member.status !== "invited";
    } else {
      if (email && (await Member.exists({ email }))) return fail(409, "Another member already uses this email. Leave email empty or use a different one.");
      member = new Member({
        name,
        phone,
        email: email || undefined,
        password: await bcrypt.hash(crypto.randomBytes(24).toString("hex"), 10),
        status: "invited",
        organizers: [admin._id],
        createdBy: admin._id,
        createdByAdminName: admin.name,
      });
      invite = makePasswordLinkMessage(member, admin.name);
      await member.save();
      if (email) {
        await sendMail({ to: email, ...emails.invite({ name, organizerName: admin.name, link: invite.link }) });
      }
    }

    let addedToBc = false;
    if (committee) addedToBc = await addMemberToCommittee(committee, member, admin._id);

    await createLog({ action: "ADD_MEMBER", performedBy: admin._id, onModel: "Admin", targetId: member._id, details: { committeeId: committee ? String(committee._id) : null, existing: !!existing[0] } });
    return ok(
      {
        member: { _id: String(member._id), name: member.name, phone: member.phone ? String(member.phone) : "", status: member.status },
        alreadyHadAccount,
        addedToBc,
        invite,
      },
      201
    );
  } catch (err) {
    return serverError(err, "admin/members POST");
  }
}
