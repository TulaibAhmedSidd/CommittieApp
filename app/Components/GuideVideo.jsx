import { Card, Bi } from "@/app/ui";
import { W } from "@/app/utils/words";

// Urdu screen-by-screen guide videos. Files live in public/guides (made with scripts/guide-video).
// They are excluded from the service-worker precache (next.config.mjs), so they load only on play.
const VIDEOS = {
  organizer: { src: "/guides/organizer-guide-urdu.mp4", poster: "/guides/organizer-guide-poster.jpg", words: W.forOrganizers, length: "6:43" },
  member: { src: "/guides/member-guide-urdu.mp4", poster: "/guides/member-guide-poster.jpg", words: W.forMembers, length: "3:22" },
};

export default function GuideVideo({ who }) {
  const v = VIDEOS[who];
  return (
    <Card className="h-full">
      <h3 className="text-base font-semibold text-ink-900">
        <Bi {...v.words} stack />
      </h3>
      <p className="mt-1 text-[15px] text-ink-600">In Urdu · {v.length} min</p>
      <video
        controls
        playsInline
        preload="none"
        poster={v.poster}
        aria-label={`${v.words.en}: video guide in Urdu`}
        className="mx-auto mt-3 aspect-[9/16] max-h-[70vh] w-full rounded-lg bg-ink-900 object-contain"
      >
        <source src={v.src} type="video/mp4" />
      </video>
    </Card>
  );
}
