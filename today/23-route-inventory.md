# 23 — Complete Route & Endpoint Inventory

---

## 1. Frontend Page Inventory (42 Routes)

### Public & Marketing
- `/` — Landing Page, Hero Video, Live Metrics, FAQ.
- `/terms` — Terms of Service, Anti-Fraud & Legal Protection (PPC 420/406).
- `/privacy` — Privacy Policy & Data Minimization.
- `/contact` — Support & Dispute Resolution.
- `/guide/member` — Interactive Member Operational Guide.
- `/guide/organizer` — Comprehensive Organizer Manual.
- `/theme-guide` — Internal Design System Showcase (Admin only).

### Authentication
- `/login` — Member Sign In.
- `/register` — Member Sign Up.
- `/reset-password` — Password Recovery.
- `/admin/login` — Organizer & Super Admin Sign In.
- `/adminLogin` — Legacy compatibility redirect.

### Member Portal (`/userDash`)
- `/userDash` — Main Participant Dashboard.
- `/userDash/explore` — Committee Discovery Marketplace.
- `/userDash/near-me` — Proximity Search & Geo-Radius Filter.
- `/userDash/committee/[id]` — Committee Details Room & Active Board.
- `/userDash/profile` — KYC Verification & Payout Bank Details.
- `/userDash/inbox` — Member Direct Messaging Hub.

### Organizer & Super Admin Console (`/admin`)
- `/admin` — Organizer / Super Admin Main Console.
- `/admin/create` — 4-Step Committee Creation Wizard.
- `/admin/manage?id=...` — Committee Roster, Month Advancement, Payout Execution.
- `/admin/manage-committie` — Committee Portfolio List.
- `/admin/assign-member` — Bulk Member Assignment.
- `/admin/approvals` — Super Admin Organizer Accreditation Queue.
- `/admin/logs` — Forensic System Audit Ledger.
- `/admin/verify` — KYC Identity Review Console.
- `/admin/inbox` — Organizer Messaging Hub.
- `/admin/profile` — Organizer Profile & Coordinates.

---

## 2. API Endpoint Matrix (35 Endpoints)

| Endpoint | Method | Role Required | Purpose |
| :--- | :---: | :---: | :--- |
| `/api/login` | POST | Public | Authenticate member; returns JWT |
| `/api/register` | POST | Public | Register new member account |
| `/api/admin/login` | POST | Public | Authenticate organizer/admin |
| `/api/committee` | GET / POST | Admin | List or create committee |
| `/api/committee/[id]/details` | GET | Member/Admin | Committee room detailed dimensions |
| `/api/committee/[id]/request` | POST | Member | Submit join request to committee |
| `/api/committee/[id]/payment` | POST | Member | Upload payment proof screenshot |
| `/api/committee/[id]/status` | POST | Admin | Advance cycle month or close committee |
| `/api/committee/[id]/payout` | POST | Admin | Disburse payout to month beneficiary |
| `/api/payment/status` | POST | Admin | Authenticate or reject member payment |
| `/api/logs` | GET | Super Admin | Query forensic audit logs |
| `/api/discovery` | GET | Member | Geo-spatial proximity query |
| `/api/settings` | GET / POST | Public | Theme and platform settings |
