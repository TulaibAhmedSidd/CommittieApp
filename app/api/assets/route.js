import { requireUser } from "@/app/utils/auth";
import { ok, fail, readJson, serverError } from "@/app/utils/http";
import { saveImage } from "@/app/utils/assets";

export const dynamic = "force-dynamic";

// POST { data: "data:image/jpeg;base64,...", name? } -> { url, assetId }
export async function POST(req) {
  try {
    const auth = await requireUser(req);
    if (auth.error) return auth.error;
    const { data, name } = await readJson(req);
    const res = await saveImage(data, auth.user._id, auth.model, typeof name === "string" ? name : "photo");
    if (res.error) return fail(400, res.error);
    return ok(res, 201);
  } catch (err) {
    return serverError(err, "assets POST");
  }
}
