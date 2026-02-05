"use client";

import React, { useState, useEffect } from "react";
import { FiSearch, FiMapPin, FiNavigation, FiTarget, FiBriefcase, FiUser, FiLayers, FiFilter, FiX, FiMessageSquare } from "react-icons/fi";
import Card from "./Theme/Card";
import Button from "./Theme/Button";
import Input from "./Theme/Input";
import BlueTick from "./Theme/BlueTick";
import { toast } from "react-toastify";

export default function DiscoveryPanel({ onChatClick }) {
    const [search, setSearch] = useState("");
    const [type, setType] = useState("all");
    const [city, setCity] = useState("");
    const [results, setResults] = useState({ committees: [], organizers: [], members: [] });
    const [loading, setLoading] = useState(false);
    const [nearMe, setNearMe] = useState(false);
    const [coords, setCoords] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const performSearch = async () => {
        setLoading(true);
        try {
            let url = `/api/discovery?q=${search}&type=${type}&city=${city}`;
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
            if (search.length > 2 || city || nearMe) performSearch();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search, type, city, nearMe]);

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

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-6 flex items-center text-slate-400 group-focus-within:text-primary-600 transition-colors">
                        <FiSearch size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Discover Committees, Organizers, or Members?..."
                        className="w-full pl-16 pr-6 py-6 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-premium-hover border border-slate-100 dark:border-slate-800 text-sm font-black uppercase tracking-tight outline-none focus:ring-4 focus:ring-primary-500/10 transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="absolute inset-y-2 right-2 flex items-center gap-2">
                        <button
                            onClick={handleNearMe}
                            className={`px-6 h-full rounded-[2rem] flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${nearMe ? 'bg-primary-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100'}`}
                        >
                            <FiNavigation /> {nearMe ? 'Near Me Active' : 'Near Me'}
                        </button>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="p-4 rounded-full bg-slate-900 text-white hover:bg-primary-600 transition-colors"
                        >
                            <FiFilter />
                        </button>
                    </div>
                </div>

                {showFilters && (
                    <Card className="p-6 border-none shadow-premium bg-slate-50/50 dark:bg-slate-800/20 backdrop-blur animate-in slide-in-from-top duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Discovery Type</label>
                                <div className="flex bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    {['all', 'committee', 'organizer', 'member'].map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setType(t)}
                                            className={`flex-1 py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all ${type === t ? 'bg-primary-600 text-white' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target City</label>
                                <Input
                                    placeholder="Enter City..."
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    size="sm"
                                />
                            </div>
                            <div className="flex items-end">
                                <Button
                                    variant="secondary"
                                    onClick={() => { setSearch(""); setCity(""); setNearMe(false); setType("all"); }}
                                    className="w-full py-4 text-[10px] font-black uppercase tracking-widest"
                                >
                                    Reset Discovery <FiX className="ml-2" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800/50 rounded-[2rem]" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Committees */}
                    {results?.committees?.map(c => (
                        <Card key={c._id} className="p-8 border-none bg-white dark:bg-slate-900 shadow-premium-hover group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <FiLayers size={100} />
                            </div>
                            <div className="space-y-6 relative z-10">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{c.name}</h4>
                                        <div className="flex items-center gap-1 text-[10px] font-black text-primary-600 bg-primary-600/10 px-3 py-1 rounded-full uppercase">
                                            {c.status}
                                        </div>
                                    </div>
                                    <p className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <FiUser /> {c.organizer?.name}
                                        <BlueTick verified={c.organizer?.verificationStatus === 'verified'} size={12} />
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase">
                                    <div className="flex items-center gap-2">
                                        <FiMapPin /> {c.organizer?.city || 'Universal'}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FiTarget /> {c.maxMembers} Members
                                    </div>
                                </div>
                                <Button
                                    onClick={() => window.location.href = `/userDash/join?id=${c._id}`}
                                    className="w-full py-4 bg-slate-900 hover:bg-primary-600 text-[10px] font-black uppercase tracking-widest"
                                >
                                    Join Circuit
                                </Button>
                            </div>
                        </Card>
                    ))}

                    {/* Organizers */}
                    {results?.organizers?.map(orig => (
                        <Card key={orig._id} className="p-8 border-none bg-white dark:bg-slate-900 shadow-premium-hover group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <FiBriefcase size={100} />
                            </div>
                            <div className="space-y-6 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-2xl font-black text-white shadow-lg">
                                        {orig.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="flex items-center gap-2 font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                            {orig.name}
                                            <BlueTick verified={orig.verificationStatus === 'verified'} size={14} />
                                        </h4>
                                        <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">Elite Organizer</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase">
                                    <div className="flex items-center gap-2">
                                        <FiMapPin /> {orig.city}, {orig.country}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => window.location.href = `/userDash/organizer?id=${orig._id}`}
                                        className="flex-1 py-4 text-[10px] font-black uppercase tracking-[0.15em] bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    >
                                        Profile
                                    </Button>
                                    <Button
                                        onClick={() => onChatClick && onChatClick(orig)}
                                        className="w-14 py-4 bg-primary-600"
                                    >
                                        <FiMessageSquare />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}

                    {/* Members */}
                    {results?.members?.map(m => (
                        <Card key={m._id} className="p-8 border-none bg-white dark:bg-slate-900 shadow-premium-hover group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <FiUser size={100} />
                            </div>
                            <div className="space-y-6 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl font-black text-primary-600">
                                        {m.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="flex items-center gap-2 font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                            {m.name}
                                            <BlueTick verified={m.verificationStatus === 'verified'} size={14} />
                                        </h4>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Active Member</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase">
                                    <div className="flex items-center gap-2">
                                        <FiMapPin /> {m.city || 'Hidden'}
                                    </div>
                                </div>
                                <Button
                                    onClick={() => onChatClick && onChatClick(m)}
                                    className="w-full py-4 text-[10px] font-black uppercase tracking-widest bg-slate-900 hover:bg-primary-600"
                                >
                                    <FiMessageSquare className="mr-2" /> Message Member
                                </Button>
                            </div>
                        </Card>
                    ))}

                    {results?.committees?.length === 0 && results?.organizers?.length === 0 && results?.members?.length === 0 && (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-slate-400 font-black uppercase tracking-widest text-xs italic">The echo returns... Nothing found in this circuit of nodes.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
