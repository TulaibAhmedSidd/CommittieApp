"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiKey, FiLock, FiPhone, FiSlash, FiUserPlus, FiUsers } from "react-icons/fi";
import { Bi, Button, Card, EmptyState, ErrorBox, Field, ListRow, Loading, MoreMenu, Page, ShareBox, Sheet, Tabs, useConfirm } from "../../ui";
import { W } from "../../utils/words";
import { adminApi } from "../../utils/api";
import { getSession } from "../../utils/session";
import { formatPkPhone } from "../../utils/phone";

const TABS = [
  { value: "pending", en: "Waiting", ur: "منتظر" },
  { value: "approved", en: "Active", ur: "فعال" },
  { value: "rejected", en: "Rejected", ur: "رد شدہ" },
];

const EMPTY = { pending: "No one is waiting", approved: "No active organizers", rejected: "No one is rejected" };

function AddOrganizerSheet({ open, onClose }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [invite, setInvite] = useState(null);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const close = () => {
    onClose(!!invite);
    setForm({ name: "", phone: "", email: "" });
    setInvite(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const d = await adminApi.post("/api/admin/organizers", form);
      setInvite(d.invite);
      toast.success("Organizer added. Send them the link.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onClose={close} title="Add organizer" urdu="منتظم شامل کریں">
      {invite ? (
        <div className="space-y-4">
          <p className="text-[15px] text-ink-700">Send this link so they can set their password.</p>
          <ShareBox link={invite.link} text={invite.text} waHref={invite.waLink} />
          <Button variant="secondary" full onClick={close}>
            Done
          </Button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={submit}>
          <Field label={W.name.en} urdu={W.name.ur} value={form.name} onChange={set("name")} required />
          <Field
            label={W.phone.en}
            urdu={W.phone.ur}
            prefix={<FiPhone />}
            type="tel"
            inputMode="tel"
            placeholder="0300 1234567"
            value={form.phone}
            onChange={set("phone")}
            required
          />
          <Field label={W.email.en} urdu={W.email.ur} type="email" value={form.email} onChange={set("email")} />
          <Button type="submit" full size="lg" loading={saving}>
            Add organizer
          </Button>
        </form>
      )}
    </Sheet>
  );
}

export default function OrganizersPage() {
  const [isSuper, setIsSuper] = useState(null);
  const [tab, setTab] = useState("pending");
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [adding, setAdding] = useState(false);
  const [linkFor, setLinkFor] = useState(null);
  const confirm = useConfirm();

  useEffect(() => setIsSuper(!!getSession("admin")?.account?.isSuperAdmin), []);

  const load = useCallback(() => {
    setError("");
    setRows(null);
    adminApi
      .get(`/api/admin/organizers?status=${tab}`)
      .then((d) => setRows(d.organizers || []))
      .catch((e) => setError(e.message));
  }, [tab]);

  useEffect(() => {
    if (isSuper) load();
  }, [isSuper, load]);

  const setStatus = async (o, status) => {
    if (status === "rejected") {
      const yes = await confirm({
        title: tab === "approved" ? `Block ${o.name}?` : `Reject ${o.name}?`,
        text: tab === "approved" ? "They will be logged out and can't use the app as an organizer." : "They will not be able to create BCs.",
        confirmText: tab === "approved" ? "Block" : W.reject.en,
        danger: true,
      });
      if (!yes) return;
    }
    setBusy(`${o._id}-${status}`);
    try {
      await adminApi.patch(`/api/admin/organizers/${o._id}`, { status });
      setRows((list) => list.filter((x) => x._id !== o._id));
      toast.success(status === "approved" ? `${o.name} is approved.` : tab === "approved" ? `${o.name} is blocked.` : `${o.name} is rejected.`);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy("");
    }
  };

  const makeLink = async (o) => {
    try {
      const d = await adminApi.post(`/api/admin/organizers/${o._id}/link`);
      setLinkFor({ name: o.name, ...d.invite });
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (isSuper === null) return <Loading rows={2} />;
  if (!isSuper) {
    return (
      <Page title="Organizers" urdu="منتظمین">
        <EmptyState icon={FiLock} title="Only the super admin can see this." urdu="یہ صرف سپر ایڈمن دیکھ سکتے ہیں" />
      </Page>
    );
  }

  const me = getSession("admin")?.account?._id;
  const subtitle = (o) => [formatPkPhone(o.phone) || o.email, o.city, `${o.bcCount || 0} BCs`].filter(Boolean).join(" · ");

  const actions = (o) => {
    const b = (s) => busy === `${o._id}-${s}`;
    if (tab === "pending") {
      return (
        <div className="flex gap-2 px-4 pb-3">
          <Button variant="danger" full loading={b("rejected")} disabled={!!busy} onClick={() => setStatus(o, "rejected")}>
            <Bi {...W.reject} />
          </Button>
          <Button full loading={b("approved")} disabled={!!busy} onClick={() => setStatus(o, "approved")}>
            <Bi {...W.approve} />
          </Button>
        </div>
      );
    }
    return null;
  };

  const right = (o) => {
    if (tab === "rejected") {
      return (
        <Button size="sm" loading={busy === `${o._id}-approved`} disabled={!!busy} onClick={() => setStatus(o, "approved")}>
          {W.approve.en}
        </Button>
      );
    }
    if (tab === "approved") {
      return (
        <MoreMenu
          items={[
            { label: "New password link", urdu: "نیا پاس ورڈ لنک", icon: FiKey, onClick: () => makeLink(o) },
            { label: "Block", urdu: "بلاک کریں", icon: FiSlash, danger: true, hidden: o.isSuperAdmin || o._id === me, onClick: () => setStatus(o, "rejected") },
          ]}
        />
      );
    }
    return null;
  };

  let body;
  if (error) body = <ErrorBox message={error} onRetry={load} />;
  else if (!rows) body = <Loading rows={3} />;
  else if (!rows.length) body = <EmptyState icon={FiUsers} title={EMPTY[tab]} />;
  else
    body = (
      <Card padding="p-0" className="divide-y divide-line overflow-hidden">
        {rows.map((o) => (
          <div key={o._id}>
            <ListRow avatar={o.name} title={o.name} subtitle={subtitle(o)} right={right(o)} />
            {actions(o)}
          </div>
        ))}
      </Card>
    );

  return (
    <Page
      title="Organizers"
      urdu="منتظمین"
      action={
        <Button icon={FiUserPlus} full onClick={() => setAdding(true)}>
          Add organizer
        </Button>
      }
    >
      <Tabs tabs={TABS} value={tab} onChange={setTab} />
      {body}
      <AddOrganizerSheet
        open={adding}
        onClose={(added) => {
          setAdding(false);
          if (added && tab === "approved") load();
        }}
      />
      <Sheet open={!!linkFor} onClose={() => setLinkFor(null)} title="New password link" urdu="نیا پاس ورڈ لنک">
        {linkFor && (
          <div className="space-y-4">
            <p className="text-[15px] text-ink-700">Send this to {linkFor.name}. It works for 1 hour.</p>
            <ShareBox link={linkFor.link} text={linkFor.text} waHref={linkFor.waLink} />
          </div>
        )}
      </Sheet>
    </Page>
  );
}
