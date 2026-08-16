# New Design Update & Modernization Plan
**Date**: August 16, 2026  
**File Location**: `/2026-08-16/NEW_DESIGN_PLAN.md`

---

## 1. Google Doc Access Notice
> [!IMPORTANT]
> The document link provided (`https://docs.google.com/document/d/1y17YkrxagvrrzUXyTySlp8z7WH6Q2ZAHAbmGVutHax8/edit`) currently redirects to a **Google Accounts Sign-in screen** because access permissions are restricted.
> 
> **To incorporate your exact custom design requirements into this plan**:
> 1. Set the Google Doc permission to **"Anyone with the link can view"**, OR
> 2. Copy and paste the key design guidelines/notes directly into our chat.

---

## 2. Executive Design Vision
The goal of this design update is to transform **CommitteeApp** into a state-of-the-art, visually stunning, and highly intuitive financial platform. We will implement rich modern aesthetics, dynamic micro-interactions, responsive glassmorphism containers, and a cohesive dark/light theme hierarchy.

### Key Aesthetic Principles:
* **Tailored Color Palette**: Rich HSL-tailored indigo/violet gradients (`from-primary-600 to-indigo-700`), slate-950 dark modes, subtle translucent borders (`border-white/10`), and vibrant status indicators.
* **Modern Typography**: Inter/Outfit typography stack with sharp headings, tracking-tighter metrics, and uppercase tracking-widest eyebrow labels.
* **Glassmorphism & Depth**: Multi-layered card elevation using ambient glows (`shadow-[0_28px_70px_-34px_rgba(15,23,42,0.75)]`), backdrop blurring (`backdrop-blur-xl`), and translucent overlays.
* **Micro-Animations**: Smooth scale transitions on button hover (`hover:-translate-y-0.5 active:scale-[0.985]`), tab switching animations, and pulse status badges.

---

## 3. Architecture & Refactoring Roadmap

### Phase 1: Theme System & Token Foundation
* **Target Files**: [`index.css`](file:///d:/ReactProjects/Committie/CommittieApp/app/globals.css) or [`tailwind.config.js`](file:///d:/ReactProjects/Committie/CommittieApp/tailwind.config.js)
* **Actions**:
  * Define global CSS variables for primary HSL colors (`--primary-50` to `--primary-950`).
  * Add custom glassmorphism utility classes (`.glass-panel`, `.metric-tile`, `.dashboard-shell`).
  * Ensure seamless dark mode token resolution across all layout frames.

### Phase 2: Theme Primitives Standardization
* **Target Files**: [`app/Components/Theme/`](file:///d:/ReactProjects/Committie/CommittieApp/app/Components/Theme/)
* **Actions**:
  * Audit [`Button.jsx`](file:///d:/ReactProjects/Committie/CommittieApp/app/Components/Theme/Button.jsx) to support explicit light/dark variant classes without Tailwind utility collisions.
  * Update [`Card.jsx`](file:///d:/ReactProjects/Committie/CommittieApp/app/Components/Theme/Card.jsx), [`Input.jsx`](file:///d:/ReactProjects/Committie/CommittieApp/app/Components/Theme/Input.jsx), [`Table.jsx`](file:///d:/ReactProjects/Committie/CommittieApp/app/Components/Theme/Table.jsx), and [`Modal.jsx`](file:///d:/ReactProjects/Committie/CommittieApp/app/Components/Theme/Modal.jsx) with rounded-3xl corners, focus rings, and animated empty states.
  * Refactor pages currently using raw elements ([`app/adminLogin/page.jsx`](file:///d:/ReactProjects/Committie/CommittieApp/app/adminLogin/page.jsx), [`app/contact/page.jsx`](file:///d:/ReactProjects/Committie/CommittieApp/app/contact/page.jsx), [`app/reset-password/page.jsx`](file:///d:/ReactProjects/Committie/CommittieApp/app/reset-password/page.jsx), [`app/admin/logs/page.jsx`](file:///d:/ReactProjects/Committie/CommittieApp/app/admin/logs/page.jsx)) to use theme primitives.

### Phase 3: Organizer Portal Overhaul (`/admin/*`)
* **Target Files**: [`app/admin/page.jsx`](file:///d:/ReactProjects/Committie/CommittieApp/app/admin/page.jsx), [`app/admin/manage/page.jsx`](file:///d:/ReactProjects/Committie/CommittieApp/app/admin/manage/page.jsx), [`app/admin/create/page.jsx`](file:///d:/ReactProjects/Committie/CommittieApp/app/admin/create/page.jsx)
* **Actions**:
  * Redesign the main admin command center with rich stat cards, progress rings, and quick action bars.
  * Modernize the 5-step committee creation wizard with floating step indicators and real-time summary preview cards.
  * Upgrade the active committee manager with tabbed payment timelines, transaction proof lightboxes, and quick force-verify toggles.

### Phase 4: Member Portal Overhaul (`/userDash/*`)
* **Target Files**: [`app/Components/MainPage.jsx`](file:///d:/ReactProjects/Committie/CommittieApp/app/Components/MainPage.jsx), [`app/userDash/committee/[id]/page.jsx`](file:///d:/ReactProjects/Committie/CommittieApp/app/userDash/committee/[id]/page.jsx), [`app/Components/ChatBox.jsx`](file:///d:/ReactProjects/Committie/CommittieApp/app/Components/ChatBox.jsx)
* **Actions**:
  * Elevate the Member Command Center with profile verification badges and circle momentum counters.
  * Transform the pool detail view with interactive monthly payout turn cards, payment upload dropzones, and real-time chat drawer UI.
  * Polish the discovery map and list view ([`app/userDash/near-me/page.tsx`](file:///d:/ReactProjects/Committie/CommittieApp/app/userDash/near-me/page.tsx)) with clean location tags and distance indicators.

---

## 4. Verification & Testing Strategy
1. **Build & Lint Verification**: Run `npm run build` to confirm zero compilation errors across all pages.
2. **Automated Playwright Visual Audits**: Run headless browser passes across key pages and capture screenshots to verify responsive design and dark/light contrast compliance:
   * `design_admin_dashboard.png`
   * `design_member_dashboard.png`
   * `design_committee_workspace.png`
   * `design_creation_wizard.png`
