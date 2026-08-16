"use client";

import React from 'react';
import Card from '../Components/Theme/Card';
import Button from '../Components/Theme/Button';
import Input from '../Components/Theme/Input';
import { FiMail, FiUser, FiMessageSquare, FiMapPin, FiSend } from 'react-icons/fi';

const Contact = () => {
  return (
    <main className="flex-1 min-h-screen relative overflow-x-hidden py-12 bg-slate-950 text-white">
      <div className="mt-16 max-w-7xl mx-auto px-4 md:px-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">

        {/* Heading */}
        <span className="eyebrow mb-2">Support & Feedback</span>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
          Contact Us
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mb-12 font-medium leading-relaxed">
          Have questions, suggestions, or need support? We’re here to help you with everything related to your saving circles.
        </p>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Left Side – Contact Info */}
          <Card className="bg-slate-900/90 border-slate-800 p-6 md:p-8 space-y-6">
            <h2 className="text-2xl font-black text-white tracking-tight">
              Get in Touch
            </h2>

            <p className="text-slate-300 leading-relaxed">
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
              className="flex items-center justify-center w-full rounded-2xl border border-slate-700 bg-slate-800 text-slate-200 py-4 font-bold hover:bg-slate-700 transition-all"
            >
              ✉️ support@committieapp.com
            </a>

            {/* Location */}
            <div className="pt-6 border-t border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-600/20 text-primary-400 flex items-center justify-center">
                <FiMapPin size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Location
                </h3>
                <p className="text-slate-400 text-sm font-medium">
                  Karachi, Pakistan 🇵🇰
                </p>
              </div>
            </div>
          </Card>

          {/* Right Side – Contact Form */}
          <Card className="bg-slate-900/90 border-slate-800 p-6 md:p-8 space-y-6">
            <h2 className="text-2xl font-black text-white tracking-tight">
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
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <FiMessageSquare /> Message
                </label>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Your Message..."
                  required
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition-all focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
              >
                <FiSend className="mr-2" /> Send Message
              </Button>
            </form>
          </Card>
        </div>

        {/* About Founder Section */}
        <Card className="mt-12 bg-slate-900/80 border-slate-800 p-6 md:p-10 space-y-4">
          <span className="eyebrow">Our Mission</span>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            About the Platform
          </h2>

          <p className="text-slate-300 leading-relaxed">
            CommittieApp was founded after identifying a real and common problem: users were unable to find trusted committees, and organizers struggled to manage members transparently and securely.
          </p>

          <p className="text-slate-300 leading-relaxed">
            CommittieApp solves both sides of the problem by providing a transparent, location-based, and review-driven committee system — empowering users and organizers with trust, structure, and peace of mind.
          </p>
        </Card>

      </div>
    </main>
  );
};

export default Contact;