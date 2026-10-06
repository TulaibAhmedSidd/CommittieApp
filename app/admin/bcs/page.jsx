"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FiPlus, FiSearch, FiLayers } from "react-icons/fi";
import { Page, Tabs, Button, EmptyState, Loading, ErrorBox, Bi, Field } from "../../ui";
import BcCard from "../../Components/BcCard";
import { W } from "../../utils/words";
import { useApi } from "../../utils/useApi";
import { getSession } from "../../utils/session";

function BcsInner() {
  const params = useSearchParams();
  const [tab, setTab] = useState(params.get("tab") || "running");
  const [q, setQ] = useState("");
  const isSuper = typeof window !== "undefined" && !!getSession("admin")?.account?.isSuperAdmin;
  const [all, setAll] = useState(false);
  const { data, error, loading, reload } = useApi("admin", `/api/committee${all ? "?all=1" : ""}`);

  const counts = useMemo(() => {
    const list = data?.committees || [];
    return { running: list.filter((c) => c.stage === "running").length, upcoming: list.filter((c) => c.stage === "upcoming").length, finished: list.filter((c) => c.stage === "finished").length };
  }, [data]);

  const list = useMemo(
    () => (data?.committees || []).filter((c) => c.stage === tab && (!q || c.name.toLowerCase().includes(q.toLowerCase()))),
    [data, tab, q]
  );

  return (
    <Page
      title={W.myBcs.en}
      urdu={W.myBcs.ur}
      action={
        <Button href="/admin/create" icon={FiPlus}>
          <Bi {...W.createBc} />
        </Button>
      }
    >
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: "running", en: "Running", ur: "جاری", count: counts.running },
          { value: "upcoming", en: "Coming up", ur: "آنے والی", count: counts.upcoming },
          { value: "finished", en: "Finished", ur: "مکمل", count: counts.finished },
        ]}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Field prefix={<FiSearch />} placeholder="Search by name" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search BCs" />
        </div>
        {isSuper && (
          <label className="flex min-h-[48px] items-center gap-2 text-sm font-medium text-ink-700">
            <input type="checkbox" checked={all} onChange={(e) => setAll(e.target.checked)} className="h-5 w-5 accent-primary-600" />
            Show all organizers' BCs
          </label>
        )}
      </div>
      {error && <ErrorBox message={error} onRetry={reload} />}
      {loading && !data ? (
        <Loading rows={2} />
      ) : list.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((c) => (
            <div key={c._id}>
              {all && c.organizerName && <p className="mb-1 text-xs font-medium text-ink-500">{c.organizerName}</p>}
              <BcCard c={c} href={`/admin/bc/${c._id}`} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={FiLayers} title={q ? "No BC with this name" : "Nothing here yet"} urdu={q ? undefined : "یہاں ابھی کچھ نہیں"} />
      )}
    </Page>
  );
}

export default function BcsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <BcsInner />
    </Suspense>
  );
}
