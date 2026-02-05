"use client";

import Link from "next/link";
import {
  FiArrowRight,
  FiCheckCircle,
  FiActivity,
  FiShield,
  FiSearch,
  FiEdit,
  FiBell,
  FiDollarSign,
  FiUsers,
  FiTarget,
  FiMenu,
  FiX
} from "react-icons/fi";
import { useState } from "react";
import Button from "./Components/Theme/Button";
import Card from "./Components/Theme/Card";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-primary-500/30">

      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                <FiActivity size={22} />
              </div>
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                Committie<span className="text-primary-600">App</span>
              </span>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-bold text-slate-500 hover:text-primary-600 uppercase tracking-widest transition-colors">Features</a>
              <a href="#reviews" className="text-sm font-bold text-slate-500 hover:text-primary-600 uppercase tracking-widest transition-colors">Reviews</a>
              <a href="#faq" className="text-sm font-bold text-slate-500 hover:text-primary-600 uppercase tracking-widest transition-colors">FAQ</a>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/admin/login">
                <button className="text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold text-xs uppercase tracking-widest transition-colors mr-4">
                  Organizer Login
                </button>
              </Link>
              <Link href="/login">
                <button className="text-slate-900 dark:text-white font-black uppercase text-xs tracking-widest hover:text-primary-600 transition-colors">
                  Login
                </button>
              </Link>
              <Link href="/register">
                <Button className="font-black uppercase text-xs tracking-widest px-6 py-3 bg-primary-600 hover:bg-primary-700 shadow-xl shadow-primary-500/20">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-900 dark:text-white">
                {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col p-4 space-y-4">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-sm font-black uppercase text-slate-600">Features</a>
              <a href="#reviews" onClick={() => setMobileMenuOpen(false)} className="text-sm font-black uppercase text-slate-600">Reviews</a>
              <Link href="/admin/login" onClick={() => setMobileMenuOpen(false)} className="text-sm font-black uppercase text-slate-600">Organizer Login</Link>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-sm font-black uppercase text-primary-600">Login</Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full font-black uppercase text-xs tracking-widest">Get Started</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 text-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Trusted by 1000+ Members</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 dark:text-white tracking-tighter mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Save Together.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">Achieve Together.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-[1200ms]">
            Explore, join, and manage committees with ease — all in one app. Secure payments, transparent tracking, and automated payouts.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-12 duration-[1400ms]">
            <Link href="/register">
              <Button className="h-14 px-10 text-sm font-black uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 hover:scale-105 transition-all shadow-2xl">
                Start Saving <FiArrowRight className="ml-2" />
              </Button>
            </Link>
            <Link href="/register">
              <button className="h-14 px-10 text-sm font-black uppercase tracking-widest bg-white dark:bg-slate-900 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all rounded-xl shadow-lg">
                Become an Organizer
              </button>
            </Link>
          </div>

          {/* 3D Dashboard Preview Mockup */}
          <div className="mt-20 mx-auto max-w-5xl rounded-[2rem] bg-slate-900 p-2 md:p-4 shadow-2xl shadow-primary-500/20 rotate-x-12 animate-in fade-in zoom-in-95 duration-[1500ms]">
            <div className="rounded-[1.5rem] overflow-hidden border border-slate-800 bg-slate-950 relative aspect-[16/9]">
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-slate-800 opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <FiActivity size={64} className="mx-auto text-primary-500" />
                  <p className="text-slate-500 font-black uppercase tracking-widest">Interactive Dashboard Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Marketing Section */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">
                Two Paths.<br /><span className="text-primary-500">Infinite Possibilities.</span>
              </h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                Whether you're looking to save for your future or help others achieve their dreams, CommittieApp provides the platform to grow together.
              </p>

              <div className="space-y-6">
                <div className="flex gap-6 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                  <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FiUsers size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black uppercase tracking-tight mb-1">Become a Member</h4>
                    <p className="text-sm text-slate-400">Join verified circles, save consistently, and get your payout when you need it most. No hidden fees, just pure community growth.</p>
                  </div>
                </div>

                <div className="flex gap-6 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                  <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FiTarget size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black uppercase tracking-tight mb-1">Lead as an Organizer</h4>
                    <p className="text-sm text-slate-400">Launch your own committees, set custom rules, and earn through optional organizer fees. Build trust and connections for the future.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-primary-500/20 blur-[100px] rounded-full" />
              <Card className="bg-slate-800/50 border-white/10 p-10 relative z-10 space-y-8 backdrop-blur-xl">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-primary-500">Network Statistics</p>
                  <FiActivity className="text-slate-500" />
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-3xl font-black tracking-tight">1.2K+</p>
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Active Members</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-black tracking-tight">85+</p>
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Verified Organizers</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-black tracking-tight">RS 50M</p>
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Total Pooled</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-black tracking-tight">100%</p>
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Payout Rate</p>
                  </div>
                </div>
                <Link href="/register" className="block">
                  <Button className="w-full py-5 font-black uppercase tracking-widest text-xs">Start Your Journey Now</Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Why Choose <span className="text-primary-600">Us?</span></h2>
            <p className="text-slate-500 max-w-xl mx-auto font-medium">Built for transparency, designed for ease. Managing money circles has never been this simple.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: FiSearch,
                title: "Explore Committees",
                desc: "Find verified money circles near you with varying contribution amounts."
              },
              {
                icon: FiCheckCircle,
                title: "Join with Ease",
                desc: "Apply to your choice and get approved fast with secure verification."
              },
              {
                icon: FiEdit,
                title: "Organizer Tools",
                desc: "Create and manage your own committees with automated tracking."
              },
              {
                icon: FiBell,
                title: "Stay Updated",
                desc: "Real-time notifications for payment turns, cycles, and announcements."
              }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 hover:border-primary-500/50 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300">
                <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-primary-600 shadow-sm mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-3">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section id="reviews" className="py-20 bg-slate-50 dark:bg-slate-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black uppercase tracking-widest text-slate-900 dark:text-white">Trusted by the Community</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { quote: "Easy to explore and join circle savings! The dashboard is super intuitive.", author: "Sarah K.", role: "Member" },
              { quote: "I manage my group without confusion. The automated turn calculator is a lifesaver.", author: "Ahmed R.", role: "Organizer" },
              { quote: "Clear updates & transparency! I verified my payment in seconds.", author: "John D.", role: "Participant" }
            ].map((testimonial, i) => (
              <Card key={i} className="bg-white dark:bg-slate-900 border-none p-8 relative">
                <div className="absolute top-6 right-8 text-6xl text-slate-100 dark:text-slate-800 font-serif leading-none">"</div>
                <div className="relative z-10 space-y-6">
                  <p className="text-slate-600 dark:text-slate-300 font-medium text-lg leading-relaxed">
                    {testimonial.quote}
                  </p>
                  <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-500 rounded-full flex items-center justify-center text-white font-black text-xs">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase text-slate-900 dark:text-white">{testimonial.author}</p>
                      <p className="text-xs text-slate-400 font-black uppercase tracking-widest">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 md:px-8 space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {[
              { q: "How do I join a committee?", a: "Simply create an account, browse available committees in the 'Explore' section, and send a request. Once approved by the admin, you're in!" },
              { q: "Can I create my own committee?", a: "Yes! Any registered user can become an organizer. Navigate to your dashboard and select 'Create Committee' to set your rules." },
              { q: "Is it safe?", a: "We prioritize security. All accounts are verified, and we maintain a strict log of all transactions and activities for full transparency." }
            ].map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">{faq.q}</h4>
                <p className="text-slate-500 font-medium text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-16 bg-primary-600 text-white relative overflow-hidden">
        <FiShield className="absolute -left-10 -bottom-20 text-white/5 rotate-12" size={400} />
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: FiShield, text: "Secure Platform" },
              { icon: FiUsers, text: "Real Committees" },
              { icon: FiCheckCircle, text: "Transparent Process" },
              { icon: FiDollarSign, text: "No Hidden Fees" },
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center gap-4 animate-in zoom-in-50 duration-700" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                  <badge.icon size={32} />
                </div>
                <p className="text-sm font-black uppercase tracking-widest">{badge.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-950 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white">
              <FiActivity size={18} />
            </div>
            <span className="text-xl font-black tracking-tighter">
              Committie<span className="text-primary-600">App</span>
            </span>
          </div>
          <div className="flex gap-8 text-slate-400 text-xs font-black uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-slate-600 text-xs font-medium">© 2026 CommittieApp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
