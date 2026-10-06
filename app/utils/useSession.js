"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "./session";

/**
 * Client page guard. Redirects to /login when not logged in for this scope.
 * Returns { ready, account }. Server routes still check every request.
 */
export function useSession(scope, { redirect = true } = {}) {
  const router = useRouter();
  const [state, setState] = useState({ ready: false, account: null });

  useEffect(() => {
    const s = getSession(scope);
    if (!s && redirect) {
      const next = encodeURIComponent(window.location.pathname + window.location.search);
      router.replace(`/login?next=${next}`);
      return;
    }
    setState({ ready: true, account: s?.account || null });
  }, [scope, redirect, router]);

  return state;
}
