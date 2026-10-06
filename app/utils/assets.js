import Asset from "../api/models/Asset";

// Images (receipts, CNIC, payout proof) are stored as base64 in Mongo.
// Only jpeg/png/webp, max ~1.5 MB. Served by /api/assets/[id] with access checks.

export const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024;
const DATA_URL_RE = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/;

export function parseImageDataUrl(dataUrl) {
  if (typeof dataUrl !== "string") return { error: "Please add a photo." };
  const m = dataUrl.match(DATA_URL_RE);
  if (!m) return { error: "Only photos (JPG, PNG, WEBP) are allowed." };
  const bytes = Math.floor((m[2].length * 3) / 4);
  if (bytes > MAX_IMAGE_BYTES) return { error: "Photo is too big. Please choose a smaller one." };
  return { contentType: m[1], bytes };
}

/** Save a data URL as an Asset. Returns { url } or { error }. */
export async function saveImage(dataUrl, uploader, onModel, name = "photo") {
  const parsed = parseImageDataUrl(dataUrl);
  if (parsed.error) return parsed;
  const asset = await Asset.create({
    name: String(name).slice(0, 80),
    data: dataUrl,
    contentType: parsed.contentType,
    uploadedBy: uploader,
    onModel,
    size: parsed.bytes,
  });
  return { url: `/api/assets/${asset._id}`, assetId: String(asset._id) };
}

export function assetIdFromUrl(url) {
  const m = typeof url === "string" && url.match(/^\/api\/assets\/([a-f\d]{24})$/i);
  return m ? m[1] : null;
}

/**
 * Accept either a new data URL (saved now) or an existing /api/assets/<id> owned by the uploader.
 * Returns { url } or { error }.
 */
export async function resolveImage(value, uploader, onModel, name) {
  if (!value) return { error: "Please add a photo." };
  if (typeof value === "string" && value.startsWith("data:")) return saveImage(value, uploader, onModel, name);
  const id = assetIdFromUrl(value);
  if (!id) return { error: "Invalid photo." };
  const owned = await Asset.exists({ _id: id, uploadedBy: uploader });
  return owned ? { url: value } : { error: "Invalid photo." };
}
