import React, { Suspense } from "react";
import MainPage from "../Components/MainPage";

const UserDash = () => {
  return (
    <Suspense fallback={<div className="flex flex-col items-center justify-center min-h-[400px] gap-6 animate-in fade-in duration-500"><div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-2xl animate-spin shadow-lg" /></div>}>
      <MainPage />
    </Suspense>
  );
};

export default UserDash;
