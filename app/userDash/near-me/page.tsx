"use client";

import React, { useState, useEffect } from "react";
import { FiSearch, FiMapPin, FiNavigation, FiTarget, FiBriefcase, FiUser, FiLayers, FiFilter, FiX, FiMessageSquare, FiCheckCircle, FiClock, FiActivity } from "react-icons/fi";
import Card from "../../Components/Theme/Card";
import Button from "../../Components/Theme/Button";
import Input from "../../Components/Theme/Input";
import BlueTick from "../../Components/Theme/BlueTick";
import { toast } from "react-toastify";
import ChatBox from "../../Components/ChatBox";

export default function NearMePage() {
    const [search, setSearch] = useState("");
    const [type, setType] = useState("all");
    const [city, setCity] = useState("");
    const [county, setCounty] = useState("");
    const [results, setResults] = useState({ committees: [], organizers: [], members: [] });
    const [loading, setLoading] = useState(false);
    const [nearMe, setNearMe] = useState(false);
    const [coords, setCoords] = useState(null);
    const [showFilters, setShowFilters] = useState(true);
    const [member, setMember] = useState(null);
    const [activeChat, setActiveChat] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem("member");
        if (userData) {
            setMember(JSON.parse(userData));
        }
    }, []);

    const performSearch = async () => {
        setLoading(true);
        try {
            let url = `/api/discovery?q=${search}&type=${type}&city=${city}&county=${county}`;
            if (nearMe && coords) {
                url += `&lat=${coords.lat}&lng=${coords.lng}&radius=50`;
            }
            const res = await fetch(url);
            const data = await res.json();
            setResults(data);
        } catch (err) {
            toast.error("Discovery failed to sync");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            performSearch();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search, type, city, county, nearMe]);

    const handleNearMe = () => {
        if (!nearMe) {
            if (!navigator.geolocation) return toast.error("Location not supported");
            navigator.geolocation.getCurrentPosition((pos) => {
                setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setNearMe(true);
                toast.success("Nearby mode active");
            });
        } else {
            setNearMe(false);
            setCoords(null);
        }
    };

    const handleConnect = async (adminId) => {
        if (!member) {
            toast.error("Please login to connect");
            return;
        }

        try {
            const res = await fetch("/api/member/pool", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ memberId: member._id, adminId })
            });

            if (res.ok) {
                toast.success("Association request sent!");
                // Refresh member logic omitted for simplicity or could be expanded
            } else {
                const data = await res.json();
                toast.error(data.error || "Connection failed");
            }
        } catch (err) {
            toast.error("Failed to initiate connection");
        }
    };

    const cities = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala", "Hyderabad", "Sukkur", "Bahawalpur", "Sargodha", "Mardan", "Larkana", "Sheikhupura", "Rahim Yar Khan", "Jhang", "Dera Ghazi Khan"];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12 space-y-12">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 pb-6 border-b border-slate-200 dark:border-slate-800">
                        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                            Near <span className="text-primary-600">Me</span>
                        </h1>
                        <p className="text-slate-500 font-medium italic">Discover active committees, expert organizers, and members around your area.</p>
                    </div>

                    <div className="relative group mt-8">
                        <div className="absolute inset-y-0 left-6 flex items-center text-slate-400 group-focus-within:text-primary-600 transition-colors">
                            <FiSearch size={22} />
                        </div>
                        <input
                            type="text"
                            placeholder="Find Committees or Connections?..."
                            className="w-full pl-16 pr-6 py-7 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-premium-hover border border-slate-100 dark:border-slate-800 text-sm font-black uppercase tracking-tight outline-none focus:ring-4 focus:ring-primary-500/10 transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="absolute inset-y-2.5 right-2.5 flex items-center gap-3">
                            <button
                                onClick={handleNearMe}
                                className={`px-8 h-full rounded-[2rem] flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${nearMe ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                            >
                                <FiNavigation /> {nearMe ? 'Radius: 50KM' : 'Near Me'}
                            </button>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`p-5 rounded-full transition-all ${showFilters ? 'bg-primary-600 text-white shadow-lg' : 'bg-slate-900 text-white hover:bg-primary-600'}`}
                            >
                                <FiFilter />
                            </button>
                        </div>
                    </div>

                    {showFilters && (
                        <Card className="p-10 border-none shadow-premium bg-white/50 dark:bg-slate-900/50 backdrop-blur-2xl animate-in slide-in-from-top-6 duration-500 rounded-[3rem]">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Discovery Category</label>
                                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                                        {['all', 'committee', 'organizer', 'member'].map(t => (
                                            <button
                                                key={t}
                                                onClick={() => setType(t)}
                                                className={`flex-1 py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all ${type === t ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">City Focus</label>
                                    <select
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="w-full px-5 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="">All Cities</option>
                                        {cities.sort().map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">County / Area</label>
                                    <Input
                                        label="County / Area"
                                        placeholder="Specific Area..."
                                        value={county}
                                        onChange={(e) => setCounty(e.target.value)}
                                        className="bg-slate-100 dark:bg-slate-800 rounded-2xl border-slate-200 dark:border-slate-700 py-4"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <Button
                                        variant="secondary"
                                        onClick={() => { setSearch(""); setCity(""); setCounty(""); setNearMe(false); setType("all"); }}
                                        className="w-full py-5 text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-900/20"
                                    >
                                        Clear All Filters <FiX className="ml-2" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
                        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-80 bg-slate-200 dark:bg-slate-800 rounded-[3rem]" />)}
                    </div>
                ) : (
                    <div className="space-y-24">
                        {/* Committees Section */}
                        {(type === 'all' || type === 'committee') && results?.committees?.length > 0 && (
                            <div className="space-y-8">
                                <SectionHeader icon={<FiLayers />} title="Active Committees" count={results.committees.length} />
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {results.committees.map(c => <CommitteeCard key={c._id} c={c} member={member} />)}
                                </div>
                            </div>
                        )}

                        {/* Organizers Section */}
                        {(type === 'all' || type === 'organizer') && results?.organizers?.length > 0 && (
                            <div className="space-y-8">
                                <SectionHeader icon={<FiBriefcase />} title="Lead Organizers" count={results.organizers.length} />
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {results.organizers.map(orig => <OrganizerCard key={orig._id} orig={orig} member={member} handleConnect={handleConnect} onChatClick={setActiveChat} />)}
                                </div>
                            </div>
                        )}

                        {/* Members Section */}
                        {(type === 'all' || type === 'member') && results?.members?.length > 0 && (
                            <div className="space-y-8">
                                <SectionHeader icon={<FiUser />} title="Ecosystem Members" count={results.members.length} />
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {results.members.map(m => <MemberCard key={m._id} m={m} onChatClick={setActiveChat} />)}
                                </div>
                            </div>
                        )}

                        {results?.committees?.length === 0 && results?.organizers?.length === 0 && results?.members?.length === 0 && (
                            <div className="py-32 text-center bg-white dark:bg-slate-900 rounded-[3rem] shadow-premium">
                                <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-sm italic">Nothing found in this circuit of nodes.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {activeChat && (
                <ChatBox
                    committeeId={null}
                    currentUserId={member?._id}
                    currentUserModel="Member"
                    otherUserId={activeChat._id}
                    otherUserName={activeChat.name}
                    otherUserModel={activeChat.isAdmin ? "Admin" : "Member"}
                    onClose={() => setActiveChat(null)}
                />
            )}
        </div>
    );
}

function SectionHeader({ icon, title, count }) {
    return (
        <div className="flex items-center gap-5">
            <div className="p-4 bg-primary-600 rounded-2xl text-white shadow-lg shadow-primary-500/20">
                {React.cloneElement(icon, { size: 24 })}
            </div>
            <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">{title}</h2>
                <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest">{count} Nodes Found</p>
            </div>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800 ml-4 opacity-50" />
        </div>
    );
}

function CommitteeCard({ c, member }) {
    const spotsLeft = c.maxMembers - (c.members?.length || 0);
    return (
        <Card className="p-8 border-none bg-white dark:bg-slate-900 shadow-premium-hover group relative overflow-hidden rounded-[2.5rem]">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <FiLayers size={100} />
            </div>
            <div className="space-y-6 relative z-10">
                <div className="space-y-2">
                    <div className="flex justify-between items-start">
                        <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">{c.name}</h4>
                        <div className="flex items-center gap-1 text-[9px] font-black text-primary-600 bg-primary-600/10 px-3 py-1.5 rounded-full uppercase tracking-tighter shadow-sm">
                            {spotsLeft} Spots
                        </div>
                    </div>
                    <p className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <FiUser /> {c.organizer?.name || 'Lead Organizer'}
                        <BlueTick verified={c.organizer?.verificationStatus === 'verified'} size={12} />
                    </p>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-tight bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl">
                        <FiMapPin className="text-primary-600" /> {c.city || 'Universal'} {c.county ? `— ${c.county}` : ''}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-tight bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl">
                        <FiActivity className="text-primary-600" /> PKR {c.monthlyAmount?.toLocaleString()} / Month
                    </div>
                </div>
                <Button
                    onClick={() => window.location.href = `/userDash/join?id=${c._id}`}
                    disabled={spotsLeft <= 0}
                    className="w-full py-5 bg-slate-900 hover:bg-primary-600 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 rounded-2xl"
                >
                    {spotsLeft > 0 ? "Join Committee" : "Circuit Full"}
                </Button>
            </div>
        </Card>
    );
}

function OrganizerCard({ orig, member, handleConnect, onChatClick }) {
    const isConnected = member?.organizers?.some(o => (o._id || o) === orig._id);
    const isPending = member?.pendingOrganizers?.some(o => (o._id || o) === orig._id);

    return (
        <Card className="p-8 border-none bg-white dark:bg-slate-900 shadow-premium-hover group relative overflow-hidden rounded-[2.5rem]">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <FiBriefcase size={100} />
            </div>
            <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-indigo-600/20 rotate-3 group-hover:rotate-0 transition-transform">
                        {orig.name.charAt(0)}
                    </div>
                    <div>
                        <h4 className="flex items-center gap-2 font-black text-slate-900 dark:text-white uppercase tracking-tighter text-lg">
                            {orig.name}
                            <BlueTick verified={orig.verificationStatus === 'verified'} size={14} />
                        </h4>
                        <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest italic">Elite Organizer</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <FiMapPin className="text-primary-600" /> {orig.city}, {orig.country}
                </div>
                <div className="flex gap-3">
                    {isConnected ? (
                        <div className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20">
                            <FiCheckCircle /> Linked
                        </div>
                    ) : isPending ? (
                        <div className="flex-1 flex items-center justify-center gap-2 bg-amber-500 text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-amber-500/20">
                            <FiClock /> Waiting
                        </div>
                    ) : (
                        <Button
                            onClick={() => handleConnect(orig._id)}
                            className="flex-1 py-4 text-[9px] font-black uppercase tracking-[0.2em] bg-primary-600 text-white shadow-lg shadow-primary-500/20 rounded-2xl"
                        >
                            Sync Link
                        </Button>
                    )}
                    <Button
                        onClick={() => onChatClick && onChatClick(orig)}
                        className="w-16 py-4 bg-slate-900 text-white shadow-lg shadow-slate-900/20 rounded-2xl"
                    >
                        <FiMessageSquare size={18} />
                    </Button>
                </div>
            </div>
        </Card>
    );
}

function MemberCard({ m, onChatClick }) {
    return (
        <Card className="p-8 border-none bg-white dark:bg-slate-900 shadow-premium-hover group relative overflow-hidden rounded-[2.5rem]">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <FiUser size={100} />
            </div>
            <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl font-black text-primary-600 shadow-inner group-hover:bg-primary-600 group-hover:text-white transition-colors duration-500">
                        {m.name.charAt(0)}
                    </div>
                    <div>
                        <h4 className="flex items-center gap-2 font-black text-slate-900 dark:text-white uppercase tracking-tighter text-lg">
                            {m.name}
                            <BlueTick verified={m.verificationStatus === 'verified'} size={14} />
                        </h4>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">Verified Active Node</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <FiMapPin className="text-primary-600" /> {m.city || 'Hidden'} {m.county ? `— ${m.county}` : ''}
                </div>
                <Button
                    onClick={() => onChatClick && onChatClick(m)}
                    className="w-full py-5 text-[10px] font-black uppercase tracking-widest bg-slate-900 hover:bg-primary-600 shadow-xl shadow-slate-900/10 rounded-2xl"
                >
                    <FiMessageSquare className="mr-2" /> Encrypted Direct Message
                </Button>
            </div>
        </Card>
    );
}
