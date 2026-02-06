"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiCheckCircle, FiFileText, FiShield, FiAlertTriangle, FiArrowRight, FiInfo } from "react-icons/fi";
import Card from "../../Components/Theme/Card";
import Button from "../../Components/Theme/Button";
import StepProgress from "../../Components/Theme/StepProgress";
import Modal from "../../Components/Theme/Modal";
import UploadCapture from "../../Components/Theme/UploadCapture";
import { toast } from "react-toastify";

function JoinCommitteeContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const committeeId = searchParams.get("id");

    const [committee, setCommittee] = useState(null);
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [step, setStep] = useState(0);
    const [showConsent, setShowConsent] = useState(false);
    const [isConsentChecked, setIsConsentChecked] = useState(false);

    // Document state
    const [uploadedDocs, setUploadedDocs] = useState([]); // { name: string, url: string }

    useEffect(() => {
        const memberData = localStorage.getItem("member");
        if (!memberData) {
            router.push("/login");
            return;
        }
        setMember(JSON.parse(memberData));

        if (committeeId) {
            fetchCommittee();
        }
    }, [committeeId]);

    const fetchCommittee = async () => {
        try {
            const res = await fetch(`/api/committee/${committeeId}`);
            if (!res.ok) throw new Error("Committee not found");
            const data = await res.json();
            setCommittee(data);

            // If No docs required, skip to confirmation
            if (!data.requireDocuments) {
                setStep(1);
            }
        } catch (err) {
            toast.error(err.message);
            router.push("/userDash/explore");
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (name, url) => {
        if (!url) {
            setUploadedDocs(prev => prev.filter(d => d.name !== name));
            return;
        }
        const newDoc = { name, url, uploadedAt: new Date() };
        setUploadedDocs(prev => {
            const filtered = prev.filter(d => d.name !== name);
            return [...filtered, newDoc];
        });
    };

    const handleJoinClick = () => {
        setShowConsent(true);
    };

    const handleJoinFinal = async () => {
        if (!isConsentChecked) return toast.warning("Please accept terms to continue");

        setShowConsent(false);
        setSubmitting(true);
        try {
            // 1. Update member's documents in their profile (reuse capability)
            if (uploadedDocs.length > 0) {
                const updatedDocs = [...(member.documents || []), ...uploadedDocs];
                // Deduplicate by name, keeping newest
                const uniqueDocs = Array.from(new Map(updatedDocs.map(item => [item.name, item])).values());

                await fetch(`/api/member/${member._id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ documents: uniqueDocs })
                });
            }

            // 2. Submit join request to committee
            const res = await fetch(`/api/committee/${committeeId}/request`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ memberId: member._id })
            });

            if (res.ok) {
                toast.success("Request submitted successfully!");
                router.push("/userDash");
            } else {
                const errData = await res.json();
                toast.error(errData.error || "Failed to join");
            }
        } catch (err) {
            toast.error("Operation failed");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-20 text-center animate-pulse font-black uppercase tracking-widest text-slate-400">Syncing Circuit Data...</div>;

    const steps = committee?.requireDocuments ? ["Verify Documents", "Final Confirmation"] : ["Final Confirmation"];
    const currentStep = committee?.requireDocuments ? step : 0;

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <div className="space-y-2 mb-12">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                    Join <span className="text-primary-600">{committee?.name}</span>
                </h1>
                <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Initialization Protocol active</p>
            </div>

            <Card className="p-8 md:p-12 border-none shadow-premium bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                <div className="mb-12">
                    <StepProgress steps={steps} currentStep={currentStep} />
                </div>

                {committee?.requireDocuments && step === 0 && (
                    <div className="space-y-10 animate-in fade-in duration-500">
                        <div className="flex items-center gap-4 p-6 bg-primary-500/5 rounded-[2rem] border border-primary-500/10">
                            <FiShield className="text-primary-500" size={32} />
                            <div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Document Verification</h3>
                                <p className="text-xs text-slate-500 font-medium">To maintain circuit integrity, the organizer requires the following documents.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {committee.mandatoryDocuments.map((docName) => {
                                // Check if already has in profile
                                const existingDoc = member?.documents?.find(d => d.name === docName);
                                return (
                                    <UploadCapture
                                        key={docName}
                                        id={docName}
                                        label={docName}
                                        value={existingDoc?.url}
                                        memberId={member?._id}
                                        onUpload={(url) => handleFileUpload(docName, url)}
                                        required
                                        placeholder={`Upload or Capture ${docName}`}
                                    />
                                );
                            })}
                        </div>

                        <div className="flex justify-end">
                            <Button
                                onClick={() => setStep(1)}
                                disabled={!committee.mandatoryDocuments.every(name =>
                                    uploadedDocs.some(d => d.name === name) || member?.documents?.some(d => d.name === name)
                                )}
                                className="px-12 py-5 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary-500/20"
                            >
                                Proceed to Confirmation <FiArrowRight className="ml-2" />
                            </Button>
                        </div>
                    </div>
                )}

                {(step === 1 || !committee?.requireDocuments) && (
                    <div className="space-y-10 animate-in slide-in-from-right duration-500">
                        <Card className="p-8 bg-slate-950 text-white border-none overflow-hidden relative">
                            <div className="relative z-10 space-y-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-500">Service Confirmation</p>
                                <div className="space-y-1">
                                    <h4 className="text-3xl font-black uppercase tracking-tighter italic">Join {committee?.name}</h4>
                                    <p className="text-sm font-medium opacity-60 italic">You are requesting to join this financial circuit organized by {committee?.createdBy?.name || 'Authorized Organizer'}.</p>
                                </div>

                                <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] uppercase font-black opacity-40 mb-1">Monthly commitment</p>
                                        <h2 className="text-4xl font-black tracking-tighter">RS {committee?.monthlyAmount?.toLocaleString()}</h2>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase font-black opacity-40 mb-1">Duration</p>
                                        <h2 className="text-2xl font-black tracking-tighter underline decoration-primary-500 underline-offset-4">{committee?.monthDuration} <span className="text-xs">MONTHS</span></h2>
                                    </div>
                                </div>
                            </div>
                            <FiFileText size={150} className="absolute -bottom-10 -right-10 text-white opacity-5" />
                        </Card>

                        <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex gap-4">
                            <FiAlertTriangle className="text-amber-500 shrink-0 mt-1" />
                            <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">By proceeding, you agree to the committee rules. Your request will be sent to the organizer for approval.</p>
                        </div>

                        <div className="flex gap-4">
                            <Button
                                variant="secondary"
                                onClick={() => committee?.requireDocuments ? setStep(0) : router.back()}
                                className="flex-1 py-5 text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 border-none"
                            >
                                Back
                            </Button>
                            <Button
                                onClick={handleJoinClick}
                                loading={submitting}
                                className="flex-[2] py-5 text-[10px] font-black uppercase tracking-widest bg-slate-900 border-none shadow-2xl"
                            >
                                Submit Request
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Consent Modal */}
            <Modal
                isOpen={showConsent}
                onClose={() => setShowConsent(false)}
                title="Participant Consent Agreement"
                size="lg"
            >
                <div className="space-y-8">
                    <div className="p-6 bg-primary-500/5 rounded-3xl border border-primary-500/10 space-y-4">
                        <div className="flex items-center gap-3 text-primary-600 font-black uppercase text-xs">
                            <FiInfo /> Terms of Engagement
                        </div>
                        <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-400 font-medium list-disc ml-4 leading-relaxed">
                            <li>I agree to commit to the full duration of {committee?.monthDuration} months.</li>
                            <li>I acknowledge that monthly payments of PKR {committee?.monthlyAmount?.toLocaleString()} must be made by the 5th of every month.</li>
                            <li>I understand that withdrawal after the cycle starts may result in penalties as defined by the organizer.</li>
                            <li>I verify that all uploaded documents are authentic and legally represent my identity.</li>
                            <li>I grant {committee?.createdBy?.name} the permission to verify my financial standing within the bounds of this committee.</li>
                        </ul>
                    </div>

                    <div className="flex items-start gap-4">
                        <input
                            type="checkbox"
                            id="consent-check"
                            className="w-6 h-6 mt-1 rounded-lg accent-primary-600"
                            checked={isConsentChecked}
                            onChange={(e) => setIsConsentChecked(e.target.checked)}
                        />
                        <label htmlFor="consent-check" className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed cursor-pointer">
                            I have read the terms and conditions meticulously and I agree to bind myself legally to this financial circuit.
                        </label>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            variant="secondary"
                            onClick={() => setShowConsent(false)}
                            className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 border-none"
                        >
                            Decline
                        </Button>
                        <Button
                            onClick={handleJoinFinal}
                            disabled={!isConsentChecked}
                            className="flex-[2] py-4 text-[10px] font-black uppercase tracking-widest bg-primary-600 border-none shadow-xl shadow-primary-500/20"
                        >
                            Accept & Initialize Join
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default function JoinCommitteePage() {
    return (
        <Suspense fallback={<div className="p-20 text-center animate-pulse font-black uppercase tracking-widest text-slate-400">Loading Application...</div>}>
            <JoinCommitteeContent />
        </Suspense>
    );
}
