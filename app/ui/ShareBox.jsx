"use client";

import { useState } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import Button from "./Button";
import Bi from "./Bi";
import { W } from "../utils/words";
import { waLink } from "../utils/whatsapp";

/** Link + "Send on WhatsApp" + "Copy link". */
export default function ShareBox({ link, text, phone, waHref, note }) {
  const [copied, setCopied] = useState(false);
  const message = text || link;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", message);
    }
  };

  return (
    <div className="space-y-3">
      <div className="break-all rounded-lg border border-line bg-surface-100 px-3 py-2.5 text-sm text-ink-700">{link}</div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Button variant="whatsapp" size="lg" full icon={FaWhatsapp} href={waHref || waLink(phone, message)}>
          <Bi {...W.sendWhatsApp} />
        </Button>
        <Button variant="secondary" size="lg" full icon={copied ? FiCheck : FiCopy} onClick={copy}>
          {copied ? "Copied" : <Bi {...W.copyLink} />}
        </Button>
      </div>
      {note && <p className="text-sm text-ink-500">{note}</p>}
    </div>
  );
}
