"use client";

import Link from "next/link";
import { FiChevronDown } from "react-icons/fi";
import PublicLayout from "@/app/ui/PublicLayout";
import GuideVideo from "@/app/Components/GuideVideo";
import { Bi, Button } from "@/app/ui";

const FAQS = [
  {
    q: "How do I join a BC?",
    ur: "کمیٹی میں کیسے شامل ہوں؟",
    a: [
      "Ask your organizer to send you the WhatsApp link. Open it and tap Ask to join.",
      "Or log in, open Find BCs, choose a BC and tap Ask to join.",
    ],
  },
  {
    q: "How do I pay?",
    ur: "قسط کیسے دوں؟",
    a: [
      "Open your BC and tap Pay now. Then send a photo of your receipt.",
      "You can also pay cash to your organizer. They will mark it as paid.",
    ],
  },
  {
    q: "When do I get my money?",
    ur: "مجھے رقم کب ملے گی؟",
    a: ["Open your BC and look at Your turn. It shows the month you get the pot."],
  },
  {
    q: "I forgot my password",
    ur: "میں پاس ورڈ بھول گیا ہوں",
    a: [
      "Tap Forgot password on the login page.",
      "If you have no email, ask your organizer. They can send you a new password link on WhatsApp.",
    ],
  },
  {
    q: "Is my information safe?",
    ur: "کیا میری معلومات محفوظ ہیں؟",
    a: ["Only your organizer can see your phone number and documents. We do not share or sell your data."],
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

export default function MemberGuidePage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-1 text-2xl font-bold text-ink-900">
          <Bi en="Help for members" ur="ممبرز کے لیے مدد" stack />
        </h1>
        <div className="mb-6">
          <GuideVideo who="member" />
        </div>

        <p className="mb-6 text-ink-600">Tap a question to see the answer.</p>

        <div className="space-y-3">
          {FAQS.map((f) => (
            <Faq key={f.q} {...f} />
          ))}
        </div>

        <div className="mt-8 space-y-3 text-center">
          <p className="text-ink-600">Do you run a BC?</p>
          <Button href="/guide/organizer" variant="secondary" full className="sm:w-auto">
            <Bi en="Help for organizers" ur="منتظم کے لیے مدد" />
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
