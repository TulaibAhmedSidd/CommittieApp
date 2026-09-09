# 08 — Organizer Dashboard & Console

**Associated Route**: `/admin`  
**Target Role**: Committee Organizer (منتظم)  
**Associated Screenshot**: `public/screenshot/organizer/dashboard.png`  

---

## 1. Overview & Information Architecture

The Organizer Dashboard (`/admin`) provides a consolidated operational overview for managing one or multiple savings circles.

![Organizer Dashboard](/screenshot/organizer/dashboard.png)

---

## 2. Metrics & Portfolio Overview

- **Greeting & Status Pill**:
  *"Assalam-o-Alaikum, shaam bakhair, [Organizer Name]"*  
  Pill tags: `OPERATIONAL`, `ORGANIZER`, `VERIFIED`.
- **Total Pooled Value (کل جمع رقم)**: Aggregate capital under active circulation across all committees managed by this organizer.
- **Active Committees (فعال کمیٹیاں)**: Count of open and ongoing savings pools.
- **Total Members (کل اراکین)**: Total participants across the organizer's active circuits.
- **Pending Approvals (منظوری زیر التواء)**: Alerts showing participants requesting to join or pending payment authentications.

---

## 3. Quick Action Shortcuts

High-priority operational tiles:
- **Create Committee (نئی کمیٹی)**: Routes to `/admin/create`.
- **Manage Members (اراکین)**: Routes to `/admin/manage-committie` or member roster.
- **Announcements (اعلانات)**: Global broadcast tool for committee news.
- **Inbox (پیغامات)**: Direct communication hub with members.
- **Verify Identities (شناخت کی تصدیق)**: Member KYC documentation review interface.

---

## 4. Active Pools Roster

Cards representing each managed committee:
- **Progress Counter**: `Month X / Y`
- **Installment Size**: PKR monthly contribution.
- **Total Pool Value**: Full capital value (e.g. `₨25,000`, `₨60,000`).
- **Pending Badges**: Highlights join requests waiting for review (e.g., `1 join request pending`).
- **Manage Button**: Deep links directly to the detailed operations console (`/admin/manage?id=...`).
