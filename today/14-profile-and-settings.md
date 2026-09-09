# 14 — Profile, Settings & Bank Coordinates

**Associated Routes**:
- `/userDash/profile` (Member Profile & Payout Coordinates)
- `/admin/profile` (Organizer Profile & Verification)

**Associated Screenshot**: `public/screenshot/member/verification.png`

---

## 1. Profile Data Points

The profile management interface manages personal identity, KYC documents, and critical payout banking coordinates.

### Editable Fields:
1. **Personal Information**:
   - Legal Name
   - Mobile Contact Number
   - City & Locality (e.g. *Karachi, Gulshan-e-Iqbal*)
2. **Payout Banking Coordinates (`payoutDetails`)**:
   - **Account Title**: Must match member's CNIC legal name.
   - **Bank Name**: Selected institution (e.g., *Meezan Bank, Standard Chartered, EasyPaisa, JazzCash*).
   - **IBAN / Account Number**: 24-character IBAN format.
3. **Language & Regional Preferences**:
   - English / Urdu toggle stored in `localStorage` via `LanguageContext`.
