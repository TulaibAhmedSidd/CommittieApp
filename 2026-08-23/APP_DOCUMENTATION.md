# CommitteeApp Comprehensive Platform Specifications & Feature Breakdown
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

## 3. Comprehensive Breakdown of All Member Portal Sections (`/userDash/*`)

### 3.1 Member Dashboard Home (`/userDash`)
The main landing hub when a member logs in:
1. **Greeting & Member Identity Card**:
   * Displays personalized bilingual greeting (*"Assalam-o-Alaikum, subh bakhair"*), member's first name, Urdu tagline, city/county location badge, and verification pill.
   * Ambient glassmorphism styling (`.glass-panel`, `.dashboard-shell`) with glowing borders.
2. **Member Profile Brief & Quick Links**:
   * Shows initials avatar badge, full name, verified **Blue Tick** (if approved), email address, and 1-click links to **Profile** and **Inbox**.
3. **Verification Call-To-Action Banner**:
   * Appears if member status is `unverified` or `pending`. Explains identity requirements and provides a **"Verify Now"** CTA button.
4. **Key Metrics Strip (`Stat` Primitives)**:
   * Displays 4 metric tiles: *Ongoing Committees* (count), *Due This Month* (PKR sum + unpaid pool count), *Verified Status* (`Verified`/`Pending`/`Not Yet`), and *Open Committees Nearby* (count).
5. **Quick Actions Grid (`ActionTile` Primitives)**:
   * 4 interactive shortcut tiles with Urdu subtitles:
     * *Explore Committees* (*کمیٹیاں دیکھیں*) -> `/userDash/explore`
     * *Near Me* (*میرے قریب*) -> `/userDash/near-me`
     * *Messages* (*پیغامات*) -> `/userDash/inbox`
     * *How It Works* (*کیسے استعمال کریں*) -> `/guide/member`
6. **My Ongoing / Current Committees (Featured Live Circuit Section)**:
   * Dedicated section for active ongoing pools.
   * Features a live badge (`Live Circuit · جاری کمیٹیاں`) with pulsing green indicator.
   * Month progress pill (`Month X of Y`).
   * Visual multi-segment `CycleProgress` bar representing completed months and verified payment counts.
   * Monthly contribution breakdown formatted via the `Money` component.
   * Color-coded payment due status pill (`Paid & Verified`, `Proof Under Review`, or `Payment Due`).
   * Action buttons: **"Pay PKR {Amount}"** (opens receipt uploader) and **"Full Circuit Details"** (opens committee workspace).
7. **Joined & Completed Committees Section**:
   * Archives previous committees and non-ongoing memberships.
8. **Pending Requests Section**:
   * Tracks join requests submitted by the member that are currently awaiting organizer review.
9. **Discover Open Committees Nearby**:
   * Displays a preview grid of newly opened committees with available slots.

### 3.2 Active Committee Workspace (`/userDash/committee/[id]`)
Deep-dive workspace for a specific active committee pool:
1. **Committee Overview & Bank Info Card**:
   * Shows pool name, total pool size (e.g. PKR 100,000), monthly contribution, total duration in months, organizer name, and official bank routing details (Bank Name, Account Title, IBAN) for transfer instructions.
2. **Draw & Payout Schedule Panel**:
   * Displays randomized draw results. Shows which member wins the payout pool in Month 1, Month 2, ..., Month N, highlighting the logged-in member's turn position.
3. **Monthly Payment Calendar & Status Grid**:
   * Matrix of all months in the cycle showing whether payments are `verified`, `pending proof`, or `unpaid`.
4. **Monthly Payment Receipt Upload Form**:
   * Select month, enter Bank Transaction ID / Reference Number, and upload screenshot proof of payment.
5. **Real-Time Group Chat Box (`ChatBox.jsx`)**:
   * Embedded chat widget where pool participants and the organizer communicate and coordinate.

### 3.3 Open Committee Exploration Panel (`/userDash/explore`)
1. **Search & Filter Header**:
   * Filter open pools by keyword (city or pool name), monthly contribution range, or duration.
2. **Committee Cards Directory**:
   * Grid of open committees displaying monthly contribution, total pool value, remaining slots (`X / Y members`), organizer name with **Blue Tick**, and **"View Details & Join"** button.

### 3.4 Location-Based Nearby Discovery (`/userDash/near-me`)
1. **Distance & Location Radius Filter**:
   * Filter pools based on geographic distance (5 KM, 10 KM, 25 KM) or city/district.
2. **Nearby Map & List Interface**:
   * Displays local committees and verified organizers on an interactive map/list.

### 3.5 Join Request & Participant Consent Flow (`/userDash/join`)
1. **Step Progress Bar (`StepProgress`)**:
   * Step 1 (Document Review) -> Step 2 (Participant Agreement).
2. **Security Document Upload Desk**:
   * Upload pool-specific required documents (e.g. salary slip, guarantor CNIC) via `<UploadCapture />`.
3. **Legal Participant Consent Modal (`Modal`)**:
   * Formal agreement checklist: full duration commitment, payment by 5th of every month, and organizer verification consent.

### 3.6 Profile & Verification Center (`/userDash/profile`)
1. **Personal Profile Details Form**:
   * Edit full name, email, phone number, city, district/county, and address.
2. **KYC Document Upload Desk**:
   * Upload scans for **CNIC Front**, **CNIC Back**, and **Utility Bill**.
3. **Real-Time Verification Status Indicator**:
   * Displays status (`Unverified`, `Pending Review`, or `Verified` with Blue Tick).

### 3.7 Member Messages & Inbox (`/userDash/inbox`)
1. **Notification Alerts Feed**:
   * System notifications for payment approvals, draw broadcasts, and organizer pings.
2. **Direct Messages Panel**:
   * Private 1-on-1 messaging with committee organizers.

### 3.8 Public Organizer Profile Viewer (`/userDash/organizer`)
1. **Organizer Credentials Card**:
   * Displays organizer name, Blue Tick verification, active committee count, and trust rating.
2. **Organizer's Pools Directory**:
   * List of current open/ongoing pools and past finished committees managed by this organizer.

---

## 4. Comprehensive Breakdown of All Organizer (Admin) Portal Sections (`/admin/*`)

### 4.1 Organizer Dashboard Home (`/admin`)
1. **Organizer Header & Quick Action Hub**:
   * Welcome header with organizer credentials, **"Create New Pool"**, **"Verify Member Documents"** CTAs, and system status.
2. **Executive Overview Metric Cards (`Stat` Tiles)**:
   * 4 metric tiles: *Active Committees*, *Total Monthly Collections* (PKR), *Total Network Participants*, and *Pending Join Requests*.
3. **Live Operations Manager (`Committiee.jsx`)**:
   * Interactive widget listing active pools, current month status, and quick management links.

### 4.2 5-Step Committee Creation Wizard (`/admin/create`)
1. **Step 1: Basic Information Setup**:
   * Pool Name, Description, Category.
2. **Step 2: Financial Structure & Cycle Rules**:
   * Monthly Installment Amount, Total Members / Duration, Start Date, and auto-computed Total Pool Value.
3. **Step 3: Security Controls & Document Rules**:
   * Toggle additional security document requirements (guarantor CNIC, utility bill).
4. **Step 4: Bank Details & Transfer Routing**:
   * Bank Name, Account Title, IBAN, and payment transfer instructions.
5. **Step 5: Organizer Oath & Final Confirmation**:
   * Optional Organizer Commission Fee (%) and digital oath agreement.

### 4.3 Active Operations & Financial Reconciliation Desk (`/admin/manage`)
1. **Circuit Header & Month Controls**:
   * Committee details, current month indicator (e.g. Month 3 of 10), **"Advance to Next Month"**, and **"Close Committee Pool"** buttons.
2. **Member Payment Reconciliation Table**:
   * List of members for current month, receipt screenshot preview, transaction reference IDs, **"Verify Payment"**, and **"Force Verify (Cash Payment)"** buttons.
3. **Beneficiary Payout Recorder**:
   * Shows current month's winning beneficiary, inputs bank payout transaction ID, and uploads payout receipt proof.
4. **Advance Month Validation Engine**:
   * Prevents advancing to Month N+1 until all non-beneficiary payments are verified.

### 4.4 Committee Registry Archive (`/admin/manage-committie`)
1. **Search & Filter Toolbar**:
   * Filter committees by Pool Name or Database UID.
2. **Committee Data Table (`Table` Primitive)**:
   * Displays Pool Identity, Cycle Status (`Open`/`Ongoing`/`Finished`), Member Fill Count (`X / Y`), Monthly Installment, **"Detailed Manage"**, **"Edit Rules"**, and **"Decommission Pool"** CTAs.
3. **Pagination Controls**:
   * Previous/Next page navigation.

### 4.5 Identity Verification Desk (`/admin/verify-identities`)
1. **Pending Verification Queue**:
   * List of members awaiting KYC document review.
2. **Document Inspector & Modal**:
   * Inspect high-resolution images of CNIC Front, CNIC Back, and Utility Bills side-by-side.
3. **Decision Buttons**:
   * **"Authorize & Grant Blue Tick"** or **"Reject Documents"** (with rejection reason).

### 4.6 Draw System & Result Broadcast (`/admin/announcement`)
1. **Pool Selection Dropdown**:
   * Select filled committee pool ready for drawing.
2. **Trigger Draw Algorithm**:
   * Executes server-side cryptographic randomization algorithm to assign payout turns (1 to N) fairly.
3. **Payout Schedule Broadcast**:
   * Displays schedule table and sends automated email & push notifications to all members.

### 4.7 Member Join Request Manager (`/admin/approvals`)
1. **Pending Join Applications List**:
   * Applications submitted by members wanting to join open committees.
2. **Applicant Security Inspector**:
   * Review member identity status, Blue Tick verification, and uploaded security documents.
3. **Action Controls**:
   * **"Approve & Add to Committee"** or **"Decline Request"**.

### 4.8 Direct Member Assignment Tool (`/admin/assign-member`)
1. **Member & Pool Selector**:
   * Select registered network member and place them directly into an active committee.

### 4.9 Admin-Side Member Onboarding (`/admin/addmember`)
1. **Manual Member Registration Form**:
   * Form to manually create member accounts (Name, Email, Phone, City, Password).
2. **Direct Pool Placement Dropdown**:
   * Places newly created member into a selected pool upon account creation.

### 4.10 Network Member Directory (`/admin/all-members`)
1. **Search & Status Filter**:
   * Search network members by name, phone, or verification status.
2. **Member Cards Grid**:
   * Cards showing member avatar, contact details, Blue Tick status, and active pool memberships.

### 4.11 System Audit Logger (`/admin/logs`)
1. **Audit Log Statistics Header**:
   * Total logged events count and real-time refresh controls.
2. **Action Search Filter (`Input`)**:
   * Filter logs by action type (`CREATE_COMMITTEE`, `VERIFY_PAYMENT`, `RECORD_PAYOUT`, `ADVANCE_MONTH`, `PING_MEMBER`).
3. **Audit Ledger Table (`Table`)**:
   * Data table showing Timestamp, Action, Performed By (Admin name & avatar), and JSON details.

### 4.12 Pool Parameters Editor (`/admin/edit`)
1. **Committee Configuration Form**:
   * Edit pool name, description, bank details, and document rules for open committees.

### 4.13 Subordinate Admin Manager (`/admin/add-admin`)
1. **Co-Organizer Invitation Form**:
   * Invite sub-admins or staff members to manage committee pools.

### 4.14 Organizer Credentials & Profile (`/admin/profile`)
1. **Admin Profile Details**:
   * Manage organizer name, email, phone number, and organization name.
2. **Default Bank Account Credentials**:
   * Default bank name, account title, and IBAN applied to new committee pools.

### 4.15 Organizer Inbox & Notifications (`/admin/inbox` & `/admin/notifications`)
1. **Activity Notifications Feed**:
   * System alerts when members submit join requests, upload payment receipts, or send messages.
2. **1-on-1 Member Support Chat**:
   * Direct messaging interface with pool members.

---

## 5. End-to-End Lifecycle Summary

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

## 6. Verification & Technical Quality Metrics
* **TypeScript Validity**: `0 Errors` (`npx tsc --noEmit`)
* **Next.js Production Build**: `✓ Compiled successfully` across all **77 static and dynamic routes**.
* **Mobile Viewport Compatibility**: Tested across 390x844 mobile viewports with clean responsive layouts.
* **Git Remote Synchronisation**: Up to date on `origin/main`.
