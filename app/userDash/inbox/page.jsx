"use client";

import { Page } from "@/app/ui";
import { W } from "@/app/utils/words";
import InboxList from "@/app/Components/InboxList";

export default function MemberInboxPage() {
  return (
    <Page title={W.messages.en} urdu={W.messages.ur}>
      <InboxList scope="member" />
    </Page>
  );
}
