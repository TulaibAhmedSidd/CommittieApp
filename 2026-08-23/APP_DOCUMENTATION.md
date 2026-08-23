# CommitteeApp Comprehensive Platform Specifications & Feature Summary
**Date of Reference**: August 23, 2026  
**File Location**: `/2026-08-23/APP_DOCUMENTATION.md`

---

## 1. Executive Summary & Core Value Proposition

**CommitteeApp** is a modern, enterprise-grade digital platform designed to digitize, secure, and automate traditional collaborative saving circles (commonly known as "Committees", "BCOs", or "ROSCA" - Rotating Savings and Credit Associations).

By combining bank-grade security, real-time auditing, identity verification, and a unified design system, CommitteeApp solves key pain points in traditional informal savings:
* **Identity & Trust Security**: Mandatory identity verification (CNIC front/back, utility bill address verification, selfie check) before members can join pools.
* **Transparent Governance**: Verified Organizers manage financial circuits with real-time audit logs, transparent payment receipts, and automated draw announcements.
* **Deterministic Financial Cycles**: Automated calculation of pool totals, monthly installments, advance-month validations, and beneficiary payouts.
* **Dual-Language Accessibility**: Built-in bilingual support (English & Urdu) throughout the landing pages, member portal, and organizer workflows.

---

## 2. Directory Layout & System Architecture

Built on **Next.js 14 (App Router)**, **Tailwind CSS**, and **MongoDB / Mongoose ODM**, the application follows a modular directory structure:

```
/app
├── admin/                  # Organizer Portal Pages
│   ├── add-admin/          # Invite co-organizers / subordinate admins
│   ├── addmember/          # Admin-side direct member onboarding
│   ├── all-members/        # Directory of all network members
│   ├── announcement/       # Draw management & randomized result broadcast
│   ├── approvals/          # Member join request management center
│   ├── assign-member/      # Assign existing members to specific pools
│   ├── create/             # 5-Step Committee Creation Wizard
│   ├── edit/               # Pool parameters & bank settings editor
│   ├── inbox/              # Organizer notification & message center
│   ├── logs/               # Full system audit logger & ledger
│   ├── manage/             # Reconcile payments, record payouts, advance months
│   ├── manage-committie/   # Table archive of all created committees
│   ├── profile/            # Admin credentials & identity settings
│   └── verify-identities/  # Member document verification interface
├── adminLogin/             # Organizer login page
├── api/                    # RESTful Backend API Endpoints
│   ├── admin/              # Admin authentication, profile & invitation APIs
│   ├── announcement/       # Draw randomization algorithm & notifications
│   ├── assets/             # File storage and image retrieval asset router
│   ├── committee/          # Committee CRUD, join requests, payments & payouts
│   ├── login/              # Member authentication endpoint
│   ├── member/             # Member profiles, document uploads & verification
│   ├── notification/       # Notification delivery & status router
│   └── system/             # Database maintenance & diagnostic helper routes
├── Components/             # Reusable UI & Feature Components
│   ├── Theme/              # Modern Theme Primitives (Button, Card, Input, Table, etc.)
│   ├── ChatBox.jsx         # Real-time WebSockets/Polling chat widget
│   ├── DiscoveryPanel.jsx  # Committee discovery component
│   └── MyCommittie2.jsx    # Member committee workspace
├── userDash/               # Member Portal Pages
│   ├── committee/[id]/     # Member active pool workspace & payment submitter
│   ├── explore/            # Open committee browsing panel
│   ├── inbox/              # Member message & notification center
│   ├── join/               # Step-by-step pool request & consent agreement
│   ├── near-me/            # Location-based pool directory
│   ├── organizer/          # Public organizer profile viewer
│   └── profile/            # Member verification & profile management
├── utils/                  # Core Libraries (db.js, auth.js, logger.js)
└── middleware.js           # Security headers, auth guards & edge route rules
```

---

## 3. Comprehensive Feature Specifications

### 3.1 Design System & Theme Primitives (`/app/Components/Theme/`)
The application is governed by a unified design system supporting dark/light mode, HSL design variables, glassmorphism (`.glass-panel`, `.metric-tile`, `.dashboard-shell`), and responsive mobile layouts:
* **`Button`**: Supports variants (`primary`, `secondary`, `outline`, `ghost`, `danger`), sizes (`sm`, `md`, `lg`), loading spinner states, and Tailwind class merging.
* **`Card`**: 24px/32px rounded glassmorphic panels with subtle borders and ambient shadows.
* **`Input`**: Standardized input field supporting label, error message, and flexible `icon` prop (safely handling both React elements like `<FiMail />` and component references like `FiMail`).
* **`Table`**: Full data table primitive with header/row/cell structure, hover highlights, status pills, and empty states.
* **`Modal`**: Accessible centered overlay for consent forms, confirmations, and document reviews.
* **`StatusPill`**: Color-coded status badges (`success`, `warning`, `danger`, `info`, `neutral`).
* **`CycleProgress`**: Visual multi-segment progress bar representing current month vs. total duration and payment counts.
* **`Money`**: Formatted monetary display supporting PKR formatting, suffixes, and custom color tones.
* **`BlueTick`**: Verified identity checkmark badge for verified organizers and members.

---

### 3.2 Member Portal (`/app/userDash/`)
The Member Portal gives participants complete visibility into their financial committees:

1. **My Ongoing / Current Committees Section**:
   * Displays live active circuits (`Live Circuit · جاری کمیٹیاں`).
   * Shows real-time month progress (`Month X of Y`), payment due status (`Paid & Verified`, `Proof Under Review`, or `Payment Due`), and monthly contribution breakdown.
   * Provides quick action buttons: **"Pay PKR {Amount}"** (linking directly to payment upload) and **"Full Circuit Details"**.
2. **Joined & Completed Committees Section**:
   * Archives previous committees and non-ongoing pool memberships.
3. **Pending Requests Section**:
   * Tracks join requests submitted by the member that are currently awaiting organizer review.
4. **Discover & Explore Nearby**:
   * Grid browsing panel (`/userDash/explore`) and map-based nearby filter (`/userDash/near-me`) allowing members to discover open pools by location and monthly budget.
5. **KYC Verification Desk (`/userDash/profile`)**:
   * Document upload portal for NIC Front, NIC Back, and Utility Bill verification. Shows status pill (`unverified` -> `pending` -> `verified`).

---

### 3.3 Organizer (Admin) Portal (`/app/admin/`)
The Organizer Portal gives savings circle organizers complete operational control:

1. **5-Step Committee Creation Wizard (`/admin/create`)**:
   * Step 1: Basic Information (Pool Name, Description, Category).
   * Step 2: Financial Setup (Monthly Amount, Member Count, Total Pool Calculation).
   * Step 3: Security & Verification Rules (Require Documents, Security Guarantees).
   * Step 4: Bank Details & Transfer Instructions (Bank Name, Account Title, IBAN).
   * Step 5: Solemn Oath & Final Confirmation.
2. **Pool Management & Financial Reconciliation (`/admin/manage`)**:
   * **Payment Verification**: Review uploaded member receipt screenshots and transaction IDs. Option to "Force Verify" cash payments.
   * **Payout Recording**: Record payout transactions for the month's winning beneficiary with receipt proof.
   * **Advance Month**: Automatically validates that all non-beneficiary payments are verified before advancing the pool to Month N+1.
3. **Randomized Draw System (`/admin/announcement`)**:
   * Triggers server-side draw randomization when a pool is filled to capacity.
   * Assigns payout months (turns 1 to N) fairly and broadcasts results to members via notifications.
4. **Audit Logging & System Ledger (`/admin/logs`)**:
   * Tracks every critical action (`CREATE_COMMITTEE`, `VERIFY_PAYMENT`, `RECORD_PAYOUT`, `ADVANCE_MONTH`, `PING_MEMBER`) with timestamps and admin IDs.
5. **Manage Committees Archive (`/admin/manage-committie`)**:
   * Data table view of all created pools, with search filter, cycle status badges, member counts, and quick management links.

---

### 3.4 Security & Middleware Architecture
* **Edge Guard Rules (`middleware.js`)**: Protects `/api/admin` and `/api/member` routes while allowing essential login, signup, asset viewing, and route-level authorization handlers (`/api/committee`, `/api/member/pool`, `/api/member/approve`, etc.) to execute cleanly.
* **Universal API Headers (`app/admin/apis.js`)**: All admin API helpers automatically attach `Authorization: Bearer <token>` (checking both `admin_token` and `token` in `localStorage`).
* **Database Connection Guard**: Every API handler explicitly awaits `connectToDatabase()` before querying Mongoose models to prevent 500 connection buffer errors.
* **Notification Schema Standards**: Strict schema enforcement (`recipient` ObjectId + `recipientModel` (`Admin` | `Member`)) across all announcement, payout, and notification endpoints.

---

## 4. End-to-End Lifecycle Summary

```
[ Visitor Landing Page ] ──► [ Member / Organizer Registration ] ──► [ Document Upload (KYC) ]
                                                                             │
                                                                             ▼
[ Closed Pool (Finished) ] ◄── [ Monthly Payouts ] ◄── [ Payment Proofs ] ◄── [ Draw Announcement ]
```

1. **Visitor Landing**: Explores public open pools, trust stats (1.2K+ members, 85+ organizers, RS 50M pooled), and features.
2. **Registration & KYC**: Users register as Member or Organizer. Members upload NIC/Utility documents to earn the **Blue Tick**.
3. **Pool Creation & Request**: Verified Organizers create a pool. Members submit join requests with consent agreements.
4. **Organizer Approval & Draw**: Organizer approves members. Once full, the draw randomizes payout turns.
5. **Monthly Operations**: Members submit payment receipts every month. Organizer verifies payments and issues payout to the month's beneficiary.
6. **Pool Completion**: Upon reaching Month N, the pool status moves to `finished` and is archived in historical logs.

---

## 5. Verification & Technical Quality Metrics
* **TypeScript Validity**: `0 Errors` (`npx tsc --noEmit`)
* **Next.js Production Build**: `✓ Compiled successfully` across all **77 static and dynamic routes**.
* **Mobile Viewport Compatibility**: Tested across 390x844 mobile viewports with clean responsive layouts.
* **Git Remote Synchronisation**: Up to date on `origin/main`.
