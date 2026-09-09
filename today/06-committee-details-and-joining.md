# 06 — Committee Room & Active Circuit Board

**Associated Route**: `/userDash/committee/[id]`  
**Target Role**: Member / Participant  
**Associated Screenshot**: `public/screenshot/member/committee-details.png`  

---

## 1. Overview

The Committee Room is the transparent heart of CommittieApp. It provides complete visibility into the financial state of a specific savings pool, eliminating the opacity that historically plagued traditional offline committees.

![Committee Details](/screenshot/member/committee-details.png)

---

## 2. Operational Metrics Bar

- **Pool Status Badge**: `OPEN`, `ONGOING`, or `FINISHED`.
- **Core Parameters**:
  - **Installment**: Monthly PKR contribution (e.g., `PKR 5,000`).
  - **Duration**: Total cycle length (e.g., `5 Months`).
  - **Current Cycle**: Active month indicator (e.g., `Month 1`).

---

## 3. Active Payment Board

A public ledger table visible to all participants in the committee:
- **Member Identity**: Avatar, full legal name, and city location.
- **Payment Status**: Real-time pill:
  - `VERIFIED` (Green): Payment received and confirmed by organizer.
  - `PENDING` (Amber): Member uploaded transfer receipt; awaiting organizer sign-off.
  - `UNPAID / AWAITING PAYMENT` (Slate): Member has not yet submitted transfer proof.
- **Timestamp**: Time of last reconciliation (e.g., `2 hours ago`).

---

## 4. Organizer Reputation & Direct Chat

- Displays organizer's name with **Blue Tick** verification badge.
- Star rating and total verified reviews from previous completed committees.
- **Message Organizer CTA**: Opens inline floating chat drawer connecting directly to organizer inbox.

---

## 5. Personal Vault & Bank Coordinates

- **Vault Coordinates**: Official bank account designated by the organizer to receive payments:
  - Account Title
  - Bank Name (e.g., `Meezan Bank`, `HBL`)
  - Official IBAN / Account Number
- **Sync Installment Data CTA**: Opens the payment proof upload modal.
