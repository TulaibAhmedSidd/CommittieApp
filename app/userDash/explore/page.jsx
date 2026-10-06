"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { FiSearch, FiMapPin } from "react-icons/fi";
import { Bi, Button, EmptyState, ErrorBox, Field, Loading, Page } from "@/app/ui";
import { W } from "@/app/utils/words";
import { memberApi } from "@/app/utils/api";
import OpenBcCard from "../_components/OpenBcCard";

export default function ExplorePage() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [filters, setFilters] = useState({ q: "", city: "" });
  const [items, setItems] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [error, setError] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const reqId = useRef(0);

  // Wait until the user stops typing for 400ms.
  useEffect(() => {
    const t = setTimeout(() => setFilters({ q: q.trim(), city: city.trim() }), 400);
    return () => clearTimeout(t);
  }, [q, city]);

  const load = useCallback(
    async (p, append) => {
      const id = ++reqId.current;
      if (append) setLoadingMore(true);
      else {
        setItems(null);
        setError("");
      }
      try {
        const qs = new URLSearchParams({ type: "committee", q: filters.q, city: filters.city, page: String(p) });
        const d = await memberApi.get(`/api/discovery?${qs}`);
        if (id !== reqId.current) return;
        setItems((prev) => (append ? [...(prev || []), ...d.items] : d.items));
        setPage(d.page);
        setPages(d.pages);
      } catch (e) {
        if (id !== reqId.current) return;
        if (append) toast.error(e.message);
        else setError(e.message);
      } finally {
        if (id === reqId.current) setLoadingMore(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    load(1, false);
  }, [load]);

  const markPending = (bcId) => setItems((list) => list.map((b) => (b._id === bcId ? { ...b, isPending: true } : b)));

  return (
    <Page
      title={W.explore.en}
      urdu={W.explore.ur}
      action={
        <Button variant="secondary" href="/userDash/near-me" icon={FiMapPin}>
          <Bi {...W.nearMe} />
        </Button>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label="Search by name"
          urdu="نام سے تلاش کریں"
          prefix={<FiSearch />}
          type="search"
          placeholder="BC name"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Field label="City" urdu="شہر" placeholder="e.g. Lahore" value={city} onChange={(e) => setCity(e.target.value)} />
      </div>

      {error ? (
        <ErrorBox message={error} onRetry={() => load(1, false)} />
      ) : !items ? (
        <Loading rows={3} />
      ) : !items.length ? (
        <EmptyState icon={FiSearch} title="No BCs found" urdu="کوئی کمیٹی نہیں ملی" text="Try another name or city." />
      ) : (
        <div className="space-y-3">
          {items.map((bc) => (
            <OpenBcCard key={bc._id} bc={bc} onJoined={markPending} />
          ))}
          {page < pages && (
            <Button variant="secondary" full loading={loadingMore} onClick={() => load(page + 1, true)}>
              <Bi en="Load more" ur="مزید دیکھیں" />
            </Button>
          )}
        </div>
      )}
    </Page>
  );
}
