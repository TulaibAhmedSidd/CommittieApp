# Visual Asset Index & Screenshot Catalog

This catalog documents all 33 full-page screenshots captured during the live browser walkthrough of CommittieApp. All files are permanently organized in `public/screenshot/`.

---

## 1. Public & Marketing Surface

### Homepage
- **File**: `public/screenshot/home/homepage.png`
- **Path**: `/`
- **Description**: Full landing experience featuring brand logo, commercial video in the hero section, core feature breakdown, live stats banner, and FAQ accordion.
![Homepage](/screenshot/home/homepage.png)

### Navigation Bar
- **File**: `public/screenshot/home/navbar.png`
- **Path**: Global Top Header
- **Description**: Emerald & Gold styled navigation bar with bilingual switcher, brand identity, and role-based portal CTAs.
![Navbar](/screenshot/home/navbar.png)

### Footer
- **File**: `public/screenshot/home/footer.png`
- **Path**: Global Bottom Footer
- **Description**: High-contrast footer with updated links to Member Guide, Organizer Guide, Terms of Service, and Privacy Policy.
![Footer](/screenshot/home/footer.png)

### Member Interactive Guide
- **File**: `public/screenshot/home/guide-member.png`
- **Path**: `/guide/member`
- **Description**: 7-stage interactive operational guide for participants explaining registration, verification, committee discovery, and monthly payments.
![Member Guide](/screenshot/home/guide-member.png)

### Organizer Interactive Guide
- **File**: `public/screenshot/home/guide-organizer.png`
- **Path**: `/guide/organizer`
- **Description**: Operational manual for committee administrators explaining pool governance, payout disbursements, and ethical duties.
![Organizer Guide](/screenshot/home/guide-organizer.png)

---

## 2. Authentication & Onboarding

### Member Login
- **File**: `public/screenshot/auth/login.png`
- **Path**: `/login`
- **Description**: Member portal sign-in card with branded logo, remember-me options, and password recovery link.
![Login](/screenshot/auth/login.png)

### Member Registration
- **File**: `public/screenshot/auth/register.png`
- **Path**: `/register`
- **Description**: Onboarding screen with form input fields (Name, Email, Phone, Password) and terms agreement.
![Register](/screenshot/auth/register.png)

### Password Recovery
- **File**: `public/screenshot/auth/forgot-password.png`
- **Path**: `/reset-password`
- **Description**: Secure credential reset request flow.
![Forgot Password](/screenshot/auth/forgot-password.png)

---

## 3. Legal & Trust Architecture

### Terms of Service & Anti-Fraud (PPC 420/406)
- **File**: `public/screenshot/legal/terms.png`
- **Path**: `/terms`
- **Description**: Standardized platform terms including Section 7 criminal breach of trust clauses and legal recourse for defaults.
![Terms](/screenshot/legal/terms.png)

### Privacy Policy
- **File**: `public/screenshot/legal/privacy.png`
- **Path**: `/privacy`
- **Description**: Light-toned document detailing encryption, KYC retention, and CNIC data minimization policies.
![Privacy](/screenshot/legal/privacy.png)

### Contact & Support
- **File**: `public/screenshot/legal/contact.png`
- **Path**: `/contact`
- **Description**: Support touchpoint for organizers and members.
![Contact](/screenshot/legal/contact.png)

---

## 4. Super Admin Console

### Super Admin Dashboard
- **File**: `public/screenshot/super-admin/dashboard.png`
- **Path**: `/admin` (authenticated as Super Admin)
- **Description**: Command console showing full ecosystem stats across all organizers and committees, with elevated administrative sidebars.
![Super Admin Dashboard](/screenshot/super-admin/dashboard.png)

### Pending Organizers Queue
- **File**: `public/screenshot/super-admin/pending-organizers.png`
- **Path**: `/admin/approvals`
- **Description**: Governance gatekeeper interface showing newly registered organizers awaiting platform accreditation.
![Pending Organizers](/screenshot/super-admin/pending-organizers.png)

### Organizer Authorization
- **File**: `public/screenshot/super-admin/organizer-approved.png`
- **Path**: `/admin/approvals` (post-action)
- **Description**: State update confirming successful authorization and dispatch of organizer credentials.
![Organizer Approved](/screenshot/super-admin/organizer-approved.png)

### System Forensic Audit Ledger
- **File**: `public/screenshot/super-admin/audit-logs.png`
- **Path**: `/admin/logs`
- **Description**: Immutable security log tracking IP addresses, actor identities, entity targets, and state mutations.
![Audit Logs](/screenshot/super-admin/audit-logs.png)

---

## 5. Organizer Operations Console

### Organizer Dashboard
- **File**: `public/screenshot/organizer/dashboard.png`
- **Path**: `/admin` (authenticated as Standard Organizer)
- **Description**: Local organizer dashboard displaying pooled value, active committees, and quick action shortcuts.
![Organizer Dashboard](/screenshot/super-admin/dashboard.png)

### Committee Creation Wizard
- **File**: `public/screenshot/organizer/create-committee.png`
- **Path**: `/admin/create`
- **Description**: 4-phase configuration wizard specifying financial rules, monthly amounts, member limits, and banking coordinates.
![Create Committee](/screenshot/organizer/create-committee.png)

### Committee Member Roster & Operations
- **File**: `public/screenshot/organizer/manage-members.png`
- **Path**: `/admin/manage?id=...`
- **Description**: Live operations dashboard showing member list, payment status, cycle controls, and drawing beneficiary.
![Manage Members](/screenshot/organizer/manage-members.png)

### Payment Verification Modal
- **File**: `public/screenshot/organizer/payment-approvals.png`
- **Path**: `/admin/manage?id=...` (Proof Review Modal)
- **Description**: Transaction verification modal displaying member's bank transfer receipt, transaction ID, and authentication triggers.
![Payment Approvals](/screenshot/organizer/payment-approvals.png)

### Payout Disbursement Execution
- **File**: `public/screenshot/organizer/payout-execution.png`
- **Path**: `/admin/manage?id=...` (Disbursement Modal)
- **Description**: Modal facilitating payout recording with transaction protocol reference and proof screenshot upload.
![Payout Execution](/screenshot/organizer/payout-execution.png)

---

## 6. Member Portal & Experience

### Member Main Dashboard
- **File**: `public/screenshot/member/dashboard.png`
- **Path**: `/userDash`
- **Description**: Participant control center showing active ongoing committees, payment due alerts, and quick actions.
![Member Dashboard](/screenshot/member/dashboard.png)

### Committee Marketplace Discovery
- **File**: `public/screenshot/member/explore.png`
- **Path**: `/userDash/explore`
- **Description**: Public and network committee catalogue showing pool sizes, installment schedules, and remaining seats.
![Explore](/screenshot/member/explore.png)

### Proximity Discovery (Near Me)
- **File**: `public/screenshot/member/near-me.png`
- **Path**: `/userDash/near-me`
- **Description**: Geo-spatial discovery interface showing nearby committees based on coordinates and radius.
![Near Me](/screenshot/member/near-me.png)

### Identity Verification & KYC
- **File**: `public/screenshot/member/verification.png`
- **Path**: `/userDash/profile`
- **Description**: KYC submission interface for CNIC Front, CNIC Back, and Utility Bill verification.
![Verification](/screenshot/member/verification.png)

### Committee Room & Active Board
- **File**: `public/screenshot/member/committee-details.png`
- **Path**: `/userDash/committee/[id]`
- **Description**: Committee details room with installment breakdown, active payment board, organizer reputation card, and vault status.
![Committee Details](/screenshot/member/committee-details.png)

### Payment Proof Upload Modal
- **File**: `public/screenshot/member/payment-proof-upload.png`
- **Path**: `/userDash/committee/[id]` (Sync Installment Modal)
- **Description**: Modal allowing member to enter transaction ID and upload bank transfer slip.
![Payment Proof Upload](/screenshot/member/payment-proof-upload.png)

### Payout Beneficiary Announcement
- **File**: `public/screenshot/member/payout-announcement.png`
- **Path**: `/userDash/committee/[id]`
- **Description**: Live status card announcing the beneficiary node for the active month and payout coordinates.
![Payout Announcement](/screenshot/member/payout-announcement.png)

### Member Inbox & Communication
- **File**: `public/screenshot/member/inbox.png`
- **Path**: `/userDash/inbox`
- **Description**: Direct messaging interface facilitating transparent dialogue between participants and organizers.
![Member Inbox](/screenshot/member/inbox.png)

---

## 7. Complete Committee Lifecycle Stages

### Phase 1: Committee Created
- **File**: `public/screenshot/lifecycle/committee-created.png`
- **Path**: `/admin/manage-committie`
- **Description**: Newly established pool appearing in organizer's active roster with status 'open'.
![Committee Created](/screenshot/lifecycle/committee-created.png)

### Phase 2: Member Joined & Approved
- **File**: `public/screenshot/lifecycle/member-joined.png`
- **Path**: `/admin/manage?id=...`
- **Description**: Member integrated into the committee circuit, seated in the payment roster.
![Member Joined](/screenshot/lifecycle/member-joined.png)

### Phase 3: Month 1 In-Progress
- **File**: `public/screenshot/lifecycle/month-01.png`
- **Path**: `/admin/manage?id=...`
- **Description**: Operational Month 1 cycle showing payment collection, verification, and first drawing beneficiary.
![Month 1](/screenshot/lifecycle/month-01.png)

### Phase 4: Month 2 Advanced
- **File**: `public/screenshot/lifecycle/month-02.png`
- **Path**: `/admin/manage?id=...`
- **Description**: Committee cycle advanced to Month 2; dues reset for next iteration.
![Month 2](/screenshot/lifecycle/month-02.png)

### Phase 5: Committee Completed (Closed BC)
- **File**: `public/screenshot/lifecycle/committee-completed.png`
- **Path**: `/admin/manage?id=...`
- **Description**: Finalized committee state ('finished'); full audit reconciliation preserved and write operations locked.
![Committee Completed](/screenshot/lifecycle/committee-completed.png)
