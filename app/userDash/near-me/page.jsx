"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { FiMapPin, FiNavigation, FiUsers, FiX } from "react-icons/fi";
import { Bi, Button, Card, EmptyState, ErrorBox, Field, ListRow, Loading, Page, StatusBadge, Tabs } from "@/app/ui";
import { W } from "@/app/utils/words";
import { memberApi } from "@/app/utils/api";
import OpenBcCard from "../_components/OpenBcCard";

const TABS = [
  { value: "committee", en: "BCs", ur: "کمیٹیاں" },
  { value: "organizer", en: "Organizers", ur: "منتظمین" },
];

// Round to about 1 km so the exact spot is never sent or shown.
const rough = (n) => Math.round(n * 100) / 100;

export default function NearMePage() {
  const [tab, setTab] = useState("committee");
  const [coords, setCoords] = useState(null);
  const [locating, setLocating] = useState(false);
  const [cityInput, setCityInput] = useState("");
  const [city, setCity] = useState("");
  const [items, setItems] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [error, setError] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const reqId = useRef(0);
  const ready = !!coords || !!city;

  useEffect(() => {
    const t = setTimeout(() => setCity(cityInput.trim()), 400);
    return () => clearTimeout(t);
  }, [cityInput]);

  const askLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      toast.error("This phone cannot share location. Type your city instead.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: rough(pos.coords.latitude), lng: rough(pos.coords.longitude) });
        setLocating(false);
      },
      () => {
        setLocating(false);
        toast.error("Location is off. Type your city instead.");
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 600000 }
    );
  };

  const load = useCallback(
    async (p, append) => {
      const id = ++reqId.current;
      if (append) setLoadingMore(true);
      else {
        setItems(null);
        setError("");
      }
      try {
        const qs = new URLSearchParams({ type: tab, radius: "50", city, page: String(p) });
        if (coords) {
          qs.set("lat", String(coords.lat));
          qs.set("lng", String(coords.lng));
        }
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
    [tab, city, coords]
  );

  useEffect(() => {
    if (ready) load(1, false);
  }, [ready, load]);

  const markPending = (bcId) => setItems((list) => list.map((b) => (b._id === bcId ? { ...b, isPending: true } : b)));

  return (
    <Page title={W.nearMe.en} urdu={W.nearMe.ur} back="/userDash/explore">
      <Tabs tabs={TABS} value={tab} onChange={setTab} />

      <div className="space-y-3">
        {coords ? (
          <div className="flex min-h-[44px] items-center justify-between gap-2 rounded-xl border border-line bg-white px-4">
            <span className="inline-flex items-center gap-2 text-[15px] font-medium text-ink-800">
              <FiNavigation className="h-4 w-4 text-primary-700" aria-hidden />
              Using your location (50 km)
            </span>
            <Button variant="ghost" size="sm" icon={FiX} onClick={() => setCoords(null)}>
              Stop
            </Button>
          </div>
        ) : (
          <Button full size="lg" icon={FiMapPin} loading={locating} onClick={askLocation}>
            <Bi en="Use my location" ur="میرا مقام استعمال کریں" />
          </Button>
        )}
        <Field label="Or type your city" urdu="یا اپنا شہر لکھیں" placeholder="e.g. Lahore" value={cityInput} onChange={(e) => setCityInput(e.target.value)} />
      </div>

      {!ready ? (
        <EmptyState icon={FiMapPin} title="Find BCs near you" urdu="اپنے قریب کمیٹیاں دیکھیں" text="Tap Use my location, or type your city." />
      ) : error ? (
        <ErrorBox message={error} onRetry={() => load(1, false)} />
      ) : !items ? (
        <Loading rows={3} />
      ) : !items.length ? (
        <EmptyState
          icon={tab === "committee" ? FiMapPin : FiUsers}
          title={tab === "committee" ? "No BCs near you yet" : "No organizers near you yet"}
          urdu={tab === "committee" ? "آپ کے قریب کوئی کمیٹی نہیں" : "آپ کے قریب کوئی منتظم نہیں"}
          text="Try another city."
        />
      ) : (
        <div className="space-y-3">
          {tab === "committee" ? (
            items.map((bc) => <OpenBcCard key={bc._id} bc={bc} onJoined={markPending} />)
          ) : (
            <Card padding="p-0" className="divide-y divide-line overflow-hidden">
              {items.map((o) => (
                <ListRow
                  key={o._id}
                  avatar={o.name}
                  title={o.name}
                  subtitle={[o.distanceKm != null ? `${o.distanceKm} km` : "", o.city].filter(Boolean).join(" · ")}
                  right={o.verificationStatus === "verified" ? <StatusBadge status="verifiedId" /> : null}
                  href={`/userDash/organizer/${o._id}`}
                />
              ))}
            </Card>
          )}
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
