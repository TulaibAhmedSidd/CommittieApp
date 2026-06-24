/**
 * Format a number as PKR currency.
 *
 * grouping:
 *   "western" -> 1,500,000  (default — matches what most fintech UI shows)
 *   "lakh"    -> 15,00,000  (lakh-crore grouping; common on Pakistani receipts/cheques)
 *
 * Returns digits only — wrap with the ₨ glyph yourself or use the <Money /> primitive.
 */
export type PKRGrouping = "western" | "lakh";

export function formatPKR(
    amount: number | null | undefined,
    grouping: PKRGrouping = "western"
): string {
    if (amount == null || isNaN(amount)) return "0";
    const rounded = Math.round(amount);

    if (grouping === "western") {
        return new Intl.NumberFormat("en-US").format(rounded);
    }

    // Lakh-crore grouping: last 3 digits, then groups of 2.
    const negative = rounded < 0;
    const abs = Math.abs(rounded).toString();
    if (abs.length <= 3) return (negative ? "-" : "") + abs;

    const last3 = abs.slice(-3);
    const head = abs.slice(0, -3);
    const headGrouped = head.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    return (negative ? "-" : "") + headGrouped + "," + last3;
}

/**
 * Render large round amounts as Urdu words for trust-heavy surfaces
 * (committee total, payout amount). Approximate, covers the common
 * banding most committee amounts fall into.
 */
export function amountInUrduWords(amount: number | null | undefined): string {
    if (amount == null || isNaN(amount) || amount === 0) return "";
    const n = Math.round(Math.abs(amount));

    const crore = Math.floor(n / 10000000);
    const lakh = Math.floor((n % 10000000) / 100000);
    const thousand = Math.floor((n % 100000) / 1000);
    const rest = n % 1000;

    const parts: string[] = [];
    if (crore) parts.push(`${crore} کروڑ`);
    if (lakh) parts.push(`${lakh} لاکھ`);
    if (thousand) parts.push(`${thousand} ہزار`);
    if (rest) parts.push(`${rest}`);
    return parts.join(" ") + " روپے";
}
