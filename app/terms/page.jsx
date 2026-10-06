"use client";

import Link from "next/link";
import PublicLayout from "@/app/ui/PublicLayout";
import { Bi, Card } from "@/app/ui";

const SECTIONS = [
  {
    en: "What CommittieApp is",
    ur: "کمیٹی ایپ کیا ہے",
    items: [
      "CommittieApp is a free tool to keep records of a BC: members, monthly payments, receipts and payouts.",
      "CommittieApp does not hold, collect or send money. All money moves between members and the organizer directly.",
    ],
  },
  {
    en: "The organizer's job",
    ur: "منتظم کی ذمہ داری",
    items: [
      "The organizer is responsible for collecting the monthly amounts and giving the payout each month.",
      "The organizer should keep the records in the app correct and up to date.",
      "Organizer accounts are checked by our admin before they can be used.",
    ],
  },
  {
    en: "The member's job",
    ur: "ممبر کی ذمہ داری",
    items: [
      "Pay your monthly amount on time and send a real receipt.",
      "Use your own name and phone number.",
    ],
  },
  {
    en: "Disagreements",
    ur: "اختلاف کی صورت میں",
    items: [
      "If there is a problem about money, talk to your organizer first.",
      "We are not a party to any BC and cannot pay back any money. The app's records can help you check who paid.",
    ],
  },
  {
    en: "Fair use",
    ur: "درست استعمال",
    items: [
      "Do not use the app for fraud or to mislead people.",
      "We may close accounts that break these rules.",
      "We may update these terms. The latest version is always on this page.",
    ],
  },
];

export default function TermsPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-1 text-2xl font-bold text-ink-900">
          <Bi en="Terms of use" ur="استعمال کی شرائط" stack />
        </h1>
        <p className="mb-6 text-ink-600">Simple rules for using CommittieApp.</p>

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
        </div>

        <p className="mt-6 text-[15px] text-ink-600">
          Questions?{" "}
          <Link href="/contact" className="inline-block py-2 font-semibold text-primary-700 hover:underline">
            Contact us
          </Link>
        </p>
      </div>
    </PublicLayout>
  );
}
