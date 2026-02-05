"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiUser, FiSearch, FiUserPlus, FiCheckCircle, FiMoreVertical } from "react-icons/fi";
import Card from "../../Components/Theme/Card";
import Button from "../../Components/Theme/Button";
import Input from "../../Components/Theme/Input";
import { toast } from "react-toastify";
import BlueTick from "../../Components/Theme/BlueTick";
import ChatBox from "../../Components/ChatBox";
import { FiMessageSquare, FiNavigation, FiMapPin, FiX } from "react-icons/fi";

export default function AllMembersPage() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [actionLoading, setActionLoading] = useState(null);
    const [currentAdmin, setCurrentAdmin] = useState(null);
    const [nearMe, setNearMe] = useState(false);
    const [coords, setCoords] = useState(null);
    const [city, setCity] = useState("");
    const [activeChat, setActiveChat] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const adminDetail = localStorage.getItem("admin_detail");
        if (!adminDetail) {
            router.push("/admin/login");
            return;
        }
        setCurrentAdmin(JSON.parse(adminDetail));
        fetchMembers();
    }, [router]);

    const fetchMembers = async () => {
        setLoading(true);
        try {
            let url = `/api/discovery?type=member&q=${search}&city=${city}`;
            if (nearMe && coords) {
                url += `&lat=${coords.lat}&lng=${coords.lng}&radius=50`;
            }
            const res = await fetch(url);
            const data = await res.json();
            setMembers(data.members || []);
        } catch (err) {
            toast.error("Failed to fetch member pool");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(fetchMembers, 500);
        return () => clearTimeout(timeout);
    }, [search, nearMe, city]);

    const handleNearMe = () => {
        if (!nearMe) {
            if (!navigator.geolocation) return toast.error("Geolocation not supported");
            navigator.geolocation.getCurrentPosition((pos) => {
                setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setNearMe(true);
            }, (err) => {
                toast.error("Location access denied");
            });
        } else {
            setNearMe(false);
            setCoords(null);
        }
    };

    const associateMember = async (memberId) => {
        setActionLoading(memberId);
        try {
            const res = await fetch("/api/member/pool", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ memberId, adminId: currentAdmin?._id })
            });

            if (res.ok) {
                toast.success("Connection request sent!");
                fetchMembers();
            }
        } catch (err) {
            toast.error("Association failed");
        } finally {
            setActionLoading(null);
        }
    };

    const filteredMembers = members.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="p-12 text-center animate-pulse">Syncing Member Pool...</div>;

    return (
        <div className="p-8 md:p-12 space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                        Member <span className="text-primary-600">Pool</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Browse and search all members in the system</p>
                </div>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <button
                        onClick={handleNearMe}
                        className={`px-6 py-4 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border transition-all ${nearMe ? 'bg-primary-600 border-primary-600 text-white shadow-lg' : 'bg-white text-slate-500 border-slate-100'}`}
                    >
                        <FiNavigation /> {nearMe ? 'Nearby Active' : 'Nearby Members'}
                    </button>
                    <div className="w-full md:w-80">
                        <Input
                            icon={<FiSearch />}
                            placeholder="Search Identity..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.length > 0 ? filteredMembers.map((member) => (
                    <Card key={member._id} className="p-6 space-y-4 hover:shadow-premium transition-all border-slate-100 dark:border-slate-800">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary-600/10 text-primary-600 flex items-center justify-center font-black text-xl">
                                    {member.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-1">
                                        {member.name}
                                        <BlueTick verified={member.verificationStatus === "verified"} size={12} />
                                    </h4>
                                    <p className="text-xs text-slate-500 font-mono italic flex items-center gap-2">
                                        <FiMapPin size={10} /> {member.city || 'Location Hidden'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setActiveChat(member)}
                                className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 hover:bg-primary-600 hover:text-white transition-all shadow-sm"
                            >
                                <FiMessageSquare size={16} />
                            </button>
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <div className="flex -space-x-2 overflow-hidden">
                                {member.organizers?.map((org, i) => (
                                    <div key={i} title={org.name} className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-900 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[8px] font-black uppercase">
                                        {org.name.charAt(0)}
                                    </div>
                                ))}
                                {(!member.organizers || member.organizers.length === 0) && <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Unassigned</p>}
                            </div>

                            {member.organizers?.some(org => (org._id || org) === currentAdmin?._id) ? (
                                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 rounded-xl font-black uppercase text-[10px] tracking-widest">
                                    Associated <FiCheckCircle />
                                </div>
                            ) : member.pendingOrganizers?.includes(currentAdmin?._id) ? (
                                <button disabled className="px-4 py-2 bg-orange-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest cursor-not-allowed shadow-lg shadow-orange-500/20">
                                    Requested
                                </button>
                            ) : (
                                <Button
                                    onClick={() => associateMember(member._id)}
                                    loading={actionLoading === member._id}
                                    variant="secondary"
                                    className="px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] bg-white text-slate-900 border border-slate-200 shadow-lg hover:bg-slate-50 hover:scale-105 transition-all"
                                >
                                    Connect <FiUserPlus className="ml-1" />
                                </Button>
                            )}
                        </div>
                    </Card>
                )) : (
                    <div className="col-span-full py-20 text-center space-y-4">
                        <div className="flex justify-center text-slate-300">
                            <FiSearch size={64} />
                        </div>
                        <p className="font-black uppercase text-[10px] tracking-widest text-slate-400 italic">Static Pool. No Identities Matched.</p>
                    </div>
                )}
            </div>

            {activeChat && (
                <ChatBox
                    currentUserId={currentAdmin?._id}
                    currentUserModel="Admin"
                    otherUserId={activeChat._id}
                    otherUserName={activeChat.name}
                    otherUserModel="Member"
                    onClose={() => setActiveChat(null)}
                />
            )}
        </div>
    );
}
