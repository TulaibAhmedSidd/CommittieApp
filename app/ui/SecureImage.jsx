"use client";

import { useEffect, useState } from "react";
import { getToken } from "../utils/session";

/**
 * Shows an image from /api/assets/<id> (needs the login token) or a data: URL.
 * scope: "admin" | "member"
 */
export default function SecureImage({ src, scope, alt = "", className = "" }) {
  const [url, setUrl] = useState(src?.startsWith("data:") ? src : null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!src) return;
    if (src.startsWith("data:")) {
      setUrl(src);
      return;
    }
    if (!src.startsWith("/api/assets/")) {
      setFailed(true);
      return;
    }
    let objectUrl;
    let cancelled = false;
    setFailed(false);
    const token = getToken(scope);
    fetch(src, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then((r) => (r.ok ? r.blob() : Promise.reject()))
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src, scope]);

  if (!src) return null;
  if (failed) return <div className={`flex items-center justify-center bg-surface-200 text-sm text-ink-500 ${className}`}>Photo not available</div>;
  if (!url) return <div className={`animate-pulse bg-surface-200 ${className}`} />;
  return <img src={url} alt={alt} className={`object-contain ${className}`} />;
}
