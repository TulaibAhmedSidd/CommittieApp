Got it. Below is a **complete, clean, well-structured SUMMARY** of your **CommittieApp**, written in a way you can use for **documentation, pitch, product overview, or platform explanation**.
It covers **logic, trust, flow, safety, monetization readiness**, everything — without missing details.

---

# **CommittieApp – Complete Product Summary**

CommittieApp is a secure, transparent digital platform designed to manage traditional Committees / BCs (Rotating Savings and Credit Associations – ROSCAs) in a modern, trusted, and scalable way. The platform digitizes the entire committee lifecycle while eliminating fraud, confusion, and trust issues commonly found in offline systems.

---

## **User Roles & Governance**

CommittieApp operates with three clearly defined roles:

### **1. Member (User)**

Members are participants who join committees to save money monthly and receive a lump-sum payout during their assigned cycle. Members can register instantly, complete identity verification, explore nearby or relevant committees, request to join committees, submit payment proof, track monthly contributions, see payout schedules, and review organizers. Verified members receive a **Blue Tick**, making them trusted across the platform.

### **2. Organizer (Admin)**

Organizers create and manage committees. They are responsible for onboarding members, verifying payments, managing monthly cycles, distributing payouts, and maintaining transparency. Organizers must undergo strict identity verification and are approved only by the Super Admin. Verified organizers also receive a **Blue Tick**, signaling credibility and accountability.

### **3. Super Admin**

The Super Admin oversees the entire ecosystem. This role approves organizers, verifies users when required, monitors all committees, enforces compliance, audits activity logs, and ensures platform-wide trust and safety.

---

## **Identity Verification & Trust System**

To eliminate fraud and build trust:

* Users and organizers must complete profile verification.
* Required details include country, city, phone number, NIC number, and original NIC image upload.
* Profiles go into a review stage after submission.
* Verified accounts receive a **Blue Tick**, visible across the platform.
* Organizers and members can easily identify trusted participants.

This system ensures that every participant is real, accountable, and traceable.

---

## **Committee (BC) Lifecycle & Financial Logic**

A committee is created with:

* Monthly contribution amount
* Total number of members
* Duration (months)
* Optional or mandatory organizer fee

Each month:

* All members contribute their fixed amount.
* One member receives the full pooled amount.
* Members who already received payout must continue paying until the committee ends.
* The cycle continues until every member has received their payout.

All payments and payouts require **proof uploads**, which must be verified by the organizer.

---

## **Disaster, Death & Failure Handling Mechanism**

To protect all members:

* If a member cannot continue due to disaster, death, or serious uncertainty, the organizer can **pause the committee**.
* All actions are transparently logged and visible to members.
* Funds already collected are recorded clearly.
* Refunds are calculated proportionally and returned based on platform policy.
* Organizers are held responsible for refunds if payouts fail.
* Legal and compliance notices are shown clearly during committee creation and joining.

This ensures no hidden losses and maximum fairness.

---

## **Location-Based Discovery System**

The platform supports smart, local discovery:

* Users can search committees by country, city, name, organizer, or **Near Me**.
* Current location (latitude & longitude) is stored securely using geolocation.
* Admins can view members near them.
* Members can find trusted organizers nearby.
* Exact locations are never publicly exposed—only proximity indicators are shown.

This encourages local trust and faster committee formation.

---

## **Committee Detail & Transparency View**

When a user opens a committee:

* Organizer details (name, reviews, blue tick) are shown.
* Total members and member list are visible.
* Monthly payment status of all members is visible (read-only).
* User can see whether they’ve paid, upload payment proof, and track approvals.
* Complete history of payments, approvals, and payouts is accessible.

This creates full financial clarity.

---

## **Referral & Growth System**

* Organizers can generate referral links.
* Users joining via referral are auto-linked to the referrer.
* Referral analytics track onboarded users and admins.
* Referral rewards can be tied to points, discounts, or premium benefits.

---

## **Security & Compliance**

* Evidence-based payment verification
* Audit trails for every action
* Role-based permissions
* Transparent terms and warnings
* Optional legal escalation policy disclosure

---

## **Technology Stack**

* Frontend: Next.js + Tailwind CSS
* Backend: Next.js API Routes (Node.js)
* Database: MongoDB (Mongoose)
* Authentication: JWT
* Geolocation: MongoDB GeoJSON + Browser Location API
* Real-time: Polling-based messaging

---

## **Core Value Proposition**

CommittieApp transforms traditional committees into a **trusted, verified, transparent digital system**, protecting users, empowering organizers, and creating a scalable financial ecosystem.

**Trust. Transparency. Accountability. Community.**

---