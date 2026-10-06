"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";
import { Button, TextArea } from "../../../../ui";
import { memberApi } from "../../../../utils/api";

export default function RateOrganizer({ organizerId, organizerName }) {
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await memberApi.post("/api/review", { organizerId, rating: stars, comment });
      setDone(true);
      toast.success("Thank you!");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (done) return <p className="mt-3 text-ink-700">Thanks for rating {organizerName}.</p>;

  return (
    <div className="mt-4 space-y-3">
      <p className="font-semibold text-ink-800">How was {organizerName}?</p>
      <div className="flex gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" role="radio" aria-checked={stars === n} aria-label={`${n} star${n > 1 ? "s" : ""}`} onClick={() => setStars(n)} className="p-1">
            <FaStar className={`h-8 w-8 ${n <= stars ? "text-warning-500" : "text-surface-300"}`} />
          </button>
        ))}
      </div>
      {stars > 0 && (
        <>
          <TextArea label="Comment (optional)" value={comment} onChange={(e) => setComment(e.target.value)} maxLength={500} />
          <Button onClick={save} loading={saving}>
            Send rating
          </Button>
        </>
      )}
    </div>
  );
}
