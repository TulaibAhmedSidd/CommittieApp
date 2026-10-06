"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { FiPhone, FiMessageCircle, FiUserMinus } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { Sheet, Button, Avatar, StatusBadge, useConfirm } from "../../../../ui";
import { adminApi } from "../../../../utils/api";
import { waLink } from "../../../../utils/whatsapp";
import ChatBox from "../../../../Components/ChatBox";
import { displayPhone } from "./util";

/** Contact a member, see their payout account, remove before start. */
export default function MemberSheet({ member, onClose, c, onChanged, canRemove = false }) {
  const confirm = useConfirm();
  const [chat, setChat] = useState(false);
  const [busy, setBusy] = useState(false);
  if (!member && !chat) return null;
  const m = member || {};

  const remove = async () => {
    if (!(await confirm({ title: `Remove ${m.name} from this BC?`, confirmText: "Remove", danger: true }))) return;
    setBusy(true);
    try {
      await adminApi.del(`/api/committee/${c._id}/members`, { memberId: m._id });
      toast.success("Removed.");
      onClose();
      onChanged();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  const pd = m.payoutDetails || {};
  return (
    <>
      <Sheet open={!!member} onClose={onClose} title={m.name} size="sm">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar name={m.name} size="lg" />
            <div>
              <p className="font-semibold text-ink-900">{displayPhone(m.phone) || "No phone"}</p>
              {m.verificationStatus === "verified" && <StatusBadge status="verifiedId" />}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Button variant="secondary" icon={FiPhone} href={m.phone ? `tel:${m.phone}` : undefined} disabled={!m.phone}>
              Call
            </Button>
            <Button variant="secondary" icon={FaWhatsapp} href={m.phone ? waLink(m.phone, `Assalam o Alaikum ${m.name},`) : undefined} disabled={!m.phone}>
              WhatsApp
            </Button>
            <Button variant="secondary" icon={FiMessageCircle} onClick={() => setChat(true)}>
              Message
            </Button>
          </div>
          <div className="rounded-xl bg-surface-100 p-3 text-sm">
            <p className="font-semibold text-ink-800">Payout account</p>
            {pd.iban || pd.bankName ? (
              <p className="mt-1 text-ink-700">
                {pd.accountTitle} · {pd.bankName}
                <br />
                <span className="font-mono">{pd.iban}</span>
              </p>
            ) : (
              <p className="mt-1 text-ink-500">Not added yet. Ask them to add it in their profile.</p>
            )}
          </div>
          {canRemove && (
            <Button variant="danger" full icon={FiUserMinus} onClick={remove} loading={busy}>
              Remove from BC
            </Button>
          )}
        </div>
      </Sheet>
      <ChatBox open={chat} onClose={() => setChat(false)} scope="admin" otherId={m._id} otherModel="Member" otherName={m.name} committeeId={c._id} />
    </>
  );
}
