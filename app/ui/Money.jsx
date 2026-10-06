import { formatPKR } from "../utils/format";

const SIZES = { sm: "text-sm", md: "text-base", lg: "text-xl", xl: "text-3xl" };

/** "Rs 10,000". Lakh grouping is not used: most phones show western grouping. */
export default function Money({ value, size = "md", className = "" }) {
  return (
    <span className={`font-bold tabular-nums ${SIZES[size] || ""} ${className}`}>
      Rs {formatPKR(Number(value) || 0)}
    </span>
  );
}

export const moneyText = (v) => `Rs ${formatPKR(Number(v) || 0)}`;
