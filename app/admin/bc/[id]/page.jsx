"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { FiEdit2, FiList, FiCalendar, FiXCircle, FiTrash2 } from "react-icons/fi";
import { Page, Loading, ErrorBox, MoreMenu, StatusBadge, Money, useConfirm } from "../../../ui";
import { useApi } from "../../../utils/useApi";
import { adminApi } from "../../../utils/api";
import UpcomingView from "./_components/UpcomingView";
import RunningView from "./_components/RunningView";
import FinishedView from "./_components/FinishedView";
import EditSheet from "./_components/EditSheet";
import TurnOrderSheet from "./_components/TurnOrderSheet";
import PastMonthsSheet from "./_components/PastMonthsSheet";

export default function OrganizerBcPage({ params }) {
  const router = useRouter();
  const isNew = useSearchParams().get("new") === "1";
  const confirm = useConfirm();
  const { data, error, loading, reload } = useApi("admin", `/api/committee/${params.id}`);
  const [sheet, setSheet] = useState(null);
  const c = data?.committee;

  if (loading && !c) return <Loading />;
  if (error && !c) return <div className="p-4"><ErrorBox message={error} onRetry={reload} /></div>;
  if (!c) return null;

  const endEarly = async () => {
    const ok = await confirm({ title: "End this BC now?", text: "Use this only if the BC is stopping before all turns are done. Members will be told.", confirmText: "End BC", danger: true });
    if (!ok) return;
    try {
      await adminApi.patch(`/api/committee/${c._id}/status`, { action: "end_early", confirm: true });
      toast.success("BC ended.");
      reload();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const remove = async () => {
    const ok = await confirm({ title: "Delete this BC?", text: "This cannot be undone.", confirmText: "Delete", danger: true });
    if (!ok) return;
    try {
      await adminApi.del(`/api/committee?id=${c._id}`);
      toast.success("BC deleted.");
      router.replace("/admin");
    } catch (e) {
      toast.error(e.message);
    }
  };

  const moreItems = [
    { label: "Edit details", urdu: "تفصیل بدلیں", icon: FiEdit2, onClick: () => setSheet("edit"), hidden: c.stage === "finished" },
    { label: "Turn order", urdu: "باری کی ترتیب", icon: FiList, onClick: () => setSheet("turns"), hidden: !c.result.length },
    { label: "Past months", urdu: "پچھلے مہینے", icon: FiCalendar, onClick: () => setSheet("past"), hidden: c.stage !== "running" || c.currentMonth < 2 },
    { label: "End BC early", urdu: "کمیٹی ختم کریں", icon: FiXCircle, onClick: endEarly, danger: true, hidden: c.stage !== "running" },
    { label: "Delete BC", urdu: "کمیٹی حذف کریں", icon: FiTrash2, onClick: remove, danger: true, hidden: c.stage !== "upcoming" || c.membersCount > 0 },
  ];

  return (
    <Page
      title={c.name}
      back="/admin/bcs"
      subtitle={
        <span className="inline-flex flex-wrap items-center gap-2">
          <StatusBadge status={c.stage} />
          <span>
            <Money value={c.monthlyAmount} size="sm" /> a month · {c.maxMembers} members
          </span>
        </span>
      }
      action={<MoreMenu items={moreItems} />}
    >
      {c.stage === "upcoming" && <UpcomingView c={c} reload={reload} isNew={isNew} />}
      {c.stage === "running" && <RunningView c={c} reload={reload} />}
      {c.stage === "finished" && <FinishedView c={c} />}

      <EditSheet open={sheet === "edit"} onClose={() => setSheet(null)} c={c} onSaved={reload} />
      <TurnOrderSheet open={sheet === "turns"} onClose={() => setSheet(null)} c={c} />
      <PastMonthsSheet open={sheet === "past"} onClose={() => setSheet(null)} c={c} onChanged={reload} />
    </Page>
  );
}
