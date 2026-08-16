# CommitteeApp Platform Specifications
**Date of Reference**: August 16, 2026  
**File Location**: `/2026-08-16/APP_DOCUMENTATION.md`

---

## 1. Executive Summary & Core Value Proposition
CommitteeApp is a premium, decentralized digital platform that modernizes the traditional collaborative saving circles (commonly known as "Committees" or "ROSCA" - Rotating Savings and Credit Associations). 

By offering a secure digital environment, the app bridges trust gaps through:
* **Rigorous Identity Verification**: Mandatory multi-document verification (NIC Front/Back, Utilities) before gaining pool access.
* **Organizer Governance**: Only verified Organizers can manage financial transactions, payouts, and draws.
* **Realtime Auditing**: Publicly visible payment/payout histories and immutable system audit logs.
* **Eecosystem Discovery**: Map-based and list-based discovery panels allowing members to connect with proven local organizers.

---

## 2. Directory Layout & Architecture Overview
The app is built as a hybrid Next.js 14 application using the App Router with Mongoose as the database ODM.

```
/app
├── admin/                  # Organizer Portal (Pages & Layouts)
│   ├── add-admin/          # Invite subordinate admins
│   ├── addmember/          # Admin-side member addition wizard
│   ├── all-members/        # Directory of all network members
│   ├── announcement/       # Draw management & results announcement
│   ├── approvals/          # Member join request manager
│   ├── assign-member/      # Assign existing members to pools
│   ├── create/             # 5-Step Committee Creation Wizard
│   ├── edit/               # Pool configuration modifier
│   ├── inbox/              # Chat message dashboard
│   ├── logs/               # Audit logger tracker
│   ├── manage/             # Reconcile payments & payouts for active pools
│   ├── manage-committie/   # Archive lists of all organizer committees
│   ├── profile/            # Admin credentials & settings
│   └── verify-identities/  # Member document verification interface
├── adminLogin/             # Organizer login landing page
├── api/                    # RESTful Backend API Routes
│   ├── admin/              # Admin auth and invitation routes
│   ├── announcement/       # Draw randomization algorithm
│   ├── assets/             # File storage asset router
│   ├── committee/          # Committee CRUD & Request handlers
│   ├── login/              # Member auth endpoint
│   ├── member/             # Member profiles & verification handlers
│   ├── notification/       # Notification delivery router
│   └── system/             # Cleanup and diagnostic helper routes
├── Components/             # Core Shared Components
│   ├── Theme/              # Reusable UI Primitives (Button, Card, Input, etc.)
│   ├── ChatBox.jsx         # Real-time WebSockets/Polling chat box
│   ├── DiscoveryPanel.jsx  # Member exploration dashboard
│   └── MyCommittie2.jsx    # Detailed member pool workspace
├── userDash/               # Member Portal (Pages & Layouts)
│   ├── committee/[id]/     # Member workspace for active pool
│   ├── explore/            # Open committee browsing panel
│   ├── join/               # Step-by-step pool request flow
│   ├── near-me/            # Location-based pool directory
│   └── profile/            # Member verification & details page
├── utils/                  # Core helper libraries (db.js, auth.js, logger.js)
└── middleware.js           # Route guards, bypasses, and security handlers
```

---

## 3. Core Feature Specifications

### 3.1 Verification Desk & KYC Flow
To participate in saving pools, members must undergo identity validation:
1. **Document Submission**: Members upload high-resolution scans of:
   * National Identity Card (NIC) - Front View
   * National Identity Card (NIC) - Back View
   * Utility Bill (Electricity/Gas) for address confirmation
2. **Verification Levels**:
   * `unverified`: Standard profile. Blocked from requesting to join any committees.
   * `pending`: Documents uploaded and awaiting review.
   * `verified`: Admin-approved. Opens access to discovery and join features.
3. **Approval Mechanism**: Verified admins review uploaded documents via `/admin/verify-identities` and approve or reject submissions with click actions.

### 3.2 Committee Creation Wizard
Verifed organizers create savings pools via a 5-step form at `/admin/create`:
* **Basic Configuration**: Name, monthly installment amount, total members/months (e.g. 10 members for 10 months).
* **Financial Settings**: Organizer fee percentage, mandatory check for commission.
* **Security Controls**: Mandatory document requirements (e.g., whether joining members must supply separate security guarantees).
* **Bank Routing**: Bank name, account title, and IBAN for member transfer instructions.

### 3.3 The Drawing System (Announcement)
Once a pool is filled to its `maxMembers` capacity:
1. The Organizer navigates to `/admin/announcement` and triggers the draw.
2. The server executes a randomization algorithm on all approved members to assign payout months (turns 1 to N).
3. Results are saved in the DB, and emails are sent to members notifying them of their winning payout month.

### 3.4 Payments & Payouts Cycle
* **Payments**: Members upload a screenshot proof of payment plus a transaction ID for the current month.
* **Manual Reconciliation (Force Verify)**: Organizers can reconcile cash payments directly via `/admin/manage` (which updates payment status to `verified` and creates a placeholder asset).
* **Payouts**: In each cycle, the Organizer registers the payout for the month's beneficiary, providing the transaction ID and an image receipt.
* **Advance Month**: Once all non-beneficiary payments for the current month are set to `verified`, the Organizer can advance the committee to the next month.

---

## 4. Comprehensive Route Directory

### 4.1 Organizer (Admin) Pages

* **[`/admin`](file:///d:/ReactProjects/Committie/CommittieApp/app/admin/page.jsx)**: Admin home showing stats tiles (Active committees, total monthly collections, member counts) and recent activity widgets.
* **[`/admin/create`](file:///d:/ReactProjects/Committie/CommittieApp/app/admin/create/page.jsx)**: Step-by-step savings circle creation form.
* **[`/admin/manage`](file:///d:/ReactProjects/Committie/CommittieApp/app/admin/manage/page.jsx)**: Reconcile payments, record payouts, advance months, and view member lists for a selected active committee.
* **[`/admin/manage-committie`](file:///d:/ReactProjects/Committie/CommittieApp/app/admin/manage-committie/page.jsx)**: List grid of all created pools (categorized into Open, In Progress, and Finished).
* **[`/admin/verify-identities`](file:///d:/ReactProjects/Committie/CommittieApp/app/admin/verify-identities/page.jsx)**: Document viewer showing pending member profiles with interactive Approve/Reject buttons.
* **[`/admin/announcement`](file:///d:/ReactProjects/Committie/CommittieApp/app/admin/announcement/page.jsx)**: Perform draws, view randomized turns, and broadcast draw results.
* **[`/admin/logs`](file:///d:/ReactProjects/Committie/CommittieApp/app/admin/logs/page.jsx)**: System log explorer that monitors backend actions (ADVANCE_MONTH, RECORD_PAYOUT, VERIFY_PAYMENT, PING_MEMBER).

### 4.2 Member Pages

* **[`/userDash`](file:///d:/ReactProjects/Committie/CommittieApp/app/userDash/page.tsx)**: Member dashboard home showing verification status, active pools, pending requests, open savings circles, and notifications.
* **[`/userDash/committee/[id]`](file:///d:/ReactProjects/Committie/CommittieApp/app/userDash/committee/[id]/page.jsx)**: Detail workspace for a member's active committee. Shows payout turn order, monthly payment calendars, receipt upload forms, and the real-time Group Chat widget.
* **[`/userDash/near-me`](file:///d:/ReactProjects/Committie/CommittieApp/app/userDash/near-me/page.tsx)**: Local map interface filtering pools and organizers based on coordinate distance.
* **[`/userDash/explore`](file:///d:/ReactProjects/Committie/CommittieApp/app/userDash/explore/page.jsx)**: Grid directory of open committees that members can join.
* **[`/userDash/profile`](file:///d:/ReactProjects/Committie/CommittieApp/app/userDash/profile/page.jsx)**: Personal profile settings and verification document upload portal.

---

## 5. Backend RESTful API Reference

### 5.1 Authentication & Registration
* **`POST /api/admin`**: Register a new Organizer (starts as `pending` unless created by Super Admin).
* **`POST /api/admin/login`**: Authenticate Organizer credentials, returns dynamic JWT token.
* **`POST /api/member`**: Register a new Member (starts as `approved`, `unverified` verification status).
* **`POST /api/login`**: Authenticate Member credentials, returns dynamic JWT token.

### 5.2 Committee Management
* **`GET /api/committee`**: Fetch list of committees (supports query filters by Organizer, status, etc.).
* **`POST /api/committee`**: Create a new savings pool.
* **`POST /api/committee/[id]/request`**: Member submits request to join (JSON: `{ memberId }`).
* **`GET /api/committee/[id]/request`**: Fetch list of pending join requests for a pool.
* **`POST /api/committee/[id]/request` (Admin)**: Approve/Reject member join request (JSON: `{ memberId, action: 'approve' }`).
* **`PATCH /api/committee/[id]/payment`**: Upload receipt or force-reconcile monthly member payments.
* **`POST /api/committee/[id]/payout`**: Record bank payout to the month's beneficiary.
* **`PATCH /api/committee/[id]/status`**: Advance month (`action: 'advance_month'`) or close pool (`action: 'close_bc'`).

### 5.3 Notifications & Diagnostics
* **`GET /api/notification`**: Fetch chronological list of notifications for a user (JSON: `?userId=X`).
* **`POST /api/notification`**: Create new notification.
* **`POST /api/announcement`**: Randomize and publish drawing results (JSON: `{ committeeId }`).
* **`GET /api/assets/[id]`**: Serves uploaded images (NIC, utility bills, payment receipts) from DB storage.
