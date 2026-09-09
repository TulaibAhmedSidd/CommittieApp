"use client";

import React from "react";
import Link from "next/link";
import Logo from "../Components/Theme/Logo";
import Button from "../Components/Theme/Button";
import Input from "../Components/Theme/Input";
import { FiMail, FiUser, FiMessageSquare, FiMapPin, FiSend, FiArrowLeft } from "react-icons/fi";

const Contact = () => {
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

      <div className="max-w-6xl mx-auto px-4 py-12 md:px-8 md:py-16">
        {/* Heading */}
        <div className="mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-3.5 py-1 text-xs font-black uppercase text-primary-700 dark:text-primary-400">
            <FiMail /> Support & Feedback · رابطہ کریں
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Contact Us
          </h1>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-3xl font-medium leading-relaxed">
            Have questions, suggestions, or need support? We’re here to help you with everything related to your saving circles.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side – Contact Info */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Get in Touch
            </h2>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              You can reach us directly via WhatsApp or email. We usually respond within 24 hours.
            </p>

            {/* WhatsApp */}
            <a
              href="https://wa.me/923394054520"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white py-4 font-bold transition-all shadow-lg shadow-emerald-600/20"
            >
              📱 Chat on WhatsApp
            </a>

            {/* Email */}
            <a
              href="mailto:support@committieapp.com"
              className="flex items-center justify-center w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-200 py-4 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            >
              ✉️ support@committieapp.com
            </a>

            {/* Location */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-600/10 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400 flex items-center justify-center">
                <FiMapPin size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Location
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  Karachi, Pakistan 🇵🇰
                </p>
              </div>
            </div>
          </div>

          {/* Right Side – Contact Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Send Us a Message
            </h2>

            <form
              action="mailto:support@committieapp.com"
              method="POST"
              encType="text/plain"
              className="space-y-5"
            >
              <Input
                icon={FiUser}
                type="text"
                name="name"
                placeholder="Your Name"
                required
              />

              <Input
                icon={FiMail}
                type="email"
                name="email"
                placeholder="Your Email"
                required
              />

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <FiMessageSquare /> Message
                </label>
                <textarea
                  name="message"
                  rows={4}
                  required
                  placeholder="How can we help you?"
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium text-sm"
                />
              </div>

              <Button type="submit" variant="primary" className="w-full py-4 text-sm font-black uppercase tracking-widest gap-2">
                Send Message <FiSend />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;