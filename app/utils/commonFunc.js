import { CommonData } from "./data";

export const checkArrNull = (arr) => {
  if (arr?.length == 0 || arr == null || arr == []) {
    return true;
  } else {
    return false;
  }
};

export const checkerForAddAdmin = (userLoggedDetails) => {
  const email = userLoggedDetails?.email?.toLowerCase();
  const Name = userLoggedDetails?.name?.toLowerCase();

  if (email?.includes(CommonData?.tas?.toLowerCase()) || Name?.includes(CommonData?.tas?.toLowerCase()) || email === "Tulaib@gmail.com") {
    return true;
  } else {
    return false;
  }
};

export function joinMultipleStringWithSpace(strArr) {
  return strArr.join(" ");
}
export function formatMoney(amount) {
  if (amount == null || isNaN(amount)) {
    return "0"; // Default for null or invalid input
  }
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}