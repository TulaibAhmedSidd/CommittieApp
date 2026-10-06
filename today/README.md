# CommittieApp — Comprehensive QA Walkthrough & Documentation Suite

**Date of Execution**: September 9, 2026  
**Auditor / Agent**: Antigravity Senior QA & Product Specialist  
**Live Application**: [https://committie-app.vercel.app](https://committie-app.vercel.app)  
**Primary Reference**: `/guide/member` & `/guide/organizer`  
**Visual Deliverables**: 33 verified high-resolution screenshot captures in `public/screenshot/`  

---

## 1. Executive Summary

CommittieApp is a production-grade digital platform digitizing traditional Pakistani rotating savings and credit associations (ROSCAs / "Kameti" / "BC" - کمیٹی). It provides structured operational tooling for Organizers (منتظمین), Participants / Members (اراکین), and Super Administrators (نگرانِ اعلیٰ).

This documentation suite represents an end-to-end, empirical browser walkthrough covering every user journey, UI component, backend API endpoint, data model, security boundary, and lifecycle state.

---

## 2. Table of Contents & Document Index

| Chapter | Document | Scope & Key Highlights |
| :--- | :--- | :--- |
| **00** | [screenshots.md](./screenshots.md) | Complete visual atlas of 33 screenshots categorized by role & flow |
| **01** | [01-public-website.md](./01-public-website.md) | Landing page, Hero video, Member & Organizer Guides, Legal pages (Terms, Privacy, Contact) |
| **02** | [02-auth-and-onboarding.md](./02-auth-and-onboarding.md) | Registration, Login, Forgot Password, JWT session handling, validation |
| **03** | [03-member-verification.md](./03-member-verification.md) | KYC verification pipeline, CNIC front/back, utility bill upload, Blue Tick tiering |
| **04** | [04-member-dashboard.md](./04-member-dashboard.md) | Member portal (`/userDash`), live circuits, installment due alerts, bilingual controls |
| **05** | [05-explore-and-search.md](./05-explore-and-search.md) | Marketplace discovery (`/userDash/explore`), filtering, risk posture, committee cards |
| **06** | [06-committee-details-and-joining.md](./06-committee-details-and-joining.md) | Committee room (`/userDash/committee/[id]`), join requests, trust metrics, organizer ratings |
| **07** | [07-organizer-request-and-approval.md](./07-organizer-request-and-approval.md) | Organizer onboarding, Super Admin approval queue, gatekeeper governance |
| **08** | [08-organizer-dashboard.md](./08-organizer-dashboard.md) | Organizer console (`/admin`), active pools, pooled capital metrics, quick actions |
| **09** | [09-create-committee-wizard.md](./09-create-committee-wizard.md) | 4-step wizard (`/admin/create`), parameters, financial schema, bank coordinates, ethical declaration |
| **10** | [10-committee-management.md](./10-committee-management.md) | Committee operations (`/admin/manage?id=...`), member roster, turn tracking, cycle advancement |
| **11** | [11-monthly-payment-workflow.md](./11-monthly-payment-workflow.md) | Payment submission modal, receipt upload, organizer review & authentication |
| **12** | [12-payout-workflow.md](./12-payout-workflow.md) | Drawing execution, beneficiary bank coordinates, disbursement modal, payout ledger |
| **13** | [13-messaging-and-inbox.md](./13-messaging-and-inbox.md) | Real-time chat (`/userDash/inbox`, `/admin/inbox`), member-organizer direct messaging |
| **14** | [14-profile-and-settings.md](./14-profile-and-settings.md) | Profile management, bank payout account coordinates (IBAN), language toggle |
| **15** | [15-near-me-and-discovery.md](./15-near-me-and-discovery.md) | Geo-spatial 2dsphere proximity search (`/userDash/near-me`), radius filtering |
| **16** | [16-super-admin-capabilities.md](./16-super-admin-capabilities.md) | Super admin console, approvals, audit logs ledger, system controls |
| **17** | [17-database-and-api-architecture.md](./17-database-and-api-architecture.md) | MongoDB schema designs (`Admin`, `Member`, `Committee`, `Log`), Next.js App Router routes |
| **18** | [18-security-and-trust-features.md](./18-security-and-trust-features.md) | Anti-fraud framework, PPC 420/406 legal enforcement, audit trail, bcrypt & JWT security |
| **19** | [19-complete-lifecycle-walkthrough.md](./19-complete-lifecycle-walkthrough.md) | Chronological end-to-end simulation from creation to month advancement to completion |
| **20** | [20-random-user-exploration.md](./20-random-user-exploration.md) | Chaos and edge-case exploration, unexpected clicks, invalid states, resilient behaviors |
| **21** | [21-bug-findings.md](./21-bug-findings.md) | Comprehensive bug registry with severity, root causes, reproduction steps, and fixes |
| **22** | [22-ux-findings.md](./22-ux-findings.md) | Usability analysis, terminology mapping (English to Roman Urdu), contrast, mobile viewport |
| **23** | [23-route-inventory.md](./23-route-inventory.md) | Complete index of all 42 frontend routes and 35 API routes with permissions matrix |

---

## 3. Test Credentials & Environments

| Role | Email | Password | Status | Authorization Claims |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | `superadmin_qa@example.com` / `Tulaib@gmail.com` | (ask the owner) | Approved | `isAdmin: true`, `isSuperAdmin: true` |
| **Organizer** | `organizer_qa@example.com` | (ask the owner) | Approved | `isAdmin: true`, `isSuperAdmin: false` |
| **Member** | `member_qa@example.com` | (ask the owner) | Approved | `verificationStatus: "verified"` |
