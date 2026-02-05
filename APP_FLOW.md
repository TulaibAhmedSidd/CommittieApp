# CommittieApp - Application Flow & Architecture

CommittieApp is a digital platform for managing "Committies" (Rotating Savings and Credit Associations - ROSCAs). It supports two primary user roles: Members and Organizers, with a Super Admin managing the ecosystem.

## 1. User Roles & Access Control

### Member (User)
- **Role**: Participant in committees.
- **Entry**: Self-registration -> Immediate Approval -> Access Dashboard.
- **Capabilities**: 
    - Browse/Explore available committees.
    - Send "Request to Join" to committees.
    - Submit payment evidence (screenshot/receipt).
    - Track payout months and expected amounts.
    - Chat with committee organizers.

### Organizer (Admin)
- **Role**: Creator and manager of committees.
- **Entry**: Self-registration -> Pending Approval -> Super Admin Approval -> Access Admin Panel.
- **Capabilities**:
    - Create/Edit/Delete committees.
    - Set Organizer Fees (Mandatory/Optional).
    - Manage Member applications (Approve/Reject requests to join committee).
    - Verify Member payments.
    - Advance cycles (Month-by-month logic).
    - Payout management (Evidence upload).
    - Broadcast announcements to all committee members.

### Super Admin (e.g., Tulaib)
- **Role**: Global system administrator.
- **Entry**: Set manually in DB (`isSuperAdmin: true`).
- **Capabilities**:
    - **Approve/Reject** all new Member and Organizer signups.
    - **Global Visibility**: View and manage all committees regardless of who created them.
    - **System Audits**: Access logs and platform-wide metrics.

---

## 2. Core Functional Flows

### Registration & Approval
1. **Self-Reg (Member)**: User selects "Start Saving". Account is **Auto-Approved**. They can log in immediately.
2. **Self-Reg (Organizer)**: User selects "Become an Organizer". Account is **Pending**.
3. **Association**: Members can be associated with multiple Organizers. When a member joins a committee, they are automatically "Associated" with that committee's Organizer.
4. **Super Admin Action**: Super Admin reviews pending Organizers in the **Approvals** tab.
5. **Activation**: Super Admin clicks "Approve". Top-level organizers can now log in and create committees.

### Referral System
- **Invite Codes**: Organizers can generate unique referral codes.
- **Analytics**: Organizers can track their network performance via the Referral Center, viewing counts of both Members and other Admins onboarded via their link.
- **Auto-Linking**: New users signing up via a referral link are automatically linked to the referring Organizer.

### Committee Lifecycle
1. **Creation**: Organizer creates a committee with parameters (Monthly Amount, Duration, Max Members, Fees).
2. **Recruitment**: Members "Explore" and "Request to Join". Organizer approves them until the pool is full.
3. **Start**: Once full or ready, the cycle begins.
4. **Monthly Cycle**:
   - Members submit payment for the current month.
   - Organizer verifies all payments.
   - **Strict Enforcement**: Organizer cannot advance the month until 100% of non-beneficiary members have paid.
   - Organizer records Payout for the beneficiary of the month.
   - Cycle advances to the next month.
5. **Closure**: Once all members have received their payout, the committee is marked as "Closed".

### Financial Logic
- **Base Installment**: The core saving amount.
- **Organizer Fee**: An optional or mandatory fee added to each installment.
- **Transparency**: Total Due = Base + Fee. Visible to both members and organizers.

---

## 3. Technical Architecture

- **Frontend**: Next.js (React), Tailwind CSS.
- **Backend**: Next.js API Routes (Node.js).
- **Database**: MongoDB (Mongoose).
- **Real-time**: Polling-based Chat System.
- **Auth**: JWT-based authentication for both Admins and Members.

## 4. Security & Trust
- **Evidence-Based**: All payments and payouts require receipt/screenshot uploads.
- **Verification**: Only organizers (or super admins) can verify transactions.
- **Audit Trails**: Actions are logged for transparency.
