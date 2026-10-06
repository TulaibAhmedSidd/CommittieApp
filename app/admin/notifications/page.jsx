"use client";

import { Page } from "../../ui";
import { W } from "../../utils/words";
import NotificationList from "../../Components/NotificationList";

export default function AdminNotificationsPage() {
  return (
    <Page title={W.alerts.en} urdu={W.alerts.ur}>
      <NotificationList scope="admin" />
    </Page>
  );
}
