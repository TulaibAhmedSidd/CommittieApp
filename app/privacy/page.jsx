"use client";

import React from "react";
import Link from "next/link";
import Logo from "../Components/Theme/Logo";
import Button from "../Components/Theme/Button";
import { FiArrowLeft, FiShield, FiLock, FiEye, FiServer } from "react-icons/fi";

const PrivacyPolicy = () => {
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
        {/* Page Header */}
        <div className="mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-3.5 py-1 text-xs font-black uppercase text-primary-700 dark:text-primary-400">
            <FiShield /> Privacy Policy · پرائیویسی پالیسی
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            Your privacy is important to us. This Privacy Policy explains how CommittieApp collects, uses, stores, and protects your personal information.
          </p>
        </div>

        {/* Content Card */}
        <div className="space-y-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-xl">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
              <FiEye className="text-primary-600" /> 1. Information We Collect
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              We may collect the following types of information when you use CommittieApp:
            </p>
            <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-1.5 font-medium text-sm md:text-base">
              <li>Personal details such as name, phone number, email address, and profile photo</li>
              <li>Location data including city, country, and current location (with your consent)</li>
              <li>Committee participation details, payment history, and transaction receipt proofs</li>
              <li>Device and usage information for security and performance optimization</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
              <FiServer className="text-primary-600" /> 2. How We Use Your Information
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              We use your information to:
            </p>
            <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-1.5 font-medium text-sm md:text-base">
              <li>Provide, manage, and improve our committee saving circle services</li>
              <li>Help users find nearby committees and verified organizers</li>
              <li>Verify payment receipts and transaction submissions</li>
              <li>Prevent fraud, misuse, and unauthorized account access</li>
              <li>Communicate updates, alerts, and important service notices</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
              3. Location Data
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Location data is collected only with your explicit consent. It is used to display nearby committees, organizers, and members. You can update or disable location access at any time through your account settings.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
              4. Data Sharing and Visibility
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              We do not sell or rent your personal data to third parties. Certain information may be visible to members:
            </p>
            <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-1.5 font-medium text-sm md:text-base">
              <li>Your name and profile may be visible within committees you join</li>
              <li>Payment status (paid/unpaid) is visible to committee members for transparency</li>
              <li>Organizers can view transaction proofs for payment verification</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
              <FiLock className="text-emerald-600" /> 5. Payments and Bank-Grade Security
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              CommittieApp does not process or store sensitive credit card or banking PINs directly. Payment screenshots and transaction IDs uploaded by users are encrypted, stored securely, and used only for monthly ledger verification within committees.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
              6. Account Deletion
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              You may request complete account deletion at any time by contacting support@committieapp.com. Certain records (such as committee payment history and audit logs) may be retained where operationally required.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
