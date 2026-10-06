"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { Sheet } from "../ui";
import { apiFor } from "../utils/api";
import { getSession } from "../utils/session";

/**
 * Chat with one person, in a sheet. Polls every 5s while open.
 * <ChatBox open scope="member" otherId otherModel="Admin" otherName committeeId onClose />
 */
export default function ChatBox({ open, onClose, scope, otherId, otherModel, otherName, committeeId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);
  const me = getSession(scope)?.account?._id;
  const api = apiFor(scope);

  const load = useCallback(async () => {
    if (!otherId) return;
    try {
      const q = new URLSearchParams({ otherId, ...(committeeId ? { committeeId } : {}) });
      setMessages(await api.get(`/api/messages?${q}`));
    } catch (e) {
      setError(e.message);
    }
  }, [otherId, committeeId, api]);

  useEffect(() => {
    if (!open) return;
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [open, load]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  const send = async (e) => {
    e.preventDefault();
    const content = text.trim();
    if (!content) return;
    setSending(true);
    setError("");
    try {
      await api.post("/api/messages", { receiverId: otherId, receiverModel: otherModel, committeeId: committeeId || undefined, content });
      setText("");
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={otherName || "Chat"}
      footer={
        <form onSubmit={send} className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message"
            aria-label="Message"
            className="min-h-[48px] flex-1 rounded-xl border border-line px-3.5 outline-none focus:border-primary-500"
          />
          <button type="submit" disabled={sending || !text.trim()} aria-label="Send" className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white disabled:opacity-50">
            <FiSend className="h-5 w-5" />
          </button>
        </form>
      }
    >
      <div className="flex min-h-[40vh] flex-col gap-2">
        {messages.length === 0 && <p className="py-10 text-center text-sm text-ink-500">No messages yet. Say Assalam o Alaikum!</p>}
        {messages.map((m) => {
          const mine = String(m.sender) === String(me);
          return (
            <div key={m._id} className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-[15px] ${mine ? "self-end rounded-br-md bg-primary-600 text-white" : "self-start rounded-bl-md bg-surface-200 text-ink-900"}`}>
              <p className="whitespace-pre-wrap break-words">{m.content}</p>
              <p className={`mt-0.5 text-[11px] ${mine ? "text-white/70" : "text-ink-500"}`}>
                {new Date(m.timestamp).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          );
        })}
        {error && <p className="text-sm text-danger-700">{error}</p>}
        <div ref={endRef} />
      </div>
    </Sheet>
  );
}
