// Small helpers so every API route answers in the same shape.
// Success: the data object. Error: { error: "message" }.

export function ok(data = {}, status = 200) {
  return Response.json(data, { status });
}

export function fail(status, error) {
  return Response.json({ error }, { status });
}

/** Parse a JSON body without throwing. Returns {} for an empty/invalid body. */
export async function readJson(req) {
  try {
    const body = await req.json();
    return body && typeof body === "object" ? body : {};
  } catch {
    return {};
  }
}

/** Log the real error on the server, return a generic message to the client. */
export function serverError(err, where = "") {
  console.error(`[api] ${where}`, err);
  return fail(500, "Something went wrong. Please try again.");
}

export function isObjectId(id) {
  return typeof id === "string" && /^[a-f\d]{24}$/i.test(id);
}

/** Pick only allowed keys from an object (prevents mass assignment). */
export function pick(obj, keys) {
  const out = {};
  for (const k of keys) {
    if (obj[k] !== undefined) out[k] = obj[k];
  }
  return out;
}
