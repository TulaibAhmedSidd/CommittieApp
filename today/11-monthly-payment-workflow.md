# 11 — Monthly Payment Workflow & Authentication

**Associated Routes**:
- `/userDash/committee/[id]` (Member Payment Submission)
- `/admin/manage?id=...` (Organizer Payment Review)

**Associated Screenshots**:
- `public/screenshot/member/payment-proof-upload.png`
- `public/screenshot/organizer/payment-approvals.png`

---

## 1. End-to-End Payment Sequence

```mermaid
sequenceDiagram
    actor M as Member
    participant P as Member Portal
    participant API as Next.js API
    participant DB as MongoDB
    participant O as Organizer Console
    actor Org as Organizer
    
    M->>P: Open Committee Room
    P->>M: Display Bank Coordinates (IBAN, Bank Name)
    M->>M: Transfer PKR 5,000 via Banking App
    M->>P: Click "Sync Installment Data"
    M->>P: Fill Transaction ID & Upload Transfer Slip
    P->>API: POST /api/committee/[id]/payment
    API->>DB: Update payment status -> "pending"
    
    Org->>O: Open /admin/manage?id=...
    O->>Org: Display "PENDING" badge on member row
    Org->>O: Click "View Proof"
    O->>Org: Show Receipt Image + Transaction ID
    Org->>O: Click "AUTHENTICATE"
    O->>API: POST /api/payment/status { status: "verified" }
    API->>DB: Update payment status -> "verified"
    O-->>Org: Toast "Payment verified"
    P-->>M: Status badge updates to "Paid & Verified"
```

---

## 2. Member Proof Submission Modal

![Payment Proof Upload](/screenshot/member/payment-proof-upload.png)

- **Base Installment**: Displayed clearly (e.g. `RS 5,000`).
- **Transaction ID / Protocol Ref**: Text input for bank transaction reference number.
- **Transfer Evidence**: Multi-source upload component (Gallery, Camera, or Asset Library).
- **Submission Trigger**: `FINALIZE & SYNC` sends data to API and closes modal.

---

## 3. Organizer Verification & Authentication Modal

![Payment Approvals](/screenshot/organizer/payment-approvals.png)

- **Transaction Identity**: Displays entered reference ID (e.g. `TXN-9988776655`).
- **Timestamp**: Exact submission date and time.
- **Member Testimony**: Optional note submitted by member (e.g. *"Paid via Meezan Mobile App"*).
- **Decision Controls**:
  - **AUTHENTICATE (Emerald)**: Confirms receipt and locks payment record as verified.
  - **FLAG IRREGULARITY (Red)**: Rejects payment proof with reason notification to member.
