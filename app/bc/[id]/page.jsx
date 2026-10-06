"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FiCheckCircle, FiFileText, FiClock, FiAlertCircle } from "react-icons/fi";
import PublicLayout from "@/app/ui/PublicLayout";
import { Bi, Button, Card, Money, StatusBadge, Skeleton, ErrorBox } from "@/app/ui";
import { W } from "@/app/utils/words";
import { publicApi, memberApi } from "@/app/utils/api";
import { getSession } from "@/app/utils/session";

const monthYear = (d) => {
  if (!d) return "Not set yet";
  const date = new Date(d);
  return Number.isNaN(date.getTime()) ? "Not set yet" : date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

function Fact({ en, ur, children, className = "" }) {
  return (
    <div className={`rounded-xl border border-line bg-surface-50 p-3 ${className}`}>
      <p className="text-sm text-ink-600">
        <Bi en={en} ur={ur} stack />
      </p>
      <div className="mt-1 text-xl font-bold text-ink-900">{children}</div>
    </div>
  );
}

function Message({ icon: Icon, title, urdu, text, children }) {
  return (
    <Card padding="p-6" className="text-center">
      <Icon className="mx-auto mb-3 h-10 w-10 text-ink-500" aria-hidden />
      <h1 className="text-xl font-bold text-ink-900">
        <Bi en={title} ur={urdu} stack />
      </h1>
      {text && <p className="mt-2 text-ink-600">{text}</p>}
      <div className="mt-5 space-y-3">{children}</div>
    </Card>
  );
}

export default function PublicBcPage() {
  const { id } = useParams();
  const [bc, setBc] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [askError, setAskError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    publicApi
      .get(`/api/public/bc/${id}`)
      .then((d) => setBc(d.committee))
      .catch((e) => setError({ status: e.status, message: e.message }))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    setLoggedIn(!!getSession("member"));
    load();
  }, [load]);

  const askToJoin = async () => {
    setAskError("");
    setSending(true);
    try {
      await memberApi.post(`/api/committee/${id}/request`, {});
      setSent(true);
    } catch (e) {
      setAskError(e.message);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <PublicLayout narrow>
        <div className="space-y-4" aria-busy="true" aria-label="Loading">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-48" />
          <Skeleton className="h-14" />
        </div>
      </PublicLayout>
    );
  }

  if (error) {
    return (
      <PublicLayout narrow>
        {error.status === 410 ? (
          <Message icon={FiClock} title="This BC has already started" urdu="یہ کمیٹی شروع ہو چکی ہے" text="Ask the organizer about their next BC.">
            <Button href={loggedIn ? "/userDash/explore" : "/"} variant="secondary" full>
              {loggedIn ? <Bi {...W.explore} /> : "Go to home"}
            </Button>
          </Message>
        ) : error.status === 404 || error.status === 400 ? (
          <Message icon={FiAlertCircle} title="BC not found" urdu="کمیٹی نہیں ملی" text="This link may be old or typed wrong. Ask the organizer to send it again.">
            <Button href="/" variant="secondary" full>
              Go to home
            </Button>
          </Message>
        ) : (
          <ErrorBox message={error.message} onRetry={load} />
        )}
      </PublicLayout>
    );
  }

  if (!bc) return null;
  const organizerName = bc.organizer?.name || "The organizer";
  // Only "full" when every place is a member. Pending requests may still be rejected, so the server decides the rest.
  const full = bc.membersCount >= bc.maxMembers;
  const next = encodeURIComponent(`/bc/${id}`);
  const registerHref = `/register?${bc.referralCode ? `ref=${encodeURIComponent(bc.referralCode)}&` : ""}next=${next}`;

  if (sent) {
    return (
      <PublicLayout narrow>
        <Card padding="p-6">
          <FiCheckCircle className="mb-3 h-10 w-10 text-primary-600" aria-hidden />
          <h1 className="text-xl font-bold text-ink-900">
            <Bi en="Request sent" ur="درخواست بھیج دی گئی" stack />
          </h1>
          <p className="mt-2 text-ink-700">{organizerName} will reply. You will get a message when they approve.</p>
          <Button href="/userDash" variant="secondary" full className="mt-5">
            <Bi {...W.myBcs} />
          </Button>
        </Card>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout narrow>
      <h1 className="text-2xl font-bold leading-tight text-ink-900">{bc.name}</h1>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-ink-600">
        <span>
          Organized by <span className="font-semibold text-ink-900">{organizerName}</span>
          {bc.organizer?.city ? `, ${bc.organizer.city}` : ""}
        </span>
        {bc.organizer?.verificationStatus === "verified" && <StatusBadge status="verifiedId" />}
      </div>
      {bc.description && <p className="mt-3 text-ink-700">{bc.description}</p>}

      <Card padding="p-4" className="mt-5">
        <div className="grid grid-cols-2 gap-3">
          <Fact {...W.monthlyAmount}>
            <Money value={bc.monthlyAmount} size="lg" />
          </Fact>
          <Fact {...W.members}>
            {bc.membersCount}/{bc.maxMembers}
          </Fact>
          <Fact en="Starts" ur="شروع" className="col-span-2">
            {monthYear(bc.startDate)}
          </Fact>
          <Fact en="Each person gets" ur="ہر ممبر کو ملے گا" className="col-span-2 border-primary-100 bg-primary-50">
            <Money value={bc.pot} size="xl" className="text-primary-800" />
            <p className="mt-1 text-sm font-normal text-ink-600">Once, in {bc.monthDuration || bc.maxMembers} months</p>
          </Fact>
        </div>
      </Card>

      {bc.requireDocuments && bc.mandatoryDocuments?.length > 0 && (
        <div className="mt-4 rounded-xl border border-warning-100 bg-warning-50 p-4 text-warning-700">
          <p className="flex items-center gap-2 font-semibold">
            <FiFileText className="h-5 w-5 shrink-0" aria-hidden />
            <Bi en="Documents needed" ur="ضروری دستاویزات" />
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-[15px]">
            {bc.mandatoryDocuments.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <p className="mt-2 text-sm">Add them in your profile before you ask to join.</p>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {full ? (
          <p className="rounded-lg bg-surface-200 px-3 py-3 text-center font-medium text-ink-700">This BC is full. Ask the organizer about their next BC.</p>
        ) : loggedIn ? (
          <>
            <Button full size="lg" loading={sending} onClick={askToJoin}>
              <Bi {...W.askToJoin} />
            </Button>
            {askError && <p className="rounded-lg bg-danger-50 px-3 py-2 text-sm font-medium text-danger-700">{askError}</p>}
          </>
        ) : (
          <>
            <Button href={registerHref} full size="lg">
              <Bi en="Create account to join" ur="شامل ہونے کے لیے اکاؤنٹ بنائیں" />
            </Button>
            <Button href={`/login?next=${next}`} variant="secondary" full size="lg">
              <Bi en="I have an account" ur="میرا اکاؤنٹ ہے" />
            </Button>
          </>
        )}
      </div>
    </PublicLayout>
  );
}
