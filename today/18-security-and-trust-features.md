# 18 — Security, Trust & Anti-Fraud Architecture

---

## 1. Threat Modeling & Mitigation

| Threat Vector | Attack Scenario | Platform Defense Mechanism |
| :--- | :--- | :--- |
| **Post-Payout Default ("BC Uthake Bhaagna")** | Member takes Month 1 payout (PKR 25k) and refuses to pay subsequent months. | Upfront CNIC & utility bill verification; explicit legal liability under Pakistan Penal Code (PPC 406/420); permanent platform CNIC blacklist. |
| **Fake Payment Slips** | Member uploads altered or forged screenshot of easyPaisa/bank slip. | Dual-check protocol: Organizer must match Transaction ID in online banking app before clicking "AUTHENTICATE". |
| **Rogue Organizer** | Untrusted individual creates fake circle and absorbs member contributions. | Super Admin approval gatekeeper before any organizer can create pools; mandatory verified bank coordinates. |
| **Session Hijacking** | Interception of administrative credentials. | JWT token expiration, secure cookie/localStorage partitioning, role claims validation on every mutation. |

---

## 2. Legal Framework: Pakistan Penal Code (PPC 420 & 406)

CommittieApp bridges digital software and Pakistani statutory law:
- **PPC Section 406 (Criminal Breach of Trust / خیانت با مجرمانہ نیت)**:
  Applies directly when a member receives the collective trust (the pool payout) and dishonestly misappropriates the subsequent installments due to other circle participants.
- **PPC Section 420 (Cheating & Dishonestly Inducing Delivery of Property / دھوکہ دہی)**:
  Applies when a user registers with fraudulent details or submits fake payment receipts.
- **Legal Terms Section 7**: Explicitly consented to by all users during registration and displayed on `/terms`.
