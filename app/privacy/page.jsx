"use client";

import Link from "next/link";
import PublicLayout from "@/app/ui/PublicLayout";
import { Bi, Card } from "@/app/ui";

const SECTIONS = [
  {
    en: "What we store",
    ur: "ہم کیا محفوظ کرتے ہیں",
    items: [
      "Your name and mobile number.",
      "Your email, only if you add one.",
      "Your BC records: which BCs you are in, payments and payouts.",
      "Receipt photos you send.",
      "ID documents (like your NIC), only if a BC asks for them and you upload them.",
    ],
  },
  {
    en: "Who can see it",
    ur: "یہ کون دیکھ سکتا ہے",
    items: [
      "Your organizer can see your phone number, receipts and documents.",
      "Other members of your BC can see your name and whether you have paid.",
      "Our admin can see your account only to keep the app safe and to help you.",
    ],
  },
  {
    en: "What we never do",
    ur: "ہم یہ کبھی نہیں کرتے",
    items: [
      "We do not sell your data.",
      "We do not share your data with advertisers.",
      "We do not send SMS. Links are sent on WhatsApp, or by email if you have one.",
    ],
  },
  {
    en: "Keeping it safe",
    ur: "حفاظت",
    items: [
      "Passwords are stored in a locked (hashed) form. Nobody can read them, not even us.",
      "Photos and documents open only for people who are allowed to see them.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-1 text-2xl font-bold text-ink-900">
          <Bi en="Privacy" ur="رازداری" stack />
        </h1>
        <p className="mb-6 text-ink-600">How CommittieApp looks after your information. In short: we keep only what the BC needs.</p>

        <div className="space-y-4">
          {SECTIONS.map((s) => (
            <Card key={s.en} padding="p-5">
              <h2 className="mb-2 text-lg font-semibold text-ink-900">
                <Bi en={s.en} ur={s.ur} stack />
              </h2>
              <ul className="list-disc space-y-1.5 pl-5 text-[15px] text-ink-700">
                {s.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </Card>
          ))}

          <Card padding="p-5">
            <h2 className="mb-2 text-lg font-semibold text-ink-900">
              <Bi en="Delete your data" ur="اپنا ڈیٹا ختم کروائیں" stack />
            </h2>
            <p className="text-[15px] text-ink-700">
              You can ask us to delete your account and data at any time. Message us from the phone number you signed up with.{" "}
              <Link href="/contact" className="inline-block py-1 font-semibold text-primary-700 hover:underline">
                Contact us
              </Link>
            </p>
            <p className="mt-2 text-[15px] text-ink-700">
              Records of a BC that is still running may be kept until it finishes, so the other members' records stay correct.
            </p>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}
