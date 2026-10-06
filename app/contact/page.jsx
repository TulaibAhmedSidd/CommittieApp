"use client";

import { FiMessageCircle, FiMail, FiMapPin } from "react-icons/fi";
import PublicLayout from "@/app/ui/PublicLayout";
import { Bi, Button, Card } from "@/app/ui";

const WHATSAPP_URL = "https://wa.me/923394054520";
const EMAIL = "support@committieapp.com";

export default function ContactPage() {
  return (
    <PublicLayout narrow>
      <h1 className="mb-1 text-2xl font-bold text-ink-900">
        <Bi en="Contact us" ur="ہم سے رابطہ کریں" stack />
      </h1>
      <p className="mb-6 text-ink-600">Message us on WhatsApp or send an email. We usually reply within one day.</p>

      <Card padding="p-5" className="space-y-3">
        <Button href={WHATSAPP_URL} variant="whatsapp" size="lg" full icon={FiMessageCircle}>
          <Bi en="Chat on WhatsApp" ur="واٹس ایپ پر بات کریں" />
        </Button>
        <p className="text-center text-sm text-ink-600">+92 339 4054520</p>

        <Button href={`mailto:${EMAIL}`} variant="secondary" size="lg" full icon={FiMail}>
          {EMAIL}
        </Button>
      </Card>

      <div className="mt-6 flex items-center gap-3 text-ink-600">
        <FiMapPin className="h-5 w-5 shrink-0" aria-hidden />
        <span>Karachi, Pakistan</span>
      </div>

      <section className="mt-8">
        <h2 className="mb-2 text-[15px] font-semibold text-ink-600">
          <Bi en="Before you write" ur="لکھنے سے پہلے" />
        </h2>
        <ul className="list-disc space-y-1.5 pl-5 text-[15px] text-ink-700">
          <li>For questions about a payment or payout, please ask your BC organizer first.</li>
          <li>Never send us your password.</li>
          <li>To delete your account or data, message us from the phone number you signed up with.</li>
        </ul>
      </section>
    </PublicLayout>
  );
}
