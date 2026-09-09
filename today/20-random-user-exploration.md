# 20 — Chaos Testing & Random User Exploration

---

## 1. Methodology

To ensure system resilience, the browser walkthrough executed exploratory and boundary stress testing across unauthenticated users, edge navigation paths, and erratic input behaviors.

---

## 2. Tested Scenarios & Observations

### Scenario A: Unauthenticated Deep Links
- **Action**: Direct navigation to `/userDash`, `/userDash/profile`, `/admin`, and `/admin/manage` without JWT token in storage.
- **Behavior**: Application correctly traps missing credentials in `useEffect` / middleware and pushes to `/login` or `/admin/login`.

### Scenario B: Route Parameter Omission (`/admin/manage`)
- **Action**: Accessing `/admin/manage` directly without `?id=` query parameter.
- **Observation**: Displays persistent *"INITIALIZING DATA..."* loader indefinitely because `fetchCommitteebyId(null)` is never triggered.
- **Recommendation**: Add a null check on `committeeId` to redirect back to `/admin/manage-committie` or display a fallback list of committees.

### Scenario C: Form Submit Double-Clicking
- **Action**: Rapidly clicking *"CREATE COMMITTEE"* and *"SUBMIT PAYMENT"*.
- **Observation**: Button properly sets `loading={true}` and disables pointer events, preventing duplicate database records.

### Scenario D: Non-Admin Access to Internal Tools
- **Action**: Visiting `/theme-guide` as a standard visitor.
- **Observation**: Correctly blocks access and redirects to `/admin/login`.
