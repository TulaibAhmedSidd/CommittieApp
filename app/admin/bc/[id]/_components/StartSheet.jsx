"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiShuffle, FiList, FiArrowUp, FiArrowDown } from "react-icons/fi";
import { Sheet, Button, Bi, Card } from "../../../../ui";
import { W } from "../../../../utils/words";
import { adminApi } from "../../../../utils/api";
import { monthLabel } from "../../../../utils/bcRules";

/** Start BC: random draw or set the turn order by hand. */
export default function StartSheet({ open, onClose, c, onStarted }) {
  const [mode, setMode] = useState(null);
  const [order, setOrder] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setMode(null);
      setOrder(c.members.map((m) => ({ _id: m._id, name: m.name })));
    }
  }, [open, c.members]);

  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
  };

  const start = async () => {
    setSaving(true);
    try {
      await adminApi.post(`/api/committee/${c._id}/start`, { mode, order: mode === "manual" ? order.map((o) => o._id) : undefined });
      toast.success("BC started. Members have been told their turn.");
      onClose();
      onStarted();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={W.startBc.en}
      urdu={W.startBc.ur}
      footer={
        mode && (
          <Button full size="lg" loading={saving} onClick={start}>
            {mode === "random" ? "Do the draw and start" : "Start with this order"}
          </Button>
        )
      }
    >
      <p className="mb-4 text-[15px] text-ink-700">Who gets the pot first? Choose how to decide the turn order. It can't be changed later.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <OptionCard active={mode === "random"} onClick={() => setMode("random")} icon={FiShuffle} en="Random draw" ur="قرعہ اندازی" text="The app picks the order fairly." />
        <OptionCard active={mode === "manual"} onClick={() => setMode("manual")} icon={FiList} en="Set order myself" ur="ترتیب خود بنائیں" text="If the family already agreed." />
      </div>

      {mode === "manual" && (
        <Card padding="p-0" className="mt-4 divide-y divide-line overflow-hidden">
          {order.map((m, i) => (
            <div key={m._id} className="flex min-h-[56px] items-center gap-3 px-3">
              <span className="w-24 shrink-0 text-sm text-ink-500">
                {i + 1}. {monthLabel(c, i + 1)}
              </span>
              <span className="min-w-0 flex-1 truncate font-semibold text-ink-900">{m.name}</span>
              <button type="button" aria-label={`Move ${m.name} up`} onClick={() => move(i, -1)} disabled={i === 0} className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-600 hover:bg-surface-100 disabled:opacity-30">
                <FiArrowUp className="h-5 w-5" />
              </button>
              <button type="button" aria-label={`Move ${m.name} down`} onClick={() => move(i, 1)} disabled={i === order.length - 1} className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-600 hover:bg-surface-100 disabled:opacity-30">
                <FiArrowDown className="h-5 w-5" />
              </button>
            </div>
          ))}
        </Card>
      )}
    </Sheet>
  );
}

function OptionCard({ active, onClick, icon: Icon, en, ur, text }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex flex-col items-start gap-1 rounded-xl border-2 p-4 text-left transition-colors ${active ? "border-primary-500 bg-primary-50" : "border-line bg-white hover:border-primary-200"}`}
    >
      <Icon className="h-6 w-6 text-primary-600" aria-hidden />
      <span className="font-bold text-ink-900">
        <Bi en={en} ur={ur} stack />
      </span>
      <span className="text-sm text-ink-600">{text}</span>
    </button>
  );
}
