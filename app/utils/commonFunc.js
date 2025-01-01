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

  if (email?.includes(CommonData?.tas) || Name?.includes(CommonData?.tas)) {
    return true;
  } else {
    return false;
  }
};

export function joinMultipleStringWithSpace(strArr) {
  return strArr.join(" ");
}
