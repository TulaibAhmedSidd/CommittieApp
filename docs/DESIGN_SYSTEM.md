# CommittieApp design system

Goal: an elder who has never used the app can open it and **create a BC, add family members, and record this month's payments without help.**
Every screen must pass that test.

## 1. Principles

| # | Principle | In practice |
|---|---|---|
| 1 | **One job per screen** | Each screen answers one question: "What do I need to do now?" One big primary button. |
| 2 | **Show, don't explain** | No paragraphs of help text. A short label plus an icon. Help goes in the Guide page. |
| 3 | **Same thing, same look** | The same status always has the same word and color, and the same action has the same button. |
| 4 | **Hide the rare stuff** | Edit, delete, end early, chat and history go under **More**. |
| 5 | **Forgiving** | Risky actions (reject, end, delete, remove) ask once in plain words. Double taps are safe. |
| 6 | **Phone first** | 360px first. Thumb-reachable bottom nav. Full-width buttons on mobile. |
| 7 | **Bilingual, calm** | English first, Urdu under key labels. The language toggle swaps which comes first. |

## 2. Layout

- **App shell** (`app/ui/AppShell.jsx`), the same for organizer and member:
  - **Mobile:** a top bar (app name, bell, language) and a **bottom nav with 4–5 items**. The center item is the main action for organizers (**+ BC**).
  - **Desktop (≥1024px):** a left sidebar with the same items, plus a "More" group. Content is max 960px wide, centered.
- **Page** (`<Page title urdu back action>`): title row, then sections. Side padding is 16px on mobile and 24px on desktop.
- **Section** (`<Section title urdu action="See all">`): a small heading, then a list or cards. Gap between sections: 24px.
- **No nested cards. No decorative gradients, background patterns or glass effects.**

## 3. Tokens (defined in `app/globals.css`, mapped in `tailwind.config.ts`)

| Token | Use |
|---|---|
| `bg-surface` (page) / `bg-white` (cards) | Backgrounds |
| `text-ink-900` | Headings and main text |
| `text-ink-600` | Secondary text |
| `text-ink-400` | Hints, placeholders |
| `border-line` | Card and input borders |
| `primary-50…900` (emerald) | Brand, primary buttons, "Paid" |
| `warning` (amber) | Needs action, waiting |
| `danger` (red) | Problems, destructive actions |
| `info` (blue) | Neutral info |
| `font-urdu` | Urdu text (Noto Nastaliq Urdu) |

**Type scale:**

| Text | Size and weight |
|---|---|
| Page title | 22–24px, bold |
| Section title | 15px, semibold, `text-ink-600` |
| Body | 16px |
| Small | 13–14px |
| Money on cards | 20px, bold |

Never go below 13px. **Radius:** 12px for cards and inputs, 10px for buttons, full for badges. **Shadow:** a single soft shadow, `shadow-card`.

## 4. Components (`app/ui/`)

Use these and nothing else for the same purpose. If something is missing, add it to `app/ui/` and document it here.

| Component | Purpose | Key props |
|---|---|---|
| `AppShell` | Shell for organizer and member areas | `nav`, `more`, `scope` |
| `Page` | Page title row | `title`, `urdu`, `back`, `action` |
| `Section` | Titled group | `title`, `urdu`, `href` (See all), `action` |
| `Card` | White box | `href` (makes it tappable), `padding` |
| `Button` | All buttons | `variant`: primary / secondary / ghost / danger / whatsapp; `size`: md / lg; `full`, `loading`, `href`, `icon` |
| `Bi` | English + Urdu label | `en`, `ur`, `stack` |
| `Field`, `Select`, `TextArea` | Form inputs with label, hint and error | `label`, `urdu`, `hint`, `error` |
| `Money` | "Rs 10,000" | `value`, `size` |
| `StatusBadge` | Fixed status vocabulary | `status` |
| `Progress` | "Month 3 of 10" bar | `current`, `total` |
| `EmptyState` | Nothing here yet | `icon`, `title`, `urdu`, `action` |
| `Sheet` | Bottom sheet on mobile, dialog on desktop | `open`, `onClose`, `title` |
| `Confirm` | One-question confirmation | `useConfirm()` hook |
| `MoreMenu` | "More" button that opens a list of actions | `items` |
| `Tabs` | 2–4 tabs | `tabs`, `value`, `onChange` |
| `ListRow` | Row with avatar, title, subtitle and right side | `title`, `subtitle`, `right`, `href`/`onClick` |
| `Avatar` | Initials circle | `name` |
| `ShareBox` | WhatsApp + Copy for a link | `link`, `text`, `phone` |
| `PhotoPicker` | Gallery or camera, compressed | `value`, `onChange`, `label` |
| `SecureImage` | Image from `/api/assets` with token | `src`, `scope` |
| `Loading` / `Skeleton` | Loading states | |

## 5. Status vocabulary (fixed)

| Key | English | Urdu | Color |
|---|---|---|---|
| `verified` / `paid` | Paid | ادا ہو گیا | green |
| `pending` | Waiting for check | چیک ہونا باقی | amber |
| `unpaid` | Not paid | ادا نہیں ہوا | gray |
| `rejected` | Sent back | واپس | red |
| `receiver` | Gets the pot | اس ماہ کی باری | primary |
| `upcoming` | Coming up | آنے والی | info |
| `running` | Running | جاری | primary |
| `finished` | Finished | مکمل | gray |
| `invited` | Invite sent | دعوت بھیجی گئی | amber |
| `request` | Wants to join | شامل ہونا چاہتے ہیں | amber |

## 6. Words (`app/utils/words.js`)

Use these exact words. Never invent synonyms on other screens.

| Concept | Say | Never say |
|---|---|---|
| The group | **BC** (کمیٹی) | pool, circuit, cycle, committee (in UI) |
| Monthly payment | **Monthly amount** / **Pay** (قسط) | installment sync, contribution node |
| Money given to the receiver | **Payout** / **Give payout** (رقم دیں) | disbursement, drawing execution |
| Payout order | **Turn order** (باری) | result, draw protocol |
| Payment photo | **Receipt** (رسید) | evidence, transaction proof |
| Organizer | **Organizer** (منتظم) | admin, commander, lead node |
| Start | **Start BC** | launch, establish |

**Tone:** "Ali has not paid yet", not "Payment pending for member". Use buttons with verbs: **Pay now**, **Approve**, **Send on WhatsApp**.

## 7. Screen patterns

- **Home (organizer):**
  - Hello line.
  - **To do** strip: "3 receipts to check · 2 join requests". Only shown when something needs doing.
  - Big **Create BC** button.
  - **Running now**, **Coming up** and **Finished** lists (3 each, "See all").
- **BC page (organizer):** what you see depends on the stage.
  - **Coming up:** members x/y, Share on WhatsApp, join requests, **Start BC** (when full).
  - **Running:** "Month 3 of 10 · Ali gets Rs 90,000", member rows with status and one action each, **Give payout**, then **Next month**.
  - **Finished:** summary.
  - **More:** Edit, Turn order, Past months, End BC, Delete.
- **Home (member):**
  - **My BCs** cards, each with one clear line ("Pay Rs 10,000 for Oct" + **Pay now**, or "Paid ✓", or "Your turn: Mar 2027").
  - **Coming up** from your organizers.
- **Forms:** one column, labels above inputs, at most 4–5 fields visible. Optional extras sit behind **More options**.

## 8. Accessibility checklist

- Contrast at least 4.5:1 for text.
- Every icon-only button has `aria-label`.
- Inputs have a visible `<label>`. Errors are shown in text, not only by color.
- Focus ring visible (`focus-visible:ring-2 ring-primary-500`).
- Respect `prefers-reduced-motion`. No auto-moving content.
