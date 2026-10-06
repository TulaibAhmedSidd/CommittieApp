"use client";

import { Page } from "../../ui";
import { W } from "../../utils/words";
import InboxList from "../../Components/InboxList";

export default function AdminInboxPage() {
  return (
    <Page title={W.messages.en} urdu={W.messages.ur}>
      <InboxList scope="admin" />
    </Page>
  );
}
