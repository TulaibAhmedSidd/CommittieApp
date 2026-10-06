"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFor } from "./api";

/** const { data, error, loading, reload } = useApi("admin", "/api/committee") */
export function useApi(scope, url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!url) return;
    setLoading(true);
    try {
      setData(await apiFor(scope).get(url));
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [scope, url]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, error, loading, reload, setData };
}
