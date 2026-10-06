"use client";

import Link from "next/link";
import { FiChevronDown } from "react-icons/fi";
import PublicLayout from "@/app/ui/PublicLayout";
import { Bi, Button } from "@/app/ui";

const FAQS = [
  {
    q: "How do I create a BC?",
    ur: "کمیٹی کیسے بنائیں؟",
    a: [
      "Tap Create BC. Enter the name, monthly amount and how many members.",
      "The number of months is the same as the number of members.",
      "Pot = monthly amount × (members − 1), because the person who gets the pot that month does not pay.",
    ],
  },
  {
    q: "How do I add members?",
    ur: "ممبرز کیسے شامل کریں؟",
    a: [
      "Open the BC, go to Members and tap Add member. Then tap Send on WhatsApp.",
      "Or share the Invite link in your family WhatsApp group.",
    ],
  },
  {
    q: "How do I start the BC?",
    ur: "کمیٹی کیسے شروع کریں؟",
    a: [
      "When the BC is full, tap Start BC.",
      "Choose a random draw, or set the turn order yourself.",
    ],
  },
  {
    q: "What do I do each month?",
    ur: "ہر مہینے کیا کرنا ہے؟",
    a: [
      "Check the receipts members send. Mark cash payments as Paid in cash.",
      "Tap Give payout when you hand over the pot. Then tap Next month.",
    ],
  },
  {
    q: "A member forgot their password",
    ur: "ممبر پاس ورڈ بھول گیا",
    a: ["Go to Members and open that member. Tap New password link and send it on WhatsApp."],
  },
];

function Faq({ q, ur, a }) {
  return (
    <details className="group rounded-xl border border-line bg-white shadow-card">
      <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 [&::-webkit-details-marker]:hidden">
        <span className="text-base font-semibold text-ink-900">
          <Bi en={q} ur={ur} stack />
        </span>
        <FiChevronDown className="h-5 w-5 shrink-0 text-ink-500 transition-transform group-open:rotate-180" aria-hidden />
      </summary>
      <div className="space-y-2 border-t border-line px-4 py-3 text-[15px] text-ink-700">
        {a.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </details>
  );
}

export default function OrganizerGuidePage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-1 text-2xl font-bold text-ink-900">
          <Bi en="Help for organizers" ur="منتظم کے لیے مدد" stack />
        </h1>
        <p className="mb-6 text-ink-600">Tap a question to see the answer.</p>

        <div className="space-y-3">
          {FAQS.map((f) => (
            <Faq key={f.q} {...f} />
          ))}
        </div>

        <div className="mt-8 space-y-3 text-center">
          <p className="text-ink-600">Are you a member of a BC?</p>
          <Button href="/guide/member" variant="secondary" full className="sm:w-auto">
            <Bi en="Help for members" ur="ممبرز کے لیے مدد" />
          </Button>
          <p className="text-sm text-ink-600">
            Still need help?{" "}
            <Link href="/contact" className="inline-block py-2 font-semibold text-primary-700 hover:underline">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
