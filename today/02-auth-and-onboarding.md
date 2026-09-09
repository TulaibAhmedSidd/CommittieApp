# 02 — Authentication & Onboarding Architecture

**Associated Routes**:
- `/login` (Member Login)
- `/register` (Member Registration)
- `/reset-password` (Password Reset)
- `/admin/login` (Organizer & Super Admin Login)
- `/adminLogin` (Legacy redirect to `/admin/login`)

**Associated Screenshots**:
- `public/screenshot/auth/login.png`
- `public/screenshot/auth/register.png`
- `public/screenshot/auth/forgot-password.png`

---

## 1. Architecture Overview

CommittieApp maintains a dual-portal authentication architecture separating general participants (Members) from administrative stakeholders (Organizers and Super Admins).

```mermaid
flowchart TD
    User([User Arrival]) --> RoleCheck{Intended Role?}
    RoleCheck -->|Participant / Member| MemberAuth[Member Portal]
    RoleCheck -->|Organizer / Admin| AdminAuth[Organizer Portal]

    MemberAuth --> LoginM[/login]
    MemberAuth --> RegM[/register]
    RegM --> AutoApprove[Status: Approved<br/>Verification: Unverified]
    AutoApprove --> MemberDash[/userDash]

    AdminAuth --> LoginA[/admin/login]
    AdminAuth --> RegA[Organizer Request]
    RegA --> PendingState[Status: Pending]
    PendingState --> SuperAdminReview{Super Admin Review}
    SuperAdminReview -->|Approved| AdminDash[/admin]
    SuperAdminReview -->|Rejected| Denied[Access Denied]
```

---

## 2. Member Registration Flow (`/register`)

![Register](/screenshot/auth/register.png)

### State Management & Form Handling
- The registration page collects:
  - Full Name (`name`)
  - Email Address (`email`)
  - Mobile Number (`phone`)
  - Password (`password`)
  - Terms Consent Checkbox
- **Recent Fix Verified**: Form state references were aligned from `formData` to `form`, resolving an earlier runtime crash on button interaction.
- **Password Security**: Passwords are sent via HTTPS to `POST /api/register` and hashed using `bcryptjs` with a salt factor of 10 before database insertion.
- **Initial Verification Tier**: New members are registered with `verificationStatus: "unverified"` and empty `payoutDetails`.

---

## 3. Member Login Flow (`/login`)

![Login](/screenshot/auth/login.png)

### Session Mechanics
- **Endpoint**: `POST /api/login`
- **Payload**: `{ email, password }`
- **Response**: `{ token, member: { _id, name, email, verificationStatus, ... } }`
- **Storage**:
  - JWT token saved to `localStorage.getItem("token")`
  - Sanitized member object saved to `localStorage.getItem("member")`
- **Redirect**: Upon 200 OK, router pushes immediately to `/userDash`.

---

## 4. Organizer & Super Admin Login Flow (`/admin/login`)

- **Endpoint**: `POST /api/admin/login`
- **Access Guard**:
  ```javascript
  if (admin.status === "pending") {
    return new Response(
      JSON.stringify({ message: "Registration pending Super Admin approval." }),
      { status: 403 }
    );
  }
  ```
- **Token Claims**: JWT payload encodes:
  - `userId`: Admin Mongo ID
  - `email`: Admin Email
  - `isAdmin`: Boolean (`true`)
  - `isSuperAdmin`: Boolean (`true` for elevated governance accounts)
- **Client Storage**:
  - JWT saved to `localStorage.admin_token`
  - Profile saved to `localStorage.admin_detail`
- **Redirect**: Pushes to `/admin`.

---

## 5. Password Reset Flow (`/reset-password`)

![Forgot Password](/screenshot/auth/forgot-password.png)

- Allows users to enter their registered email address.
- Generates a crypto reset token stored with a 1-hour expiration timestamp.
- Dispatches a secure recovery link to the user's email.
