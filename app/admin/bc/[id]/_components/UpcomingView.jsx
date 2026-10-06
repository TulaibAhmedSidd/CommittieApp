"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { FiUserPlus, FiPlay, FiCheck, FiX } from "react-icons/fi";
import { Card, Section, Button, Progress, ListRow, StatusBadge, ShareBox, Bi, EmptyState, useConfirm } from "../../../../ui";
import { W } from "../../../../utils/words";
import { adminApi } from "../../../../utils/api";
import { appOrigin } from "./util";
import AddMemberSheet from "./AddMemberSheet";
import StartSheet from "./StartSheet";
import MemberSheet from "./MemberSheet";

const monthName = (d) => (d ? new Date(d).toLocaleDateString("en-GB", { month: "long", year: "numeric" }) : "");

export default function UpcomingView({ c, reload, isNew }) {
  const confirm = useConfirm();
  const [adding, setAdding] = useState(false);
  const [starting, setStarting] = useState(false);
  const [person, setPerson] = useState(null);
  const [busy, setBusy] = useState("");
  const full = c.members.length >= c.maxMembers;
  const link = `${appOrigin()}/bc/${c._id}`;
  const shareText = `Assalam o Alaikum! Join my BC "${c.name}": Rs ${c.monthlyAmount.toLocaleString()} a month, ${c.maxMembers} members, starts ${monthName(c.startDate)}. Ask to join here: ${link}`;

  const decide = async (memberId, action) => {
    if (action === "reject" && !(await confirm({ title: "Reject this request?", confirmText: "Reject", danger: true }))) return;
    setBusy(memberId + action);
    try {
      await adminApi.post(`/api/committee/${c._id}/request`, { action, memberId });
      toast.success(action === "approve" ? "Added to the BC." : "Request rejected.");
      reload();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy("");
    }
  };

  return (
    <>
      <Card padding="p-5" className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-sm text-ink-600">
              <Bi en="Members" ur="ممبرز" />
            </p>
            <p className="text-2xl font-bold text-ink-900">
              {c.members.length} <span className="text-base font-medium text-ink-500">of {c.maxMembers}</span>
            </p>
          </div>
          <p className="text-right text-sm text-ink-600">
            Starts
            <br />
            <b className="text-ink-900">{monthName(c.startDate)}</b>
          </p>
        </div>
        <Progress current={c.members.length} total={c.maxMembers} label={false} />
        {full ? (
          <Button size="lg" full icon={FiPlay} onClick={() => setStarting(true)}>
            <Bi {...W.startBc} />
          </Button>
        ) : (
          <Button size="lg" full icon={FiUserPlus} onClick={() => setAdding(true)}>
            <Bi {...W.addMember} />
          </Button>
        )}
        {!full && <p className="text-center text-sm text-ink-500">When all {c.maxMembers} members are in, you can start the BC.</p>}
      </Card>

      {c.pendingMembers.length > 0 && (
        <Section title="Want to join" urdu="شامل ہونا چاہتے ہیں" count={c.pendingMembers.length}>
          <Card padding="p-0" className="divide-y divide-line overflow-hidden">
            {c.pendingMembers.map((m) => (
              <ListRow
                key={m._id}
                avatar={m.name}
                title={m.name}
                subtitle={[m.city, m.verificationStatus === "verified" ? "ID verified" : null].filter(Boolean).join(" · ") || "New member"}
                right={
                  <>
                    <Button size="sm" variant="secondary" aria-label={`Reject ${m.name}`} onClick={() => decide(m._id, "reject")} loading={busy === m._id + "reject"} icon={FiX} />
                    <Button size="sm" icon={FiCheck} onClick={() => decide(m._id, "approve")} loading={busy === m._id + "approve"} disabled={full}>
                      {W.approve.en}
                    </Button>
                  </>
                }
              />
            ))}
          </Card>
        </Section>
      )}

      <Section
        title="In this BC"
        urdu="اس کمیٹی میں"
        count={c.members.length}
        action={
          !full && c.members.length > 0 ? (
            <Button size="sm" variant="ghost" icon={FiUserPlus} onClick={() => setAdding(true)}>
              Add
            </Button>
          ) : null
        }
      >
        {c.members.length ? (
          <Card padding="p-0" className="divide-y divide-line overflow-hidden">
            {c.members.map((m) => (
              <ListRow key={m._id} avatar={m.name} title={m.name} subtitle={m.phone ? m.phone.replace("+92", "0") : m.city} onClick={() => setPerson(m)} />
            ))}
          </Card>
        ) : (
          <EmptyState icon={FiUserPlus} title="No members yet" urdu="ابھی کوئی ممبر نہیں" text={isNew ? "Great, your BC is ready! Add family members, or share the BC link below on WhatsApp." : "Add members yourself, or share the link below."} />
        )}
      </Section>

      {!full && (
        <Section title="Share this BC" urdu="یہ کمیٹی شیئر کریں">
          <Card padding="p-4">
            <p className="mb-3 text-sm text-ink-600">People open the link, make an account and ask to join. You approve them here.</p>
            <ShareBox link={link} text={shareText} />
          </Card>
        </Section>
      )}

      <AddMemberSheet open={adding} onClose={() => setAdding(false)} c={c} onAdded={reload} />
      <StartSheet open={starting} onClose={() => setStarting(false)} c={c} onStarted={reload} />
      <MemberSheet member={person} onClose={() => setPerson(null)} c={c} onChanged={reload} canRemove />
    </>
  );
}
