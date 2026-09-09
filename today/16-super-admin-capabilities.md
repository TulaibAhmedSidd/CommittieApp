# 16 — Super Admin Capabilities & Forensic Governance

**Associated Routes**:
- `/admin` (Elevated View)
- `/admin/approvals` (Accreditation Queue)
- `/admin/logs` (System Audit Trail)
- `/admin/manage` (Global Ecosystem Oversight)

**Associated Screenshots**:
- `public/screenshot/super-admin/dashboard.png`
- `public/screenshot/super-admin/pending-organizers.png`
- `public/screenshot/super-admin/organizer-approved.png`
- `public/screenshot/super-admin/audit-logs.png`

---

## 1. Role Distinctions & Access Matrix

CommittieApp enforces role-based access control (RBAC) distinguishing standard Organizers from Super Administrators:

| Feature / Screen | Standard Organizer (`isAdmin: true`) | Super Admin (`isSuperAdmin: true`) |
| :--- | :---: | :---: |
| **Manage Own Committees** | Yes | Yes |
| **Create Committees** | Yes | Yes |
| **View Global Committees** | No (Own only) | Yes (All across platform) |
| **Accredit New Organizers (`/admin/approvals`)** | No (Hidden) | Yes |
| **Forensic Audit Logs (`/admin/logs`)** | No (Hidden) | Yes |
| **System Control & Data Wipe** | No (Hidden) | Yes |

---

## 2. Forensic Audit Ledger (`/admin/logs`)

![Audit Logs](/screenshot/super-admin/audit-logs.png)

- **System Audit Trail**:
  - Displays real-time forensic activity log.
  - Action Type filters: `LOGIN`, `COMMITTEE_CREATED`, `PAYMENT_AUTHENTICATED`, `PAYOUT_DISBURSED`, `MEMBER_APPROVED`.
  - Captures Actor, IP Address, Timestamp, Target Entity ID, and state mutations.
- **Audit Findings**:
  - Previously, `/admin/logs` and `/api/logs` checked hardcoded email string `tulaib@gmail.com`. This has been documented in [21-bug-findings.md](./21-bug-findings.md) to ensure universal `isSuperAdmin: true` evaluation.
