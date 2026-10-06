"use client";

import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { FiUserPlus, FiSearch, FiUsers, FiLink, FiKey, FiPhone, FiTrash2, FiPlusCircle } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { Page, Card, ListRow, Button, Field, Sheet, ShareBox, StatusBadge, EmptyState, Loading, ErrorBox, Bi, Avatar, useConfirm } from "../../ui";
import { W } from "../../utils/words";
import { adminApi } from "../../utils/api";
import { useApi } from "../../utils/useApi";
import { waLink } from "../../utils/whatsapp";

const showPhone = (p) => (p ? String(p).replace(/^\+92/, "0") : "");

export default function MembersPage() {
  const { data, error, loading, reload } = useApi("admin", "/api/admin/members");
  const [q, setQ] = useState("");
  const [adding, setAdding] = useState(false);
  const [person, setPerson] = useState(null);

  const list = useMemo(
    () => (data?.members || []).filter((m) => !q || m.name.toLowerCase().includes(q.toLowerCase()) || (m.phone || "").includes(q.replace(/^0/, ""))),
    [data, q]
  );

  return (
    <Page
      title={W.members.en}
      urdu={W.members.ur}
      subtitle="Everyone who is in your BCs or joined with your link."
      action={
        <Button icon={FiUserPlus} onClick={() => setAdding(true)} full>
          <Bi {...W.addMember} />
        </Button>
      }
    >
      {error && <ErrorBox message={error} onRetry={reload} />}
      {loading && !data ? (
        <Loading rows={3} />
      ) : data?.members.length ? (
        <>
          <Field prefix={<FiSearch />} placeholder="Search by name or phone" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search members" />
          <Card padding="p-0" className="divide-y divide-line overflow-hidden">
            {list.map((m) => (
              <ListRow
                key={m._id}
                avatar={m.name}
                title={m.name}
                subtitle={[showPhone(m.phone), m.bcs.length ? `${m.bcs.length} BC${m.bcs.length > 1 ? "s" : ""}` : "Not in a BC"].filter(Boolean).join(" · ")}
                right={m.status === "invited" ? <StatusBadge status="invited" /> : m.verificationStatus === "verified" ? <StatusBadge status="verifiedId" /> : null}
                onClick={() => setPerson(m)}
              />
            ))}
            {!list.length && <p className="px-4 py-6 text-center text-sm text-ink-500">No one matches “{q}”.</p>}
          </Card>
        </>
      ) : (
        <EmptyState
          icon={FiUsers}
          title="No members yet"
          urdu="ابھی کوئی ممبر نہیں"
          text="Add family members yourself, or send your invite link on WhatsApp."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button icon={FiUserPlus} onClick={() => setAdding(true)}>
                <Bi {...W.addMember} />
              </Button>
              <Button variant="secondary" icon={FiLink} href="/admin/invite">
                <Bi {...W.inviteLink} />
              </Button>
            </div>
          }
        />
      )}

      <AddSheet open={adding} onClose={() => setAdding(false)} onAdded={reload} />
      <PersonSheet member={person} onClose={() => setPerson(null)} onChanged={reload} />
    </Page>
  );
}

function AddSheet({ open, onClose, onAdded }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);

  const close = () => {
    setResult(null);
    setForm({ name: "", phone: "", email: "" });
    onClose();
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await adminApi.post("/api/admin/members", form);
      onAdded();
      setResult(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onClose={close} title={W.addMember.en} urdu={W.addMember.ur}>
      {result ? (
        result.invite ? (
          <div className="space-y-4">
            <p className="text-[15px] text-ink-800">
              <b>{result.member.name}</b> is added. Send them this link to set a password.
            </p>
            <ShareBox link={result.invite.link} text={result.invite.text} waHref={result.invite.waLink} note="The link works for 7 days." />
            <Button variant="secondary" full onClick={() => setResult(null) || setForm({ name: "", phone: "", email: "" })}>
              Add another person
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-[15px] text-ink-800">
              <b>{result.member.name}</b> already has an account. They are now in your members list.
            </p>
            <Button full onClick={close}>
              Done
            </Button>
          </div>
        )
      ) : (
        <form className="space-y-4" onSubmit={submit}>
          <Field label={W.name.en} urdu={W.name.ur} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Field label={W.phone.en} urdu={W.phone.ur} type="tel" inputMode="tel" placeholder="0300 1234567" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <Field label={W.email.en} urdu={W.email.ur} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Button type="submit" full size="lg" loading={saving}>
            <Bi {...W.addMember} />
          </Button>
        </form>
      )}
    </Sheet>
  );
}

function PersonSheet({ member, onClose, onChanged }) {
  const confirm = useConfirm();
  const [invite, setInvite] = useState(null);
  const [picking, setPicking] = useState(false);
  const [bcs, setBcs] = useState(null);
  const [busy, setBusy] = useState("");
  if (!member) return null;
  const m = member;

  const close = () => {
    setInvite(null);
    setPicking(false);
    onClose();
  };

  const makeLink = async () => {
    setBusy("link");
    try {
      const d = await adminApi.post(`/api/admin/members/${m._id}/link`, {});
      setInvite(d.invite);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy("");
    }
  };

  const openPicker = async () => {
    setPicking(true);
    try {
      const d = await adminApi.get("/api/committee");
      setBcs(d.committees.filter((c) => c.stage === "upcoming" && c.membersCount < c.maxMembers && !m.bcs.some((b) => b._id === c._id)));
    } catch (e) {
      toast.error(e.message);
    }
  };

  const addTo = async (bc) => {
    setBusy(bc._id);
    try {
      await adminApi.post(`/api/committee/${bc._id}/members`, { memberIds: [m._id] });
      toast.success(`${m.name} added to ${bc.name}.`);
      onChanged();
      close();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy("");
    }
  };

  const removeFromList = async () => {
    if (!(await confirm({ title: `Remove ${m.name} from your list?`, text: "Their account stays. They just won't show in your members.", confirmText: "Remove", danger: true }))) return;
    try {
      await adminApi.del(`/api/admin/members/${m._id}`);
      toast.success("Removed from your list.");
      onChanged();
      close();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <Sheet open onClose={close} title={m.name}>
      {invite ? (
        <div className="space-y-4">
          <p className="text-[15px] text-ink-800">{invite.purpose === "invite" ? "Send this new invite link:" : "Send this link to set a new password (works for 1 hour):"}</p>
          <ShareBox link={invite.link} text={invite.text} waHref={invite.waLink} />
          <Button variant="secondary" full onClick={() => setInvite(null)}>
            Back
          </Button>
        </div>
      ) : picking ? (
        <div className="space-y-3">
          <p className="font-semibold text-ink-800">Add to which BC?</p>
          {bcs === null ? (
            <Loading rows={1} />
          ) : bcs.length ? (
            <Card padding="p-0" className="divide-y divide-line overflow-hidden">
              {bcs.map((bc) => (
                <ListRow key={bc._id} title={bc.name} subtitle={`${bc.membersCount}/${bc.maxMembers} members`} onClick={() => addTo(bc)} right={busy === bc._id ? "…" : <FiPlusCircle className="h-5 w-5 text-primary-600" />} />
              ))}
            </Card>
          ) : (
            <p className="rounded-lg bg-surface-100 px-3 py-4 text-sm text-ink-600">No upcoming BC has a free place. Create a new BC first.</p>
          )}
          <Button variant="secondary" full onClick={() => setPicking(false)}>
            Back
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar name={m.name} size="lg" />
            <div>
              <p className="font-semibold text-ink-900">{showPhone(m.phone)}</p>
              {m.email && <p className="text-sm text-ink-500">{m.email}</p>}
              {m.status === "invited" && <StatusBadge status="invited" className="mt-1" />}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" icon={FiPhone} href={m.phone ? `tel:${m.phone}` : undefined} disabled={!m.phone}>
              Call
            </Button>
            <Button variant="secondary" icon={FaWhatsapp} href={m.phone ? waLink(m.phone, `Assalam o Alaikum ${m.name},`) : undefined} disabled={!m.phone}>
              WhatsApp
            </Button>
          </div>
          {m.bcs.length > 0 && (
            <div>
              <p className="mb-1 text-sm font-semibold text-ink-700">In these BCs</p>
              <ul className="space-y-1 text-[15px] text-ink-800">
                {m.bcs.map((b) => (
                  <li key={b._id}>• {b.name}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="space-y-2">
            <Button full icon={FiPlusCircle} onClick={openPicker}>
              Add to a BC
            </Button>
            <Button full variant="secondary" icon={FiKey} onClick={makeLink} loading={busy === "link"}>
              {m.status === "invited" ? "New invite link" : "New password link"}
            </Button>
            <Button full variant="danger" icon={FiTrash2} onClick={removeFromList}>
              Remove from my list
            </Button>
          </div>
        </div>
      )}
    </Sheet>
  );
}
