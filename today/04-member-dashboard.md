# 04 — Member Portal & Dashboard

**Associated Route**: `/userDash`  
**Target Role**: Member / Participant  
**Associated Screenshot**: `public/screenshot/member/dashboard.png`  

---

## 1. Overview & Information Hierarchy

The Member Dashboard is the central cockpit for participants. It provides instant visibility into active ongoing savings cycles, pending payments, due dates, and quick actions.

![Member Dashboard](/screenshot/member/dashboard.png)

---

## 2. Header & Profile Banner

- **Personal Greeting**: Bilingual greeting based on time of day:
  *"Assalam-o-Alaikum, shaam bakhair, [Member Name]"*  
  *"آپ کا کمیٹی ڈیش بورڈ"*
- **Location Tag**: Dynamic locality chip (e.g. `Karachi · Gulshan`).
- **Blue Tick Status**: Verified members display the verified pill badge alongside account shortcuts (Profile, Inbox).

---

## 3. Real-Time Financial Metric Cards

The dashboard presents 4 high-contrast KPI cards:
1. **Ongoing Committees (جاری کمیٹیاں)**: Total count of active circuits the member is actively participating in.
2. **Due This Month (اس مہینے واجب)**: Sum of installments pending payment across all circles for the current active month.
3. **Verification Status (تصدیق کی حیثیت)**: Instant indicator (`Yes` / `Pending` / `Not yet`) with quick-action CTA to complete KYC.
4. **Open Committees Nearby (قریبی کمیٹیاں)**: Live count of open pools in proximity available for enrollment.

---

## 4. Quick Action Shortcuts

Grid of accessible navigation tiles:
- **Explore Committees (کمیٹیاں دیکھیں)**: `/userDash/explore`
- **Near Me (میرے قریب)**: `/userDash/near-me`
- **Messages (پیغامات)**: `/userDash/inbox`
- **How it Works (کیسے استعمال کریں)**: `/guide/member`

---

## 5. Live Circuit Cards (`OngoingCommitteeCard`)

For every ongoing committee, the member sees a comprehensive status card:
- **Month Progress**: e.g. `Month 1 of 5`
- **Organizer Attribution**: Verified organizer name with reputation rating.
- **Cycle Progress Bar**: Visual stepper indicating how many members have paid for the current cycle.
- **Installment Amount**: Plain PKR value formatted with thousand separators.
- **Payment Status Pill**:
  - `Paid & Verified` (Emerald) — Installment reconciled by organizer.
  - `Proof Under Review` (Amber) — Receipt uploaded, pending organizer check.
  - `Payment Due` (Red) — Requires immediate payment submission.
- **Direct Pay CTA**: `Pay PKR 5,000` triggers direct navigation to payment submission.
