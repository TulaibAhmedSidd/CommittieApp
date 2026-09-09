# 13 — Messaging, Communications & Inbox

**Associated Routes**:
- `/userDash/inbox` (Member Inbox)
- `/admin/inbox` (Organizer Inbox)
- Floating Chat Drawer (Embedded on committee & dashboard pages)

**Associated Screenshot**: `public/screenshot/member/inbox.png`

---

## 1. Overview & Architecture

Communication between members and organizers is critical to prevent misunderstandings regarding transfer delays, bank maintenance windows, and drawing dates.

![Member Inbox](/screenshot/member/inbox.png)

### Core Features:
- **Direct 1-on-1 Chat**: Between any active member and their committee organizer.
- **Committee Broadcasts**: Global notices sent by organizers to all enrolled participants.
- **Urgent Pings**: One-click reminders triggered from the organizer roster table notifying members of pending dues.

---

## 2. Real-Time Chat Engine (`<ChatBox />`)

- **Component**: `app/Components/ChatBox.jsx`
- **Database Model**: Stored in MongoDB `messages` collection with `sender`, `receiver`, `content`, `timestamp`, and `read` flag.
- **UI Integration**:
  - Embedded as a responsive modal or slide-over drawer.
  - Supports quick replies for common Pakistani banking scenarios (*"Proof uploaded"*, *"Transfer done via Raast"*, *"Waiting for bank SMS"*).
