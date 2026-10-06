import Committee from "@/app/api/models/Committee";
import Admin from "@/app/api/models/Admin";
import Member from "@/app/api/models/Member";
import { requireUser } from "@/app/utils/auth";
import { ok, serverError } from "@/app/utils/http";
import { ADMIN_PUBLIC, MEMBER_PUBLIC } from "@/app/utils/fields";

export const dynamic = "force-dynamic";

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function distanceKm(a, b) {
  if (!a || !b) return null;
  const [lng1, lat1] = a;
  const [lng2, lat2] = b;
  if (!lat1 && !lng1) return null;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}

// GET ?type=committee|organizer|member&q=&city=&lat=&lng=&radius=&page=
// Logged-in users only. Returns safe fields: name, city, blue tick, rough distance. Never phone/email/exact location.
export async function GET(req) {
  try {
    const auth = await requireUser(req);
    if (auth.error) return auth.error;

    const sp = new URL(req.url).searchParams;
    const type = sp.get("type") || "committee";
    const q = (sp.get("q") || "").trim().slice(0, 50);
    const city = (sp.get("city") || "").trim().slice(0, 50);
    const lat = parseFloat(sp.get("lat"));
    const lng = parseFloat(sp.get("lng"));
    const radius = Math.min(Math.max(parseInt(sp.get("radius") || "50", 10) || 50, 1), 500);
    const page = Math.max(1, parseInt(sp.get("page") || "1", 10) || 1);
    const limit = 12;
    const skip = (page - 1) * limit;
    const hasGeo = Number.isFinite(lat) && Number.isFinite(lng);
    const here = hasGeo ? [lng, lat] : null;

    const nameQ = q ? { name: { $regex: escapeRegex(q), $options: "i" } } : {};
    const cityQ = city ? { city: { $regex: `^${escapeRegex(city)}$`, $options: "i" } } : {};
    const geoQ = hasGeo ? { location: { $geoWithin: { $centerSphere: [[lng, lat], radius / 6378.1] } } } : {};

    if (type === "organizer") {
      const filter = { ...nameQ, ...cityQ, ...geoQ, status: "approved", isSuperAdmin: { $ne: true } };
      const [items, total] = await Promise.all([
        Admin.find(filter).select(ADMIN_PUBLIC + " location").skip(skip).limit(limit).lean(),
        Admin.countDocuments(filter),
      ]);
      return ok({
        items: items.map((a) => ({ _id: String(a._id), name: a.name, city: a.city || "", verificationStatus: a.verificationStatus, distanceKm: distanceKm(a.location?.coordinates, here) })),
        page,
        pages: Math.ceil(total / limit),
      });
    }

    if (type === "member") {
      if (!auth.isAdmin) return ok({ items: [], page: 1, pages: 0 });
      const filter = { ...nameQ, ...cityQ, ...geoQ, status: { $ne: "invited" } };
      const [items, total] = await Promise.all([
        Member.find(filter).select(MEMBER_PUBLIC + " location organizers pendingOrganizers").skip(skip).limit(limit).lean(),
        Member.countDocuments(filter),
      ]);
      const me = String(auth.user._id);
      return ok({
        items: items.map((m) => ({
          _id: String(m._id),
          name: m.name,
          city: m.city || "",
          verificationStatus: m.verificationStatus,
          distanceKm: distanceKm(m.location?.coordinates, here),
          linked: auth.isAdmin ? (m.organizers || []).some((o) => String(o) === me) : undefined,
          requested: auth.isAdmin ? (m.pendingOrganizers || []).some((o) => String(o) === me) : undefined,
        })),
        page,
        pages: Math.ceil(total / limit),
      });
    }

    // Committees open to join. City / distance come from the organizer.
    let organizerIds = null;
    if (city || hasGeo) {
      const orgs = await Admin.find({ ...cityQ, ...geoQ, status: "approved" }).select("_id").lean();
      organizerIds = orgs.map((o) => o._id);
    }
    const filter = {
      ...nameQ,
      status: { $in: ["open", "full"] },
      "result.0": { $exists: false },
      ...(organizerIds ? { createdBy: { $in: organizerIds } } : {}),
    };
    const [items, total] = await Promise.all([
      Committee.find(filter)
        .select("name monthlyAmount maxMembers members pendingMembers startDate createdBy requireDocuments mandatoryDocuments")
        .populate({ path: "createdBy", select: ADMIN_PUBLIC + " location", model: "Admin" })
        .sort({ startDate: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Committee.countDocuments(filter),
    ]);
    const me = String(auth.user._id);
    return ok({
      items: items.map((c) => ({
        _id: String(c._id),
        name: c.name,
        monthlyAmount: c.monthlyAmount,
        maxMembers: c.maxMembers,
        membersCount: c.members?.length || 0,
        spotsLeft: Math.max(c.maxMembers - (c.members?.length || 0) - (c.pendingMembers?.length || 0), 0),
        startDate: c.startDate,
        requireDocuments: !!c.requireDocuments,
        mandatoryDocuments: c.mandatoryDocuments || [],
        isMember: (c.members || []).some((m) => String(m) === me),
        isPending: (c.pendingMembers || []).some((m) => String(m) === me),
        organizer: c.createdBy
          ? { _id: String(c.createdBy._id), name: c.createdBy.name, city: c.createdBy.city || "", verificationStatus: c.createdBy.verificationStatus, distanceKm: distanceKm(c.createdBy.location?.coordinates, here) }
          : null,
      })),
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    return serverError(err, "discovery");
  }
}
