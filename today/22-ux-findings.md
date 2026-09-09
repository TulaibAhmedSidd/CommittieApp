# 22 — User Experience (UX) & Usability Analysis

---

## 1. Plain English to Natural Roman Urdu Mapping

To align with traditional Pakistani users, technical jargon has been mapped to accessible, everyday vocabulary:

| Traditional Tech Jargon | Simplified English | Natural Roman Urdu | Urdu Script |
| :--- | :--- | :--- | :--- |
| **Authentication / Login** | Sign In | Dakhil Hon / Login | داخل ہوں |
| **Onboarding / Signup** | Join / Create Account | Naya Account Banayein | نیا اکاؤنٹ |
| **Committees / ROSCAs** | Committee Circles | Kameti / BC | کمیٹی |
| **Installment Contribution** | Monthly Payment | Mahana Raqam / Qist | ماہانہ رقم / قسط |
| **Disbursement / Draw** | Payout Turn | BC Uthana / Draw | قرعہ اندازی / قرعہ |
| **Beneficiary** | Payout Winner | Jiski BC Nikli | حقدار / ممبر |
| **KYC Verification** | Identity Proof | Shanakht Ki Tasdeeq | شناخت کی تصدیق |
| **Bank Coordinates** | Bank Details | Bank Account Ki Maloomat | بینک کی تفصیلات |
| **Reconciliation / Audit** | Payment Proof Check | Payment Ki Tasdeeq | ادائیگی کی تصدیق |

---

## 2. Visual Contrast & Color Harmony

- **Canonical Harmony**: Emerald Green (`#047857`) paired with Antique Gold (`#C9A227`).
- **Surface Modernization**:
  - `/privacy`, `/terms`, and `/contact` successfully updated from harsh dark backgrounds (`#0f172a`, `#020617`) to soft, accessible light tones (`bg-surface-50`) with high-contrast text (`text-ink-900`).
  - Dark mode support remains intact and functional via Tailwind `dark:` variants.

---

## 3. Mobile & Touch Responsive Optimization

- The navigation bar collapses cleanly into a mobile drawer on viewports `< 768px`.
- Bottom action bars in Member and Organizer portals provide thumb-accessible navigation between Dashboard, Explore, and Inbox.
