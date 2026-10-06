import Log from "@/app/api/models/Log";
import { requireSuperAdmin } from "@/app/utils/auth";
import { ok, serverError } from "@/app/utils/http";

export const dynamic = "force-dynamic";

// GET ?page= -> audit log (super admin only). Only names are shown for people.
export async function GET(req) {
  try {
    const auth = await requireSuperAdmin(req);
    if (auth.error) return auth.error;
    const page = Math.max(1, parseInt(new URL(req.url).searchParams.get("page") || "1", 10));
    const limit = 50;
    const [logs, total] = await Promise.all([
      Log.find().sort({ timestamp: -1 }).skip((page - 1) * limit).limit(limit).populate("performedBy", "name").lean(),
      Log.countDocuments(),
    ]);
    return ok({
      logs: logs.map((l) => ({
        _id: String(l._id),
        action: l.action,
        by: l.performedBy?.name || "Unknown",
        byType: l.onModel,
        details: l.details,
        timestamp: l.timestamp,
      })),
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    return serverError(err, "logs");
  }
}
