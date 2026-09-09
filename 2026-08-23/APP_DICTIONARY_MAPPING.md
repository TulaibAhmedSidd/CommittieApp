# CommittieApp — Plain English & Urdu Complete UI Dictionary & Feature Mapping Guide
**Date**: September 9, 2026  
**File Location**: `/2026-08-23/APP_DICTIONARY_MAPPING.md`

---

## 1. Overview & System Purpose (سسٹم کا مقصد)

**CommittieApp** digitizes traditional rotating savings circles (Committees / BCs / ROSCAs) in Pakistan. It replaces paper ledgers and chaotic WhatsApp groups with a secure, verified, transparent mobile & web experience.

* **Simple English**: Save money monthly with trusted groups. Upload payment proof, enter automated fair draws, and collect your payout safely.
* **Simple Urdu**: اپنی کمیٹی کو آسان اور محفوظ بنائیں۔ ماہانہ بچت کریں، ادائیگی کا ثبوت اپ لوڈ کریں اور شفاف قرعہ اندازی کے ساتھ اپنی رقم وصول کریں۔

---

## 2. Complete English-to-Urdu UI Word & Action Dictionary

Below is the master dictionary mapping every button, label, status, and input field used across the app into plain, simple English and natural Urdu:

### A. Navigation & Core Controls (نیویگیشن اور بٹن)
| English (Simple) | Urdu (اردو) | Purpose / Meaning |
| :--- | :--- | :--- |
| **Home / Dashboard** | ڈیش بورڈ | Main home screen |
| **Explore** | دریافت کریں | Search available committees |
| **Near Me** | میرے قریب | Find local committees on map |
| **Inbox & Alerts** | پیغامات اور اعلانات | Notifications and organizer messages |
| **Menu** | مینو | Open all portal options |
| **Profile** | پروفائل | User identity & bank details |
| **Login** | لاگ ان | Sign into your account |
| **Get Started / Register** | شروع کریں / نیا اکاؤنٹ | Create a new user account |
| **Logout** | لاگ آؤٹ | Sign out safely |
| **Save** | محفوظ کریں | Save form inputs |
| **Cancel** | کینسل | Close modal or cancel action |
| **Submit** | جمع کریں | Submit form or request |
| **Back / Next** | پیچھے / آگے | Stepper navigation |
| **Actions** | اقدامات | Action buttons (Approve, Remove, Edit) |

---

### B. Member Dashboard Features & Actions (ممبر ڈیش بورڈ)

#### 1. Home Dashboard (`/userDash`)
* **Welcome Banner**: Greetings, profile picture, Blue Tick verification status.
* **My Ongoing Committees**: List of committees you are currently enrolled in.
* **Quick Stats Strip**: Total monthly savings, next payout month, paid status.
* **Recent Activity Log**: Payment receipt verification status (Approved / Pending).

#### 2. Explore Committees (`/userDash/explore`)
* **Search Input** (`کمپیٹی تلاش کریں`): Filter committees by name, city, or monthly installment amount.
* **Committee Cards**:
  * `Monthly Amount` (`ماہانہ قسط`): Monthly contribution (e.g. PKR 10,000).
  * `Total Pool` (`کل رقم`): Total collection per payout cycle (e.g. PKR 120,000).
  * `Slots Open` (`خالی نشستیں`): Remaining member slots available.
  * `Request to Join` (`شامل ہونے کی درخواست`): Sends join request to organizer.

#### 3. Near Me (`/userDash/near-me`)
* **City Filter**: Select Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, Multan, Faisalabad.
* **Map Pins**: View local committee organizers nearby without revealing exact home addresses.

#### 4. Member Profile & Identity Verification (`/userDash/profile`)
* **CNIC Front & Back Upload** (`شناختی کارڈ کی تصویر`): Upload photo ID for Blue Tick verification.
* **Selfie Verification** (`تصویر`): Selfie matching CNIC photo.
* **Payout Bank Details** (`بینک اکاؤنٹس`): JazzCash, EasyPaisa, or Bank Account title & IBAN for receiving payouts.

#### 5. Committee Detail Page (`/userDash/committee/[id]`)
* **Cycle Progress** (`سائیکل کی پیشرفت`): Displays current month (e.g. Month 4 of 12).
* **Upload Payment Proof** (`رسید اپ لوڈ کریں`): Upload screenshot of JazzCash/EasyPaisa/Bank transfer.
* **Draw Winner Announcement** (`قرعہ اندازی کے نتائج`): Shows payout schedule and winner list.

---

### C. Organizer / Admin Portal Features & Actions (آرگنائزر اور ایڈمن پینل)

#### 1. Command Center (`/admin`)
* **Total Active Committees** (`فعال کمیٹیاں`): Total running committees managed.
* **Total Members** (`کل ارکان`): Total enrolled members under organizer.
* **Pending Approvals** (`زیر التواء درخواستیں`): Member join requests awaiting review.
* **Total Pooled Valuation** (`کل رقم`): Total cash flow managed.

#### 2. Create Committee Wizard (`/admin/create`)
* **Step 1: Core Info** (`بنیادی معلومات`): Committee name, city, and description.
* **Step 2: Financial Setup** (`مالیاتی سیٹ اپ`): Monthly installment amount, number of members, duration in months, and start date.
* **Step 3: Review & Launch** (`جائزہ اور منظوری`): Final verification before publishing committee live.

#### 3. Manage Committees (`/admin/manage-committie`)
* **Edit Committee** (`ترمیم کریں`): Update details or description.
* **Delete Committee** (`ڈیلیٹ کریں`): Remove inactive committee pool.
* **View Members** (`ارکان دیکھیں`): Inspect member roster and payment receipts.

#### 4. Member Approvals & Direct Assignment (`/admin/approvals` & `/admin/assign-member`)
* **Approve Request** (`منظور کریں`): Approve pending member join request.
* **Disapprove / Move to Pending** (`زیر التواء کریں`): Move member status back to review.
* **Unassign / Remove Member** (`نکال دیں`): Remove member from committee.
* **Assign Member to Committee** (`کمیٹی میں شامل کریں`): Select member and link directly to a committee slot.

#### 5. Draw Results & Broadcaster (`/admin/announcement`)
* **Run Drawing Algorithm** (`شفاف قرعہ اندازی کریں`): Generate fair automated payout sequence.
* **Broadcast Announcement** (`اعلان نشر کریں`): Send notification to all committee members.

---

### D. Status & Badge Dictionary (سٹیٹس اور بیجز)

| English Badge | Urdu Equivalent | Meaning |
| :--- | :--- | :--- |
| **Verified (Blue Tick)** | تصدیق شدہ | CNIC & identity document approved by super-admin |
| **Open** | کھلی ہے | Committee currently accepting new member join requests |
| **Ongoing** | جاری ہے | Committee cycle currently active and collecting monthly installments |
| **Completed** | مکمل شدہ | Committee duration finished and all payouts distributed |
| **Paid** | ادائیگی مکمل | Monthly installment receipt verified by organizer |
| **Pending** | زیر التواء | Payment receipt uploaded, waiting for organizer verification |
| **Overdue** | دیر شدہ | Installment payment deadline missed |

---

## 3. First-Time User Experience (UX) Recommendations

1. **Bilingual Labels Everywhere**: All key buttons display English with Urdu subtitle (e.g. `Request to join / شامل ہوں`).
2. **Simple English Terminology**: Avoid technical/jargon terms like "recalibrate", "neural load", "sublink gateway". Use plain English: "Edit Details", "Total Members", "Email Address".
3. **Proof-First Security**: Every payment requires explicit payment proof (receipt screenshot), ensuring zero confusion between members and organizers.
