# 10 — Committee Operations & Member Management

**Associated Route**: `/admin/manage?id=...`  
**Target Role**: Committee Organizer (منتظم)  
**Associated Screenshots**:
- `public/screenshot/organizer/manage-members.png`
- `public/screenshot/lifecycle/month-01.png`

---

## 1. Overview & Operational Controls

The Committee Operations view is the primary administrative engine for managing active cycles.

![Manage Members](/screenshot/organizer/manage-members.png)

---

## 2. Command Header & Status Badges

- **Committee Title**: e.g., `QA Alpha Circle`
- **Cycle Description**: *"Month 1 of 5. Review requests, verify payments, and keep beneficiary movement transparent."*
- **Status Badges**:
  - `STATUS: OPEN` / `STATUS: ONGOING` / `STATUS: FINISHED`
  - `MEMBERS: [Count]`
  - `PENDING: [Count]`
- **Cycle Control Buttons**:
  - **ADVANCE MONTH (اگلا مہینہ)**: Advances the cycle counter to the next month.
  - **CLOSE BC (کمیٹی ختم کریں)**: Marks the committee as finished and seals the financial ledger.

---

## 3. Payment Status & Roster Table

The table lists every enrolled participant for the active month:
- **Member Name & Dues**: Displays participant name, location, and due amount (e.g., `Due: RS 5,000`).
- **Status Indicator**:
  - `VERIFIED` (Green): Payment received and confirmed.
  - `PENDING` (Amber): Receipt uploaded; requires organizer verification.
  - `UNPAID` (Red/Gray): Awaiting submission.
- **Action Buttons per Row**:
  - **View Proof (Eye icon)**: Opens the verification modal to inspect receipt.
  - **Ping Member (Bell icon)**: Sends urgent reminder notification.
  - **Message Member (Chat icon)**: Opens direct chat.
  - **Force Verify (Checkmark icon)**: Allows manual reconciliation if payment received via cash or external channel.

---

## 4. Pool Stats & Active Beneficiary

- **Current Month Progress**: e.g., `1 / 5`.
- **Beneficiary (This Month)**: Name of the drawing winner scheduled to receive the accumulated pool for the active cycle.
- **Payout Account**: Beneficiary's verified bank account title, bank name, and IBAN.
- **Record Payout CTA**: Opens the disbursement logging modal.
