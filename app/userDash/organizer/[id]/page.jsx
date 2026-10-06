"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { FiCalendar, FiCheck, FiMapPin, FiMessageCircle, FiStar, FiUserPlus } from "react-icons/fi";
import { Avatar, Bi, Button, Card, EmptyState, ErrorBox, Loading, Page, Section, Skeleton, StatusBadge } from "@/app/ui";
import { W } from "@/app/utils/words";
import { memberApi } from "@/app/utils/api";
import ChatBox from "@/app/Components/ChatBox";
import OpenBcCard from "../../_components/OpenBcCard";

const dayMonth = (d) => (d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "");
const stars = (n) => "★".repeat(Math.round(n)) + "☆".repeat(5 - Math.round(n));

export default function OrganizerProfilePage() {
  const { id } = useParams();
  const [org, setOrg] = useState(null);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState(null);
  const [reviewError, setReviewError] = useState("");
  const [following, setFollowing] = useState(false);
  const [followBusy, setFollowBusy] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const load = useCallback(() => {
    setError("");
    memberApi
      .get(`/api/admin/${id}/details`)
      .then((d) => {
        setOrg(d.organizer);
        setFollowing(!!d.organizer.following);
      })
      .catch((e) => setError(e.message));
  }, [id]);

  const loadReviews = useCallback(() => {
    setReviewError("");
    memberApi
      .get(`/api/review?organizerId=${id}`)
      .then((d) => setReviews(d.reviews || []))
      .catch((e) => setReviewError(e.message));
  }, [id]);

  useEffect(() => {
    load();
    loadReviews();
  }, [id, load, loadReviews]);

  const follow = async () => {
    setFollowBusy(true);
    try {
      await memberApi.post("/api/member/pool", { adminId: id });
      setFollowing(true);
      toast.success("You will see their new BCs on your home screen.");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setFollowBusy(false);
    }
  };

  const markPending = (bcId) =>
    setOrg((o) => ({ ...o, upcoming: o.upcoming.map((b) => (b._id === bcId ? { ...b, isPending: true } : b)) }));

  if (error) {
    return (
      <Page title="Organizer" urdu="منتظم" back="/userDash/explore">
        <ErrorBox message={error} onRetry={load} />
      </Page>
    );
  }
  if (!org) return <Loading rows={3} />;

  const verified = org.verificationStatus === "verified";

  return (
    <Page title={org.name} back="/userDash/explore">
      <Card padding="p-5">
        <div className="flex items-start gap-4">
          <Avatar name={org.name} size="lg" />
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-lg font-bold text-ink-900">{org.name}</span>
              {verified && <StatusBadge status="verifiedId" />}
            </div>
            {org.city && (
              <p className="inline-flex items-center gap-1.5 text-sm text-ink-600">
                <FiMapPin className="h-4 w-4" aria-hidden />
                {org.city}
              </p>
            )}
            <p className="flex items-center gap-1.5 text-sm text-ink-700">
              <FiStar className="h-4 w-4 text-warning-600" aria-hidden />
              {org.reviewCount > 0 ? `${org.averageRating} ★ (${org.reviewCount} ${org.reviewCount === 1 ? "review" : "reviews"})` : "No reviews yet"}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <Count label={W.comingUp} value={org.upcoming?.length || 0} />
          <Count label={W.running} value={org.runningCount} />
          <Count label={W.finished} value={org.finishedCount} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="secondary" full icon={FiMessageCircle} onClick={() => setChatOpen(true)}>
            <Bi en="Message" ur="پیغام" />
          </Button>
          {following ? (
            <Button variant="secondary" full icon={FiCheck} disabled>
              <Bi en="Following" ur="فالو کر رہے ہیں" />
            </Button>
          ) : (
            <Button full icon={FiUserPlus} loading={followBusy} onClick={follow}>
              <Bi en="Follow" ur="فالو کریں" />
            </Button>
          )}
        </div>
      </Card>

      <Section title={W.comingUp.en} urdu={W.comingUp.ur} count={org.upcoming?.length || 0}>
        {org.upcoming?.length ? (
          <div className="space-y-3">
            {org.upcoming.map((bc) => (
              <OpenBcCard key={bc._id} bc={bc} onJoined={markPending} />
            ))}
          </div>
        ) : (
          <EmptyState icon={FiCalendar} title="No BCs coming up" urdu="ابھی کوئی آنے والی کمیٹی نہیں" text="Follow to see their new BCs." />
        )}
      </Section>

      <Section title="Reviews" urdu="رائے">
        {reviewError ? (
          <ErrorBox message={reviewError} onRetry={loadReviews} />
        ) : !reviews ? (
          <Skeleton className="h-24" />
        ) : !reviews.length ? (
          <EmptyState icon={FiStar} title="No reviews yet" urdu="ابھی کوئی رائے نہیں" />
        ) : (
          <Card padding="p-0" className="divide-y divide-line overflow-hidden">
            {reviews.map((r) => (
              <div key={r._id} className="px-4 py-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-ink-900">{r.memberName}</span>
                  <span className="text-[13px] text-ink-500">{dayMonth(r.createdAt)}</span>
                </div>
                <p className="mt-0.5 text-warning-600" aria-label={`${r.rating} out of 5 stars`}>
                  {stars(r.rating)}
                </p>
                {r.comment && <p className="mt-1 text-[15px] text-ink-700">{r.comment}</p>}
              </div>
            ))}
          </Card>
        )}
      </Section>

      <ChatBox open={chatOpen} onClose={() => setChatOpen(false)} scope="member" otherId={id} otherModel="Admin" otherName={org.name} />
    </Page>
  );
}

function Count({ label, value }) {
  return (
    <div className="rounded-lg bg-surface-100 px-2 py-2.5">
      <p className="text-xl font-bold tabular-nums text-ink-900">{value}</p>
      <p className="text-[13px] text-ink-600">
        <Bi en={label.en} ur={label.ur} stack />
      </p>
    </div>
  );
}
