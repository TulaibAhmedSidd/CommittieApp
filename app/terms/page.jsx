"use client";

import React from "react";
import Link from "next/link";
import Logo from "../Components/Theme/Logo";
import Button from "../Components/Theme/Button";
import { FiArrowLeft, FiFileText, FiCheckCircle, FiShield, FiAlertTriangle } from "react-icons/fi";

const Terms = () => {
  return (
    <main className="min-h-screen bg-surface-50 text-slate-900 dark:text-slate-100 relative overflow-x-hidden">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-20 md:px-8">
          <Logo size="md" />
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <FiArrowLeft /> Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12 md:px-8 md:py-16">
        {/* Header */}
        <div className="mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-3.5 py-1 text-xs font-black uppercase text-primary-700 dark:text-primary-400">
            <FiFileText /> Terms & Conditions · شرائط و ضوابط
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Terms & Conditions
          </h1>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            Welcome to <span className="font-bold text-primary-600">CommittieApp</span>.
            By accessing or using our platform, you agree to the following Terms & Conditions.
            Please read them carefully before proceeding.
          </p>
        </div>

        {/* Card Wrapper */}
        <div className="space-y-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-xl">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <FiCheckCircle className="text-primary-600" /> 1. Acceptance of Terms
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              By registering, accessing, or using CommittieApp, you confirm that you have read,
              understood, and agreed to be legally bound by these Terms & Conditions.
              If you do not agree, you must not use the platform.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
              2. User Roles & Responsibilities
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300 font-medium text-sm md:text-base">
              <li><strong>Members</strong> are responsible for timely monthly installment contributions and uploading accurate payment proof screenshots.</li>
              <li><strong>Organizers</strong> are responsible for managing committees, verifying payment receipts, maintaining fair draw schedules, and disbursing payouts promptly.</li>
              <li><strong>Super Admin</strong> oversees identity approvals, CNIC verification audits, and overall platform integrity.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <FiShield className="text-primary-600" /> 3. Identity Verification & Blue Tick
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Users and organizers may be required to submit identity details including CNIC number
              and original CNIC photo. Once verified by authorized administrators,
              a <span className="font-bold text-primary-600">Blue Tick</span> will be assigned
              as a trust indicator across the platform.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
              4. Payments, Proof & Transparency
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              All committee payments and payouts must be supported with valid proof such as
              transaction ID or receipt screenshot. Payment status of members is visible to committee members
              for transparency, but cannot be tampered with by other members.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <FiAlertTriangle className="text-amber-500" /> 5. Emergency & Dispute Resolution
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              In the event of emergency or inability to continue, the organizer must pause
              the committee and notify all members. Resolutions will be
              handled transparently according to committee rules. CommittieApp acts as a digital ledger facilitator and does not directly hold member funds.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
              6. Reviews & Member Conduct
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Members may leave reviews for organizers. Reviews must be honest, respectful,
              and factual. Fake reviews, harassment, or abusive behavior will result in immediate account suspension.
            </p>
          </section>

          {/* Section 7 — Fraud, Default & Legal Recourse */}
          <section className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800 bg-red-50/50 dark:bg-red-950/20 p-6 rounded-2xl border border-red-200/60 dark:border-red-900/40">
            <h2 className="text-xl md:text-2xl font-black text-red-700 dark:text-red-400 flex items-center gap-2">
              <FiShield /> 7. Default, Fraud Prevention & Legal Action (ڈیفالٹ اور قانونی کارروائی)
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              CommittieApp enforces a strict zero-tolerance policy against default, non-payment, and fraud:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300 font-medium text-sm md:text-base">
              <li>
                <strong>Post-Payout Default Definition:</strong> Any member who receives their committee payout and subsequently fails, refuses, or absconds from paying their remaining monthly installments is classified as an intentional defaulter.
              </li>
              <li>
                <strong>Permanent Network Blacklist:</strong> Defaulters will have their verified CNIC number, phone number, and bank accounts permanently blacklisted across CommittieApp and barred from joining any future committees.
              </li>
              <li>
                <strong>Digital Legal Evidence Package:</strong> In cases of default or fraud, CommittieApp provides the verified organizer with a certified legal evidence packet containing the member&apos;s verified CNIC, verified selfie, IP logs, transaction history, and signed digital ledger trail.
              </li>
              <li>
                <strong>Criminal &amp; Legal Action (Pakistan Penal Code):</strong> Organizers and affected members reserve the full legal right to initiate criminal proceedings under <strong>PPC Section 420</strong> (Cheating &amp; Dishonestly Inducing Delivery of Property) and <strong>PPC Section 406</strong> (Criminal Breach of Trust / امانت میں خیانت), as well as reporting online fraudulent activities to the <strong>FIA Cybercrime Wing</strong>.
              </li>
            </ul>
          </section>

          {/* Section 8 — Platform Role */}
          <section className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
              8. Platform Facilitator Role
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              CommittieApp is a digital record-keeping and ledger technology platform. Funds move directly between participants via their chosen financial providers (JazzCash, EasyPaisa, Bank accounts). CommittieApp does not act as a bank or hold deposits directly.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Terms;
