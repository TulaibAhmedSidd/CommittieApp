const Terms = () => {
    return (
        <main className="flex-1 min-h-screen bg-[#0f172a] text-[var(--foreground)] relative overflow-x-hidden pt-10 md:pt-16">
            <div className="max-w-5xl mx-auto px-4 md:px-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">

                {/* Header */}
                <header className="mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--foreground)]">
                        Terms & Conditions
                    </h1>
                    <p className="mt-4 text-base md:text-lg text-[var(--secondary)] leading-relaxed max-w-3xl">
                        Welcome to <span className="font-semibold text-[var(--primary)]">CommittieApp</span>.
                        By accessing or using our platform, you agree to the following Terms & Conditions.
                        Please read them carefully before proceeding.
                    </p>
                </header>

                {/* Card Wrapper */}
                <section className="space-y-10 bg-[var(--card-background)] border border-[var(--border-color)] rounded-2xl p-6 md:p-10 shadow-[var(--card-shadow)]">

                    {/* Section */}
                    <div>
                        <h2 className="text-xl md:text-2xl font-semibold text-[var(--foreground)] mb-3">
                            1. Acceptance of Terms
                        </h2>
                        <p className="text-[var(--secondary)] leading-relaxed">
                            By registering, accessing, or using CommittieApp, you confirm that you have read,
                            understood, and agreed to be legally bound by these Terms & Conditions.
                            If you do not agree, you must not use the platform.
                        </p>
                    </div>

                    {/* Section */}
                    <div>
                        <h2 className="text-xl md:text-2xl font-semibold text-[var(--foreground)] mb-3">
                            2. User Roles & Responsibilities
                        </h2>
                        <ul className="list-disc pl-6 space-y-2 text-[var(--secondary)]">
                            <li>Members are responsible for timely monthly contributions.</li>
                            <li>Organizers are responsible for managing committees, verifying payments, and payouts.</li>
                            <li>Super Admin oversees approvals, audits, and platform integrity.</li>
                        </ul>
                    </div>

                    {/* Section */}
                    <div>
                        <h2 className="text-xl md:text-2xl font-semibold text-[var(--foreground)] mb-3">
                            3. Identity Verification & Blue Tick
                        </h2>
                        <p className="text-[var(--secondary)] leading-relaxed">
                            Users and organizers may be required to submit identity details including NIC number
                            and original NIC image. Once verified by the Super Admin (or authorized admin),
                            a <span className="font-semibold text-[var(--primary)]">Blue Tick</span> will be assigned
                            as a trust indicator across the platform.
                        </p>
                    </div>

                    {/* Section */}
                    <div>
                        <h2 className="text-xl md:text-2xl font-semibold text-[var(--foreground)] mb-3">
                            4. Payments, Proof & Transparency
                        </h2>
                        <p className="text-[var(--secondary)] leading-relaxed">
                            All committee payments and payouts must be supported with valid proof such as
                            transaction ID or receipt. Payment status of members is visible to committee members
                            for transparency, but cannot be edited by other users.
                        </p>
                    </div>

                    {/* Section */}
                    <div>
                        <h2 className="text-xl md:text-2xl font-semibold text-[var(--foreground)] mb-3">
                            5. Committee Failure, Death & Emergencies
                        </h2>
                        <p className="text-[var(--secondary)] leading-relaxed">
                            In the event of death, disaster, or inability to continue, the organizer must pause
                            the committee and notify all members. Refunds, adjustments, or resolutions will be
                            handled transparently according to committee rules. CommittieApp acts only as a
                            facilitator and does not guarantee funds.
                        </p>
                    </div>

                    {/* Section */}
                    <div>
                        <h2 className="text-xl md:text-2xl font-semibold text-[var(--foreground)] mb-3">
                            6. Reviews & Conduct
                        </h2>
                        <p className="text-[var(--secondary)] leading-relaxed">
                            Members may leave reviews for organizers. Reviews must be honest, respectful,
                            and factual. Fake reviews, harassment, or abusive behavior may result in suspension
                            or termination.
                        </p>
                    </div>

                    {/* Section */}
                    <div>
                        <h2 className="text-xl md:text-2xl font-semibold text-[var(--foreground)] mb-3">
                            7. Platform Disclaimer
                        </h2>
                        <p className="text-[var(--secondary)] leading-relaxed">
                            CommittieApp is a technology platform and not a financial institution.
                            We do not hold funds, guarantee payouts, or take responsibility for member defaults.
                            Users participate at their own risk.
                        </p>
                    </div>

                    {/* Section */}
                    <div>
                        <h2 className="text-xl md:text-2xl font-semibold text-[var(--foreground)] mb-3">
                            8. Changes to Terms
                        </h2>
                        <p className="text-[var(--secondary)] leading-relaxed">
                            We reserve the right to modify these Terms at any time.
                            Continued use of the platform after updates constitutes acceptance of the revised Terms.
                        </p>
                    </div>

                </section>

                {/* Footer Note */}
                <p className="text-sm text-center text-[var(--secondary)] mt-10">
                    © {new Date().getFullYear()} CommittieApp. All rights reserved.
                </p>

            </div>
        </main>
    );
};

export default Terms;
