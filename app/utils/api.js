"use client";

import { getToken, clearSession } from "./session";

// One fetch wrapper for the whole app.
//   adminApi.get("/api/committee")      -> sends admin_token
//   memberApi.post("/api/...", body)     -> sends token
//   publicApi.get("/api/public/...")     -> no token
// Throws Error(message) with err.status on failure.
// On 401 it clears that login and sends the user to /login.

let redirecting = false;

function createApi(scope) {
  async function request(method, url, body) {
    const headers = { Accept: "application/json" };
    if (body !== undefined) headers["Content-Type"] = "application/json";
    const token = scope ? getToken(scope) : null;
    if (token) headers.Authorization = `Bearer ${token}`;

    let res;
    try {
      res = await fetch(url, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined });
    } catch {
      const err = new Error("No internet connection. Please try again.");
      err.status = 0;
      throw err;
    }

    let data = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (!res.ok) {
      if (res.status === 401 && scope && typeof window !== "undefined") {
        clearSession(scope);
        if (!redirecting && !window.location.pathname.startsWith("/login")) {
          redirecting = true;
          const next = encodeURIComponent(window.location.pathname + window.location.search);
          window.location.href = `/login?next=${next}`;
        }
      }
      const err = new Error(data?.error || data?.message || "Something went wrong. Please try again.");
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  return {
    get: (url) => request("GET", url),
    post: (url, body = {}) => request("POST", url, body),
    patch: (url, body = {}) => request("PATCH", url, body),
    put: (url, body = {}) => request("PUT", url, body),
    del: (url, body) => request("DELETE", url, body),
  };
}

export const adminApi = createApi("admin");
export const memberApi = createApi("member");
export const publicApi = createApi(null);

/** Pick the API for whoever is logged in on this page type. */
export function apiFor(scope) {
  return scope === "admin" ? adminApi : scope === "member" ? memberApi : publicApi;
}

/** Upload a base64 image (data URL). Returns { assetId, url }. */
export function uploadImage(scope, dataUrl, name = "photo.jpg") {
  return apiFor(scope).post("/api/assets", { data: dataUrl, name });
}
