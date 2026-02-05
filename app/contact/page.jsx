import React from 'react'

const Contact = () => {
  return (
    <main className="flex-1 min-h-screen relative overflow-x-hidden py-4 md:pt-0 g-[#0f172a]">
      <div className="mt-40 max-w-7xl mx-auto px-4 md:px-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-slate-100 tracking-tighter mb-4">
          Contact Us
        </h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-3xl mb-12 font-medium leading-relaxed">
          Have questions, suggestions, or need support? We’re here to help you with everything related to committees.
        </p>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Left Side – Contact Info */}
          <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 border border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Get in Touch
            </h2>

            <p className="text-slate-600 mb-6 leading-relaxed">
              You can reach us directly via WhatsApp or email. We usually respond within 24 hours.
            </p>

            {/* WhatsApp */}
            <a
              href="https://wa.me/923394054520"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full mb-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white py-3 font-semibold transition"
            >
              📱 Chat on WhatsApp
            </a>

            {/* Email */}
            <a
              href="mailto:ahsidtullu@gmail.com"
              className="flex items-center justify-center w-full rounded-xl border border-slate-300 text-slate-700 py-3 font-semibold hover:bg-slate-100 transition"
            >
              ✉️ support@committieapp.com
            </a>

            {/* Location */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Location
              </h3>
              <p className="text-slate-600">
                Karachi, Pakistan 🇵🇰
              </p>
            </div>
          </div>

          {/* Right Side – Contact Form */}
          <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 border border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">
              Send Us a Message
            </h2>

            <form
              action="mailto:support@committieapp.com"
              method="POST"
              encType="text/plain"
              className="space-y-4"
            >
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <textarea
                name="message"
                rows="5"
                placeholder="Your Message"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white py-3 font-semibold transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* About Founder Section */}
        <div className="mt-20 bg-white rounded-2xl shadow-md p-6 md:p-10 border border-slate-200">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 tracking-tighter">
            About the Founder
          </h2>

          <p className="text-slate-600 text-lg leading-relaxed mb-4">
            CommittieApp was founded after identifying a real and common problem: users were unable to find trusted committees, and organizers struggled to manage members transparently and securely.
          </p>

          <p className="text-slate-600 text-lg leading-relaxed mb-4">
            Many users faced fraud, lack of visibility, and zero accountability. On the other side, genuine organizers had no proper platform to build trust, manage payments, or verify members.
          </p>

          <p className="text-slate-600 text-lg leading-relaxed">
            CommittieApp solves both sides of the problem by providing a transparent, location-based, and review-driven committee system — empowering users and organizers with trust, structure, and peace of mind.
          </p>
        </div>

      </div>
    </main>
  );
};

export default Contact;