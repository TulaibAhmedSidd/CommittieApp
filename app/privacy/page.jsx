import React from 'react'
const PrivacyPolicy = () => {
  return (
    <main className="flex-1 min-h-screen relative overflow-x-hidden pt-4 md:pt-0 bg-[#0f172a]">
      <div className="mt-40 max-w-7xl mx-auto px-4 md:px-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">

        {/* Page Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tighter mb-4">
          Privacy Policy
        </h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-3xl mb-12 font-medium leading-relaxed">
          Your privacy is important to us. This Privacy Policy explains how CommittieApp collects, uses, stores, and protects your personal information.
        </p>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-slate-900 mb-3">
            1. Information We Collect
          </h2>
          <p className="text-slate-600 leading-relaxed mb-2">
            We may collect the following types of information when you use CommittieApp:
          </p>
          <ul className="list-disc pl-6 text-slate-600 space-y-1">
            <li>Personal details such as name, phone number, email address, and profile photo</li>
            <li>Location data including city, country, and current location (with your permission)</li>
            <li>Committee participation details, payment history, and transaction proofs</li>
            <li>Device and usage information for security and performance improvement</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-slate-900 mb-3">
            2. How We Use Your Information
          </h2>
          <p className="text-slate-600 leading-relaxed mb-2">
            We use your information to:
          </p>
          <ul className="list-disc pl-6 text-slate-600 space-y-1">
            <li>Provide, manage, and improve our committee services</li>
            <li>Help users find nearby committees and trusted organizers</li>
            <li>Verify transactions and payment submissions</li>
            <li>Prevent fraud, misuse, and unauthorized access</li>
            <li>Communicate updates, alerts, and important service notices</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-slate-900 mb-3">
            3. Location Data
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Location data is collected only with your consent. It is used to show nearby committees, organizers, and members. You can update or disable location access at any time through your account settings.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-slate-900 mb-3">
            4. Data Sharing and Visibility
          </h2>
          <p className="text-slate-600 leading-relaxed mb-2">
            We do not sell or rent your personal data. Certain information may be visible to others:
          </p>
          <ul className="list-disc pl-6 text-slate-600 space-y-1">
            <li>Your name and profile may be visible within committees you join</li>
            <li>Payment status (paid/unpaid) may be visible to committee members</li>
            <li>Organizers can view transaction proofs for verification</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-slate-900 mb-3">
            5. Payments and Transactions
          </h2>
          <p className="text-slate-600 leading-relaxed">
            CommittieApp does not directly process or store sensitive banking information. Payment proofs and transaction IDs uploaded by users are stored securely and used only for verification within committees.
          </p>
        </section>

        {/* Section 6 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-slate-900 mb-3">
            6. Data Security
          </h2>
          <p className="text-slate-600 leading-relaxed">
            We implement industry-standard security measures to protect your data. However, no online platform can guarantee complete security. Users are responsible for keeping their login credentials confidential.
          </p>
        </section>

        {/* Section 7 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-slate-900 mb-3">
            7. Account Deletion
          </h2>
          <p className="text-slate-600 leading-relaxed">
            You may request account deletion at any time. Certain records (such as committee history and transaction logs) may be retained where legally or operationally required.
          </p>
        </section>

        {/* Section 8 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-slate-900 mb-3">
            8. Changes to This Policy
          </h2>
          <p className="text-slate-600 leading-relaxed">
            We may update this Privacy Policy from time to time. Any changes will be posted on this page. Continued use of the platform indicates acceptance of the updated policy.
          </p>
        </section>

        {/* Section 9 */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-slate-900 mb-3">
            9. Contact Us
          </h2>
          <p className="text-slate-600 leading-relaxed">
            If you have any questions or concerns about this Privacy Policy, please contact us at:
          </p>
          <p className="text-slate-700 font-medium mt-2">
            📧 support@committieapp.com <br />
            📍 Karachi, Pakistan
          </p>
        </section>

      </div>
    </main>
  );
};

export default PrivacyPolicy;
