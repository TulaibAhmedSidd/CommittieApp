"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { FiSearch } from "react-icons/fi";
import { Sheet, Tabs, Field, Button, ShareBox, ListRow, Card, Bi, Loading } from "../../../../ui";
import { W } from "../../../../utils/words";
import { adminApi } from "../../../../utils/api";
import { displayPhone } from "./util";

/** Add someone new (gets a WhatsApp invite) or pick from my members list. */
export default function AddMemberSheet({ open, onClose, c, onAdded }) {
  const [tab, setTab] = useState("new");
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [invite, setInvite] = useState(null);
  const [mine, setMine] = useState(null);
  const [picked, setPicked] = useState([]);
  const [q, setQ] = useState("");
  const free = c.maxMembers - c.members.length;

  useEffect(() => {
    if (!open) return;
    setInvite(null);
    setPicked([]);
    setForm({ name: "", phone: "", email: "" });
    adminApi.get("/api/admin/members").then((d) => setMine(d.members)).catch(() => setMine([]));
  }, [open]);

  const inBc = useMemo(() => new Set([...c.members, ...c.pendingMembers].map((m) => m._id)), [c]);
  const available = (mine || []).filter((m) => !inBc.has(m._id) && (!q || m.name.toLowerCase().includes(q.toLowerCase())));

  const addNew = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await adminApi.post("/api/admin/members", { ...form, committeeId: c._id });
      onAdded();
      if (data.invite) setInvite({ ...data.invite, name: data.member.name, phone: data.member.phone });
      else {
        toast.success(`${data.member.name} already had an account and is now in the BC.`);
        onClose();
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addPicked = async () => {
    setSaving(true);
    try {
      const { added } = await adminApi.post(`/api/committee/${c._id}/members`, { memberIds: picked });
      toast.success(`${added} added to the BC.`);
      onAdded();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onClose={onClose} title={W.addMember.en} urdu={W.addMember.ur}>
      {invite ? (
        <div className="space-y-4">
          <p className="text-[15px] text-ink-800">
            <b>{invite.name}</b> is added. Send them this link so they can set a password and see the BC.
          </p>
          <ShareBox link={invite.link} text={invite.text} waHref={invite.waLink} note="The link works for 7 days. You can make a new one from Members." />
          <Button variant="secondary" full onClick={() => {
              setInvite(null);
              setForm({ name: "", phone: "", email: "" });
            }}>
            Add another person
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-ink-600">{free} place{free === 1 ? "" : "s"} left.</p>
          <Tabs
            value={tab}
            onChange={setTab}
            tabs={[
              { value: "new", en: "New person", ur: "نیا شخص" },
              { value: "mine", en: "From my members", ur: "میرے ممبرز سے" },
            ]}
          />
          {tab === "new" ? (
            <form className="space-y-4" onSubmit={addNew}>
              <Field label={W.name.en} urdu={W.name.ur} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Field label={W.phone.en} urdu={W.phone.ur} type="tel" inputMode="tel" placeholder="0300 1234567" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              <Field label={W.email.en} urdu={W.email.ur} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Button type="submit" full size="lg" loading={saving} disabled={free < 1}>
                <Bi {...W.addMember} />
              </Button>
            </form>
          ) : mine === null ? (
            <Loading rows={2} />
          ) : (
            <div className="space-y-3">
              <Field prefix={<FiSearch />} placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search members" />
              {available.length ? (
                <Card padding="p-0" className="max-h-[45vh] divide-y divide-line overflow-y-auto">
                  {available.map((m) => {
                    const on = picked.includes(m._id);
                    return (
                      <label key={m._id} className="flex cursor-pointer items-center gap-3 pr-4 hover:bg-surface-100">
                        <div className="min-w-0 flex-1">
                          <ListRow avatar={m.name} title={m.name} subtitle={displayPhone(m.phone)} />
                        </div>
                        <input
                          type="checkbox"
                          className="h-6 w-6 accent-primary-600"
                          checked={on}
                          disabled={!on && picked.length >= free}
                          onChange={() => setPicked(on ? picked.filter((x) => x !== m._id) : [...picked, m._id])}
                        />
                      </label>
                    );
                  })}
                </Card>
              ) : (
                <p className="rounded-lg bg-surface-100 px-3 py-4 text-center text-sm text-ink-500">No one else in your members list. Use “New person”.</p>
              )}
              <Button full size="lg" disabled={!picked.length} loading={saving} onClick={addPicked}>
                Add {picked.length || ""} to BC
              </Button>
            </div>
          )}
        </div>
      )}
    </Sheet>
  );
}
