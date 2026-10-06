// Field lists used with .select() / populate() so private data never leaks.
// Never return: password, resetToken, passwordLink, loginFails, lockUntil.

/** What a BC organizer may see about the BC's members (needs IBAN to pay out). */
export const MEMBER_FOR_OWNER = "name phone email city verificationStatus payoutDetails";

/** What other members of the same BC may see about each other. */
export const MEMBER_FOR_PEER = "name city verificationStatus";

/** Public view of a member (discovery). Never phone, email or exact location. */
export const MEMBER_PUBLIC = "name city country verificationStatus";

/** What a member may see about their organizer. */
export const ADMIN_FOR_MEMBER = "name phone city verificationStatus";

/** Public view of an organizer. */
export const ADMIN_PUBLIC = "name city country verificationStatus";

/** A member reading their own record. */
export const MEMBER_SELF =
  "name email phone city county country status verificationStatus payoutDetails nicNumber nicFront nicBack electricityBill documents location organizers pendingOrganizers committees createdAt";

/** An organizer reading their own record. */
export const ADMIN_SELF =
  "name email phone city county country status isSuperAdmin verificationStatus nicNumber nicImage referralCode referralScore location createdAt";

/** KYC fields, only for the verify screen. */
export const MEMBER_KYC = "name phone email city verificationStatus nicNumber nicFront nicBack electricityBill documents";
