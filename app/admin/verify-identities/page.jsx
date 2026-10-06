"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiCheckCircle, FiFileText } from "react-icons/fi";
import { Bi, Button, Card, EmptyState, ErrorBox, Loading, Page, SecureImage, Section, Sheet, useConfirm } from "../../ui";
import { W } from "../../utils/words";
import { adminApi } from "../../utils/api";
import { formatPkPhone } from "../../utils/phone";

function docsOf(p) {
  if (p.role === "Admin") return p.nicImage ? [{ key: "nic", label: "CNIC photo", url: p.nicImage }] : [];
  const list = [];
  if (p.nicFront) list.push({ key: "front", label: "CNIC front", url: p.nicFront });
  if (p.nicBack) list.push({ key: "back", label: "CNIC back", url: p.nicBack });
  if (p.electricityBill) list.push({ key: "bill", label: "Electricity bill", url: p.electricityBill });
  (p.documents || []).forEach((d, i) => d?.url && list.push({ key: `doc-${i}`, label: d.name || "Other paper", url: d.url }));
  return list;
}

function PersonCard({ person, onOpen }) {
  const count = docsOf(person).length;
  return (
    <Card padding="p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-ink-900">{person.name}</p>
          <p className="truncate text-[13px] text-ink-500">
            {[person.role === "Admin" ? "Organizer" : "Member", formatPkPhone(person.phone), person.city].filter(Boolean).join(" · ")}
          </p>
          <p className="text-[13px] text-ink-500">
            {count} {count === 1 ? "photo" : "photos"}
          </p>
        </div>
        <Button variant="secondary" icon={FiFileText} onClick={() => onOpen(person)}>
          Check documents
        </Button>
      </div>
    </Card>
  );
}

export default function VerifyIdentitiesPage() {
  const [people, setPeople] = useState(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(null);
  const [busy, setBusy] = useState("");
  const confirm = useConfirm();

  const load = useCallback(() => {
    setError("");
    adminApi
      .get("/api/admin/verify")
      .then((d) => {
        const members = (d.members || []).map((m) => ({ ...m, role: "Member" }));
        const admins = (d.admins || []).map((a) => ({ ...a, role: "Admin" }));
        setPeople([...admins, ...members]);
      })
      .catch((e) => setError(e.message));
  }, []);

  useEffect(load, [load]);

  const decide = async (status) => {
    const p = open;
    if (!p) return;
    if (status === "unverified") {
      const yes = await confirm({
        title: `Reject ${p.name}'s documents?`,
        urdu: "دستاویزات رد کریں؟",
        text: "They will be asked to upload clear photos again.",
        confirmText: "Reject",
        danger: true,
      });
      if (!yes) return;
    }
    setBusy(status);
    try {
      await adminApi.patch("/api/admin/verify", { userId: p._id, role: p.role, status });
      setPeople((list) => list.filter((x) => !(x._id === p._id && x.role === p.role)));
      setOpen(null);
      toast.success(status === "verified" ? `${p.name} is now verified.` : "Documents sent back.");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy("");
    }
  };

  const organizers = (people || []).filter((p) => p.role === "Admin");
  const members = (people || []).filter((p) => p.role === "Member");

  let body;
  if (error && !people) body = <ErrorBox message={error} onRetry={load} />;
  else if (!people) body = <Loading rows={3} />;
  else if (!people.length) body = <EmptyState icon={FiCheckCircle} title="Nothing to check" urdu="چیک کرنے کو کچھ نہیں" />;
  else
    body = (
      <>
        {organizers.length > 0 && (
          <Section title="Organizers" urdu="منتظمین" count={organizers.length}>
            <div className="space-y-3">
              {organizers.map((p) => (
                <PersonCard key={`a-${p._id}`} person={p} onOpen={setOpen} />
              ))}
            </div>
          </Section>
        )}
        {members.length > 0 && (
          <Section title={W.members.en} urdu={W.members.ur} count={members.length}>
            <div className="space-y-3">
              {members.map((p) => (
                <PersonCard key={`m-${p._id}`} person={p} onOpen={setOpen} />
              ))}
            </div>
          </Section>
        )}
      </>
    );

  const docs = open ? docsOf(open) : [];

  return (
    <Page title={W.verifyIdentity.en} urdu={W.verifyIdentity.ur}>
      {body}
      <Sheet
        open={!!open}
        onClose={() => setOpen(null)}
        title={open?.name || ""}
        size="lg"
        footer={
          <div className="flex gap-2">
            <Button variant="danger" full loading={busy === "unverified"} disabled={!!busy} onClick={() => decide("unverified")}>
              <Bi {...W.reject} />
            </Button>
            <Button full loading={busy === "verified"} disabled={!!busy} onClick={() => decide("verified")}>
              <Bi {...W.approve} />
            </Button>
          </div>
        }
      >
        {open && (
          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold text-ink-600">
                <Bi en="CNIC number" ur="شناختی کارڈ نمبر" />
              </p>
              <p className="text-lg font-semibold text-ink-900">{open.nicNumber || "Not given"}</p>
            </div>
            {docs.length === 0 ? (
              <EmptyState title="No photos added" urdu="کوئی تصویر نہیں" />
            ) : (
              docs.map((d) => (
                <div key={d.key} className="space-y-1.5">
                  <p className="text-sm font-semibold text-ink-600">{d.label}</p>
                  <div className="overflow-hidden rounded-lg border border-line bg-surface-100">
                    <SecureImage scope="admin" src={d.url} alt={d.label} className="h-56 w-full rounded-lg" />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </Sheet>
    </Page>
  );
}
