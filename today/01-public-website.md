# 01 — Public Website & Marketing Surface

**Audited URL**: [https://committie-app.vercel.app](https://committie-app.vercel.app)  
**Target Roles**: Anonymous Visitor, Prospective Member, Prospective Organizer  
**Associated Screenshots**:
- `public/screenshot/home/homepage.png`
- `public/screenshot/home/navbar.png`
- `public/screenshot/home/footer.png`
- `public/screenshot/home/guide-member.png`
- `public/screenshot/home/guide-organizer.png`
- `public/screenshot/legal/terms.png`
- `public/screenshot/legal/privacy.png`
- `public/screenshot/legal/contact.png`

---

## 1. Overview & First Impressions

The public-facing surface of CommittieApp serves as the primary trust builder for prospective participants and organizers. Rooted in Pakistani financial culture, rotating savings committees (Kameti / BC) traditionally rely on informal relationships. The website translates this tradition into a high-integrity, structured, transparent software ecosystem.

### Visual Architecture & Palette
- **Primary Accent**: Canonical Emerald Green (`#047857` / `#10b981`) symbolizing prosperity and security.
- **Secondary Accent**: Antique Gold (`#C9A227`) highlighting financial capital and trust credentials.
- **Tone**: Clean light mode with high-contrast slate typography (`#0f172a`), crisp borders, and subtle glassmorphic backdrop filters. The previous dark tone on legal pages and the "purple flash" theme bug have been completely eliminated.

---

## 2. Header Navigation Bar

The global header provides immediate orientation, brand identity, and language selection.

![Navbar](/screenshot/home/navbar.png)

### Key Header Elements:
1. **Brand Identity**: Displays the official SVG/Vector `<Logo size="md" />` featuring the dual intertwined emerald and gold rings with geometric circle accents.
2. **Navigation Links**:
   - **How it Works**: Anchor link smoothly scrolling down to the operational breakdown.
   - **Features**: Deep links to security, drawing automation, and transparent payment tracking.
   - **Member Guide**: Direct link to `/guide/member`, an interactive guide for users.
   - **Organizer Guide**: Direct link to `/guide/organizer`, a comprehensive manual for committee organizers.
3. **Bilingual Switcher**: Toggle button allowing switching between English and Urdu (اردو), dynamically persisting selection across sessions.
4. **Action CTAs**:
   - **Sign In / لاگ ان**: Directs to `/login`.
   - **Start a Committee / کمیٹی بنائیں**: High-visibility emerald button directing to `/admin/login` (Organizer Portal).

---

## 3. Hero Section & Video Commercial

The landing page features a hero layout positioning video storytelling as the primary first impression:

![Homepage](/screenshot/home/homepage.png)

### Core Components:
- **Headline**: High-contrast typography communicating automated transparency: *"Digital Kameti with Bank-Grade Transparency"*.
- **Subheadline**: Plain Roman Urdu & English summary: *"Apni committee ko digital banayein — zero confusion, automated draws, aur verified payment proofs ke sath."*
- **Primary CTA**: Emerald "Get Started" button routing to `/register` with state guards preventing unhandled exceptions.
- **Embedded Video Showcase**: Centralized responsive video frame delivering a 60-second animated explainer illustrating traditional BC issues (lost paper slips, default disputes) versus CommittieApp's verified ledger.

---

## 4. Operational Feature Highlights & Live Metrics

The homepage showcases the core pillars of the platform:
1. **Digital Ledger**: Immutable record of monthly collections, eliminating paper-slip fraud.
2. **Automated Drawing Engine**: Fair, cryptographic lottery or organizer-stipulated turn scheduling.
3. **Multi-Channel Verification**: Proof of transfer screenshots matched with unique transaction IDs.
4. **Anti-Fraud & Legal Protection**: Explicit integration of Pakistan Penal Code Section 420 (Cheating) and 406 (Criminal Breach of Trust).

---

## 5. Frequently Asked Questions (FAQ)

The FAQ section addresses real-world member concerns:
- **Q: What happens if a member defaults after receiving their payout (BC uthake bhaag jaye)?**
  - **A**: The platform requires upfront CNIC verification and utility bill proof. Any post-payout default constitutes Criminal Breach of Trust under PPC Section 406/420. The organizer is equipped with authenticated records to file an immediate police FIR and initiate CNIC blacklisting.
- **Q: Does CommittieApp hold the money?**
  - **A**: No. CommittieApp acts as a transparent software accounting ledger. Funds transfer directly from member bank accounts to the organizer's verified bank coordinates.

---

## 6. Interactive User Guides

### Member Guide (`/guide/member`)
An interactive, 7-step guide walking participants through:
1. Account Creation & Verification
2. Exploring & Joining Open Committees
3. Monthly Installment Upload
4. Turn & Payout Announcement
5. Messaging & Conflict Resolution
![Member Guide](/screenshot/home/guide-member.png)

### Organizer Guide (`/guide/organizer`)
A 6-phase operational manual for committee leaders:
1. Obtaining Super Admin Accreditation
2. Configuring Committee Rules (Amount, Members, Duration)
3. Reviewing Member Join Requests
4. Authenticating Payment Receipts
5. Disbursing Monthly Payouts
6. Advance Month & Final Close
![Organizer Guide](/screenshot/home/guide-organizer.png)

---

## 7. Legal & Compliance Pages

### Terms of Service (`/terms`)
![Terms of Service](/screenshot/legal/terms.png)
- Full light-tone layout matching brand aesthetics.
- **Section 7: Default, Fraud Prevention & Legal Action**:
  - Unambiguous legal recourse under Pakistan Penal Code (PPC Sections 406 & 420).
  - Explicit warning that default history is logged permanently against member CNICs.

### Privacy Policy (`/privacy`)
![Privacy Policy](/screenshot/legal/privacy.png)
- Transparent explanation of data minimization, encrypted image storage for CNIC and bills, and zero third-party data monetization.

### Contact Us (`/contact`)
![Contact Us](/screenshot/legal/contact.png)
- Direct support form for dispute escalation, organizer accreditation inquiries, and technical support.
