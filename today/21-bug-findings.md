# 21 — Bug Registry & Defect Findings

The browser walkthrough and code audit identified the following defects across frontend components, state management, and backend routes:

---

## 1. High Severity Defects

### BUG-01: `/admin/logs` Hardcoded Email Authorization
- **Location**: `app/admin/logs/page.jsx` (line 36) & `app/api/logs/route.js` (line 19)
- **Symptom**: Non-super admins could not access audit logs even if their database document had `isSuperAdmin: true`, because code strictly checked if email contained the string `"tulaib"`.
- **Impact**: Any newly appointed Super Admin was blocked with *"Unauthorized access to logs"*.
- **Fix Recommendation**: Replace string check with `admin.isSuperAdmin === true || admin.isSuperAdmin === "true"`.

### BUG-02: `/admin/manage` Infinite Loader on Missing Query Param
- **Location**: `app/admin/manage/page.jsx` (lines 35-65)
- **Symptom**: Navigating to `/admin/manage` without `?id=...` results in infinite *"INITIALIZING DATA..."* state.
- **Fix Recommendation**: If `!committeeId`, immediately call `router.replace("/admin/manage-committie")` or render an empty state selector.

---

## 2. Medium Severity Defects

### BUG-03: Form State Naming Mismatch on `/register` (RESOLVED)
- **Location**: `app/register/page.jsx`
- **Symptom**: State declared as `[formData, setFormData]` while inputs referenced `form` and `setForm`, causing an immediate uncaught ReferenceError on page interaction.
- **Resolution**: Fixed in codebase to `const [form, setForm] = useState(...)`.

### BUG-04: Theme Flash (Emerald to Purple) on App Reload (RESOLVED)
- **Location**: `app/Components/ThemeContext.tsx` & `app/api/settings/route.js`
- **Symptom**: On initial page load, dark emerald loaded first followed by a jarring purple flash (`royal` theme CSS variables).
- **Resolution**: Locked theme default to canonical `midnight` (Emerald & Gold) in ThemeContext and sanitized settings response.

---

## 3. Low Severity & Cosmetic Gaps

### BUG-05: API Response Key Inconsistency (`/api/admin/login` vs `/api/login`)
- **Location**: `app/api/admin/login/route.js`
- **Symptom**: Returns `{ token, data }` while `/api/login` returns `{ token, member }`.
- **Impact**: Requires disparate handling in client storage routines.
