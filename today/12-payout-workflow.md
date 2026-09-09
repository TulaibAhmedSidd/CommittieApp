# 12 — Payout Disbursement & Beneficiary Workflow

**Associated Routes**:
- `/admin/manage?id=...` (Organizer Payout Execution)
- `/userDash/committee/[id]` (Member Beneficiary View)

**Associated Screenshots**:
- `public/screenshot/organizer/payout-execution.png`
- `public/screenshot/member/payout-announcement.png`

---

## 1. Payout Mechanics in Digital Kameti

Each month of the committee cycle corresponds to one member's turn to receive the pooled funds:

$$\text{Disbursement Amount} = \text{Monthly Installment} \times \text{Total Members} - \text{Organizer Fee}$$

For a 5-member committee with PKR 5,000 monthly contribution:

$$\text{Total Payout} = 5{,}000 \times 5 = 25{,}000\text{ PKR}$$

---

## 2. Organizer Payout Execution Modal

![Payout Execution](/screenshot/organizer/payout-execution.png)

### Required Parameters:
1. **Recipient Identity**: Automatically locked to current month's scheduled beneficiary.
2. **Disbursement Amount (PKR)**: Total accumulated pool value.
3. **Transaction Protocol Ref**: Bank transfer transaction ID proving disbursement.
4. **Transfer Evidence**: Screenshot of successful inter-bank transfer.
5. **Action**: `CONFIRM TRANSMISSION` commits payout to `committee.payouts` array.

---

## 3. Member Payout Announcement

![Payout Announcement](/screenshot/member/payout-announcement.png)

- Displays active beneficiary for the month with high-visibility trust badge.
- When it is the logged-in member's turn, a congratulatory alert informs them of incoming funds.
- Records historical payout audit slips for tax and personal bookkeeping.
