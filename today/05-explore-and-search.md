# 05 — Committee Marketplace & Discovery

**Associated Route**: `/userDash/explore`  
**Target Role**: Member / Participant  
**Associated Screenshot**: `public/screenshot/member/explore.png`  

---

## 1. Overview

The Committee Discovery Marketplace provides a searchable, transparent registry of open savings circles created by verified organizers across the platform.

![Explore](/screenshot/member/explore.png)

---

## 2. Discovery Features & Visual Layout

### Market Posture Banner
- Highlights verified trust standards: *"Browse open committees with clearer financial context, stronger trust cues, and faster access to the flows that matter."*
- Metric pills displaying total open pools and proof-first risk posture.

### Committee Card Parameters
Each committee card displays:
1. **Title & Purpose**: e.g., `TABLE TENNIS TECHNYX`, `QA ALPHA CIRCLE`.
2. **Cycle Structure**: Total duration (e.g. 5 Months, 12 Months) and installment frequency.
3. **Monthly Amount**: PKR contribution per month.
4. **Capacity & Seat Occupancy**: Real-time counter (e.g. `1 / 12 FILLED · 11 SEATS LEFT`).
5. **Action Button**:
   - `REQUEST TO JOIN` — Dispatches membership application to organizer queue.
   - `ALREADY JOINED` — If member is already an enrolled participant.
   - `REQUEST PENDING` — If application has been dispatched and awaits organizer review.

---

## 3. Joining Logic & API Request

- **Trigger**: Clicking `REQUEST TO JOIN`.
- **API Call**: `POST /api/committee/[id]/request`
- **Payload**: `{ memberId, committeeId }`
- **Result**: Adds member Mongo ID to `committee.pendingMembers` array and dispatches notification to the organizer.
