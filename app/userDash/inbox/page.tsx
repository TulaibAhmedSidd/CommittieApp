"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiMessageSquare, FiUser, FiClock, FiSearch, FiShield } from "react-icons/fi";
import Card from "../../Components/Theme/Card";
import ChatBox from "../../Components/ChatBox";
import moment from "moment";

export default function MemberInbox() {
    const router = useRouter();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [member, setMember] = useState(null);
    const [selectedChat, setSelectedChat] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token"); // Member token key
        const detail = localStorage.getItem("member");
        if (!token) {
            router.push("/login");
            return;
        }
        setMember(JSON.parse(detail));
        fetchConversations(JSON.parse(detail)._id);

        // Poll for new conversations/messages
        const interval = setInterval(() => fetchConversations(JSON.parse(detail)._id), 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchConversations = async (memberId) => {
        try {
            const res = await fetch(`/api/member/inbox?memberId=${memberId}`);
            if (res.ok) {
                const data = await res.json();
                setConversations(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">My Inbox</h1>
                        <p className="text-slate-500 font-medium">Chat with Committee Organizers and Support.</p>
                    </div>

                    {loading ? (
                        <div className="p-10 text-center uppercase font-black tracking-widest animate-pulse">Loading Inbox...</div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {conversations.length === 0 ? (
                                <Card className="py-20 text-center col-span-full">
                                    <FiMessageSquare size={48} className="mx-auto text-slate-300 mb-4" />
                                    <p className="text-slate-400 font-black uppercase tracking-widest">No messages yet</p>
                                </Card>
                            ) : (
                                conversations.map((conv) => (
                                    <div
                                        key={conv.committeeId + conv.otherId}
                                        onClick={() => setSelectedChat({
                                            committeeId: conv.committeeId,
                                            otherUserId: conv.otherId,
                                            otherUserName: conv.otherUser?.name || "Unknown User",
                                            otherUserModel: conv.otherUserModel || "Admin"
                                        })}
                                        className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800 hover:border-primary-500/50 hover:shadow-lg transition-all cursor-pointer group"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                                    {conv.otherUserModel === 'Admin' ? <FiShield size={20} /> : <FiUser size={20} />}
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{conv.otherUser?.name || "Unknown"}</h3>
                                                    <p className="text-[10px] uppercase tracking-widest text-slate-400">{conv.committee?.name || "Direct Message"}</p>
                                                </div>
                                            </div>
                                            {conv.unreadCount > 0 && (
                                                <span className="bg-primary-600 text-white text-[10px] font-black px-2 py-1 rounded-full">{conv.unreadCount} NEW</span>
                                            )}
                                        </div>
                                        <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl mb-2">
                                            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 italic">"{conv.lastMessage.content}"</p>
                                        </div>
                                        <div className="flex justify-end items-center gap-2 text-slate-400">
                                            <FiClock size={12} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{moment(conv.lastMessage.timestamp).fromNow()}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </main>

                {/* Chat Box */}
                {selectedChat && member && (
                    <ChatBox
                        committeeId={selectedChat.committeeId}
                        currentUserId={member._id}
                        currentUserModel="Member"
                        otherUserId={selectedChat.otherUserId}
                        otherUserName={selectedChat.otherUserName}
                        otherUserModel={selectedChat.otherUserModel}
                        onClose={() => {
                            setSelectedChat(null);
                            fetchConversations(member._id); // Refresh on close
                        }}
                    />
                )}
            </div>
        </div>
    );
}
