# 03 — Member Identity Verification (KYC)

**Associated Route**: `/userDash/profile`  
**Target Role**: Member / Participant  
**Associated Screenshot**: `public/screenshot/member/verification.png`  

---

## 1. The Trust Dilemma in Pakistani Kameties

Traditional Kameti circles often face trust failures when members default after taking early payout slots. CommittieApp solves this at the protocol layer through a multi-tiered KYC (Know Your Customer) identity verification pipeline.

![Member Verification](/screenshot/member/verification.png)

---

## 2. Verification Tiers

The application maintains 3 explicit verification states on the `Member` model:

| Status | Badge | Description | Committee Permissions |
| :--- | :--- | :--- | :--- |
| **Unverified** | Amber Warning (`! Not Verified`) | Member has signed up with email/phone only. No documents provided. | Can browse explore catalogue; join requests trigger warning to organizers. |
| **Pending** | Blue Clock (`Verification Pending`) | Documents submitted and currently in Super Admin review queue. | Can participate in low-limit informal committees. |
| **Verified** | Emerald Check & Blue Tick (`Verified Profile`) | Full CNIC Front/Back + Electricity Bill verified by platform administration. | Eligible for all high-value committees and prioritized drawing spots. |

---

## 3. Required KYC Artifacts

1. **National Identity Card (CNIC Front)**:
   - Must show full legal name, photo, father/husband name, and 13-digit CNIC number.
2. **National Identity Card (CNIC Back)**:
   - Must clearly show residential address, issue date, and family tree code.
3. **Recent Utility Bill (Electricity / Gas / Water)**:
   - Must match the residential address on the CNIC to prove physical residency and deter fly-by-night default.

---

## 4. Verification Form & API Workflow

- **Endpoint**: `POST /api/member/verify` or `POST /api/member/[id]`
- **File Upload Handler**:
  - The UI uses `<UploadCapture />` component supporting camera capture, gallery selection, and local file storage.
  - Files are uploaded and stored securely, returning a persistent CDN URL.
- **State Transition**:
  - Submitting KYC moves `verificationStatus` from `"unverified"` to `"pending"`.
  - Super Admin reviews documents on `/admin/verify` and triggers approval, transitioning status to `"verified"`.
  - Once verified, the user is awarded the **Blue Tick** badge visible across member rosters, committee detail boards, and chat.
