"use client";

import { Page } from "@/app/ui";
import { W } from "@/app/utils/words";
import NotificationList from "@/app/Components/NotificationList";

export default function MemberAlertsPage() {
  return (
    <Page title={W.alerts.en} urdu={W.alerts.ur}>
      <NotificationList scope="member" />
    </Page>
  );
}
