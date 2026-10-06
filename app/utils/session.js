"use client";

// Login sessions in localStorage.
// Two scopes so an organizer and a member can be logged in on the same phone:
//   admin  -> admin_token + admin_detail
//   member -> token + member

const KEYS = {
  admin: { token: "admin_token", detail: "admin_detail" },
  member: { token: "token", detail: "member" },
};

const SAFE_FIELDS = ["_id", "name", "phone", "email", "role", "isSuperAdmin", "verificationStatus", "city"];

function storage() {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null;
  }
}

export function getToken(scope) {
  return storage()?.getItem(KEYS[scope].token) || null;
}

export function getSession(scope) {
  const s = storage();
  if (!s) return null;
  const token = s.getItem(KEYS[scope].token);
  if (!token) return null;
  try {
    const account = JSON.parse(s.getItem(KEYS[scope].detail) || "null");
    return account ? { token, account } : null;
  } catch {
    return null;
  }
}

export function saveSession(scope, token, account) {
  const s = storage();
  if (!s) return;
  const safe = {};
  for (const k of SAFE_FIELDS) if (account?.[k] !== undefined) safe[k] = account[k];
  s.setItem(KEYS[scope].token, token);
  s.setItem(KEYS[scope].detail, JSON.stringify(safe));
}

/** Update stored account fields (e.g. after profile save). */
export function updateSessionAccount(scope, patch) {
  const current = getSession(scope);
  if (current) saveSession(scope, current.token, { ...current.account, ...patch });
}

export function clearSession(scope) {
  const s = storage();
  if (!s) return;
  s.removeItem(KEYS[scope].token);
  s.removeItem(KEYS[scope].detail);
}

export function homeFor(scope) {
  return scope === "admin" ? "/admin" : "/userDash";
}
