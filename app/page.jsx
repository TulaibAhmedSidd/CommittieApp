"use client";

import Link from "next/link";
import { FiPlusCircle, FiUsers, FiCamera, FiGift, FiEye, FiPhone, FiGlobe } from "react-icons/fi";
import PublicLayout from "@/app/ui/PublicLayout";
import { Button, Card, Bi } from "@/app/ui";
import { W } from "@/app/utils/words";


const STEPS = [
  {
    icon: FiPlusCircle,
    en: "Create a BC",
    ur: "کمیٹی بنائیں",
    text: "Choose the monthly amount and how many members.",
  },
  {
    icon: FiUsers,
    en: "Add family on WhatsApp",
    ur: "واٹس ایپ پر گھر والوں کو شامل کریں",
    text: "Send each person a link. They join with their phone number.",
  },
  {
    icon: FiCamera,
    en: "Everyone pays and sends a receipt",
    ur: "سب قسط دیں اور رسید بھیجیں",
    text: "Members send a photo of the receipt. Cash is fine too.",
  },
  {
    icon: FiGift,
    en: "Give the payout each month",
    ur: "ہر مہینے رقم دیں",
    text: "One person gets the pot each month, in turn order.",
  },
];

const REASONS = [
  {
    icon: FiEye,
    en: "Everyone sees who paid",
    ur: "سب کو پتا ہوتا ہے کس نے قسط دی",
    text: "No more confusion. The list is the same for everyone.",
  },
  {
    icon: FiPhone,
    en: "No email needed",
    ur: "ای میل کی ضرورت نہیں",
    text: "A phone number is enough to sign up and log in.",
  },
  {
    icon: FiGlobe,
    en: "Works in Urdu and English",
    ur: "اردو اور انگریزی دونوں میں",
    text: "Tap the language button at the top to switch.",
  },
];

export default function LandingPage() {
  return (
    <PublicLayout>
      <div className="space-y-12 sm:space-y-16">
        {/* Hero */}
        <section className="mx-auto max-w-2xl pt-2 text-center sm:pt-6">
          <h1 className="text-[28px] font-bold leading-tight text-ink-900 sm:text-4xl">Run your family BC on your phone</h1>
          <p lang="ur" dir="rtl" className="font-urdu mt-3 text-xl leading-loose text-ink-700 sm:text-2xl">
            اپنی کمیٹی موبائل پر آسانی سے چلائیں
          </p>
          <p className="mx-auto mt-4 max-w-lg text-base text-ink-600 sm:text-lg">
            Members, monthly payments, receipts and payouts — all in one place. Free.
          </p>
          <div className="mx-auto mt-6 flex max-w-sm flex-col gap-3 sm:max-w-md sm:flex-row sm:justify-center">
            <Button href="/register" size="lg" full className="sm:w-auto sm:min-w-[180px]">
              <Bi {...W.register} />
            </Button>
            <Button href="/login" variant="secondary" size="lg" full className="sm:w-auto sm:min-w-[140px]">
              <Bi {...W.login} />
            </Button>
          </div>
          <Link
            href="/register?role=organizer"
            className="mt-4 inline-flex min-h-[44px] items-center px-2 text-[15px] font-semibold text-primary-700 hover:underline"
          >
            <Bi en="I run BCs (organizer)" ur="میں کمیٹی چلاتا ہوں" />
          </Link>
        </section>

        {/* How it works */}
        <section aria-labelledby="how-title">
          <h2 id="how-title" className="mb-4 text-xl font-bold text-ink-900 sm:text-2xl">
            <Bi en="How it works" ur="یہ کیسے کام کرتا ہے" stack />
          </h2>
          <ol className="grid gap-3 sm:grid-cols-2">
            {STEPS.map((s, i) => (
              <li key={s.en}>
                <Card className="flex h-full items-start gap-4">
                  <div className="flex shrink-0 flex-col items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-base font-bold text-white">
                      {i + 1}
                    </span>
                    <s.icon className="h-5 w-5 text-primary-700" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-ink-900">
                      <Bi en={s.en} ur={s.ur} stack />
                    </h3>
                    <p className="mt-1 text-[15px] text-ink-600">{s.text}</p>
                  </div>
                </Card>
              </li>
            ))}
          </ol>
        </section>

        {/* Why families use it */}
        <section aria-labelledby="why-title">
          <h2 id="why-title" className="mb-4 text-xl font-bold text-ink-900 sm:text-2xl">
            <Bi en="Why families use it" ur="گھر والے اسے کیوں استعمال کرتے ہیں" stack />
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {REASONS.map((r) => (
              <Card key={r.en} className="h-full">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                  <r.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-3 text-base font-semibold text-ink-900">
                  <Bi en={r.en} ur={r.ur} stack />
                </h3>
                <p className="mt-1 text-[15px] text-ink-600">{r.text}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Final call to action */}
        <section>
          <Card padding="p-6 sm:p-8" className="text-center">
            <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
              <Bi en="Ready to start?" ur="شروع کرنے کے لیے تیار ہیں؟" stack />
            </h2>
            <p className="mx-auto mt-2 max-w-md text-ink-600">Make your first BC in a few minutes. Then invite your family.</p>
            <div className="mx-auto mt-5 max-w-sm">
              <Button href="/register?role=organizer" size="lg" full>
                <Bi en="Start your first BC" ur="اپنی پہلی کمیٹی شروع کریں" />
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </PublicLayout>
  );
}
