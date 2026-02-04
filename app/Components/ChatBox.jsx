"use client";

import { useState, useEffect, useRef } from "react";
import { FiSend, FiX, FiMessageSquare, FiUser } from "react-icons/fi";
import Button from "./Theme/Button";
import moment from "moment";

export default function ChatBox({
    committeeId,
    currentUserId,
    currentUserModel,
    otherUserId,
    otherUserName,
    otherUserModel,
    onClose
}) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);
    const [sending, setSending] = useState(false);

    // Initial fetch
    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000); // Poll every 3s
        return () => clearInterval(interval);
    }, [committeeId, currentUserId, otherUserId]);

    // Scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`/api/messages?committeeId=${committeeId}&userId=${currentUserId}&otherId=${otherUserId}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(prev => {
                    // Simple check to avoid re-rendering if length matches (naive optimization)
                    if (data.length === prev.length) return prev;
                    return data;
                });
            }
        } catch (err) {
            console.error("Failed to fetch messages", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setSending(true);
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    senderId: currentUserId,
                    senderModel: currentUserModel,
                    receiverId: otherUserId,
                    receiverModel: otherUserModel,
                    committeeId,
                    content: newMessage
                })
            });

            if (res.ok) {
                const msg = await res.json();
                setMessages([...messages, msg]);
                setNewMessage("");
            }
        } catch (err) {
            console.error("Failed to send message", err);
        } finally {
            setSending(false);
        }
    };

    const isMe = (msg) => msg.sender === currentUserId;

    return (
        <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 w-80 md:w-96 h-[500px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col z-50 animate-in slide-in-from-bottom-10 duration-500 overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-primary-600 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <FiMessageSquare size={16} />
                    </div>
                    <div>
                        <h4 className="font-black uppercase text-xs tracking-widest">{otherUserName}</h4>
                        <p className="text-[10px] text-primary-200 font-medium">Real-time Support</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <FiX size={18} />
                </button>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 dark:bg-slate-950/50">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                        <p className="text-xs font-black uppercase tracking-widest">No messages yet</p>
                        <p className="text-[10px] mt-1">Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${isMe(msg) ? "justify-end" : "justify-start"}`}>
                            <div className={`
                                max-w-[80%] p-3 rounded-2xl text-sm font-medium shadow-sm relative group
                                ${isMe(msg)
                                    ? "bg-primary-600 text-white rounded-br-none"
                                    : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-bl-none"
                                }
                            `}>
                                <p>{msg.content}</p>
                                <p className={`
                                    text-[9px] mt-1 font-black uppercase tracking-widest text-right
                                    ${isMe(msg) ? "text-primary-200" : "text-slate-400"}
                                `}>
                                    {moment(msg.timestamp).format("HH:mm")}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 text-sm focus:ring-2 focus:ring-primary-500/20 outline-none"
                />
                <Button
                    type="submit"
                    loading={sending}
                    disabled={!newMessage.trim()}
                    className="aspect-square p-0 w-10 flex items-center justify-center rounded-xl bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/20"
                >
                    <FiSend size={16} />
                </Button>
            </form>
        </div>
    );
}
