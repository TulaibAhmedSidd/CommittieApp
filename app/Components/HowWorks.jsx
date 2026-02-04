"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useLanguage } from "./LanguageContext";
import Button from "./Theme/Button";
import Card from "./Theme/Card";

const HowItWorks = () => {
    const { t } = useLanguage();
    const router = useRouter();

    const steps = [
        {
            id: 1,
            title: t("exploreCommittees"),
            desc: t("exploreCommitteesDesc"),
            color: "bg-blue-500",
        },
        {
            id: 2,
            title: t("joinCommittee"),
            desc: t("joinCommitteeDesc"),
            color: "bg-green-500",
        },
        {
            id: 3,
            title: t("approvalProcess"),
            desc: t("approvalProcessDesc"),
            color: "bg-yellow-500",
        },
        {
            id: 4,
            title: t("stayUpdated"),
            desc: t("stayUpdatedDesc"),
            color: "bg-purple-500",
        },
    ];

    return (
        <div className="min-h-screen py-12 md:py-20 animate-in fade-in duration-1000">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                        {t("howItWorks")}
                    </h1>
                    <div className="h-1.5 w-24 bg-primary-600 mx-auto rounded-full" />
                </div>

                {/* Steps Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {steps.map((step) => (
                        <Card key={step.id} className="p-8 border-none shadow-xl hover:shadow-2xl transition-all group">
                            <div className="flex items-start gap-6">
                                <div className={`flex-shrink-0 h-14 w-14 ${step.color} text-white flex items-center justify-center rounded-2xl text-2xl font-black shadow-lg rotate-3 group-hover:rotate-0 transition-transform`}>
                                    {step.id}
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                                        {step.title}
                                    </h2>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Organizer Section */}
                <div className="relative group overflow-hidden rounded-[2.5rem] bg-indigo-600 p-12 md:p-20 text-white shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 text-center space-y-10 max-w-3xl mx-auto">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
                                {t("becomeOrganizer")}
                            </h2>
                            <p className="text-lg md:text-xl font-medium text-indigo-100 italic">
                                {t("becomeOrganizerDesc")}
                            </p>
                        </div>
                        <Button
                            onClick={() => router.push("/admin/login")}
                            className=" text-slate-900 hover:bg-slate-900 px-12 py-5 text-sm font-black uppercase tracking-widest shadow-xl"
                        >
                            {t("getStarted")}
                        </Button>
                    </div>
                </div>

                {/* Member Login Section */}
                <div className="rounded-[2.5rem] bg-slate-900 dark:bg-white p-12 md:p-16 text-center space-y-8 shadow-2xl">
                    <div className="space-y-3">
                        <h2 className="text-2xl md:text-3xl font-black text-white dark:text-slate-900 uppercase tracking-tighter">
                            {t("memberLoginHeading")}
                        </h2>
                        <p className="text-slate-400 dark:text-slate-500 font-medium italic max-w-xl mx-auto">
                            {t("memberLoginDesc")}
                        </p>
                    </div>
                    <Button
                        onClick={() => router.push("/userDash")}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-10 py-4 font-black uppercase tracking-widest text-sm shadow-lg shadow-primary-500/20"
                    >
                        {t("loginAsMember")}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
