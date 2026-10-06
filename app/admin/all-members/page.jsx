"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { FiMapPin, FiSearch, FiUsers } from "react-icons/fi";
import { Bi, Button, Card, EmptyState, ErrorBox, Field, ListRow, Loading, Page, StatusBadge } from "../../ui";
import { W } from "../../utils/words";
import { adminApi } from "../../utils/api";

function useDebounced(value, ms = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export default function FindMembersPage() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [geo, setGeo] = useState(null);
  const [locating, setLocating] = useState(false);
  const [items, setItems] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [error, setError] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [sending, setSending] = useState(null);
  const reqId = useRef(0);

  const dq = useDebounced(q.trim());
  const dCity = useDebounced(city.trim());

  const load = useCallback(
    async (nextPage = 1) => {
      const id = ++reqId.current;
      const params = new URLSearchParams({ type: "member", q: dq, city: dCity, page: String(nextPage) });
      if (geo) {
        params.set("lat", String(geo.lat));
        params.set("lng", String(geo.lng));
        params.set("radius", "50");
      }
      if (nextPage === 1) setError("");
      else setLoadingMore(true);
      try {
        const d = await adminApi.get(`/api/discovery?${params}`);
        if (id !== reqId.current) return;
        setItems((prev) => (nextPage === 1 ? d.items || [] : [...(prev || []), ...(d.items || [])]));
        setPage(d.page || nextPage);
        setPages(d.pages || 1);
      } catch (e) {
        if (id !== reqId.current) return;
        if (nextPage === 1) setError(e.message);
        else toast.error(e.message);
      } finally {
        if (id === reqId.current) setLoadingMore(false);
      }
    },
    [dq, dCity, geo]
  );

  useEffect(() => {
    load(1);
  }, [load]);

  const toggleNearMe = () => {
    if (geo) {
      setGeo(null);
      return;
    }
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      toast.error("This phone can't share its location.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        setGeo({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setLocating(false);
        toast.error("Could not get your location. Please allow location and try again.");
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 }
    );
  };

  const addToList = async (m) => {
    setSending(m._id);
    try {
      await adminApi.post("/api/member/pool", { memberId: m._id });
      setItems((list) => list.map((x) => (x._id === m._id ? { ...x, requested: true } : x)));
      toast.success("Request sent. They need to accept.");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSending(null);
    }
  };

  const right = (m) => {
    if (m.linked) return <StatusBadge label="In your list" tone="green" />;
    if (m.requested) return <StatusBadge label="Request sent" tone="amber" />;
    return (
      <Button size="sm" loading={sending === m._id} onClick={() => addToList(m)}>
        Add to my list
      </Button>
    );
  };

  const subtitle = (m) => {
    const parts = [m.city || "No city"];
    if (typeof m.distanceKm === "number") parts.push(`${m.distanceKm} km`);
    if (m.verificationStatus === "verified") parts.push("Verified");
    return parts.join(" · ");
  };

  let list;
  if (error) list = <ErrorBox message={error} onRetry={() => load(1)} />;
  else if (!items) list = <Loading rows={3} />;
  else if (!items.length)
    list = <EmptyState icon={FiUsers} title="No one found" urdu="کوئی نہیں ملا" text="Try another name or city." />;
  else
    list = (
      <>
        <Card padding="p-0" className="divide-y divide-line overflow-hidden">
          {items.map((m) => (
            <ListRow key={m._id} avatar={m.name} title={m.name} subtitle={subtitle(m)} right={right(m)} />
          ))}
        </Card>
        {page < pages && (
          <Button variant="secondary" full loading={loadingMore} onClick={() => load(page + 1)}>
            Load more
          </Button>
        )}
      </>
    );

  return (
    <Page title="Find members" urdu="ممبرز تلاش کریں" subtitle="People must accept before they join your list.">
      <div className="space-y-3">
        <Field
          label="Name"
          urdu="نام"
          prefix={<FiSearch />}
          type="search"
          placeholder="Search by name"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Field label="City" urdu="شہر" placeholder="e.g. Lahore" value={city} onChange={(e) => setCity(e.target.value)} />
        <Button variant={geo ? "primary" : "secondary"} full icon={FiMapPin} loading={locating} onClick={toggleNearMe} aria-pressed={!!geo}>
          <Bi {...W.nearMe} />
          {geo && <span className="text-sm font-normal">(on)</span>}
        </Button>
      </div>
      <div className="space-y-3">{list}</div>
    </Page>
  );
}
