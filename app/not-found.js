// app/not-found.js

import React from "react";

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-300 via-indigo-400 to-purple-500 text-white">
      <div className="text-center p-8 rounded-lg bg-opacity-90 bg-[rgba(0,0,0,0.2)] shadow-xl max-w-lg">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-2xl mb-6">Oops! The page you're looking for does not exist.</p>
        <a
          href="/"
          className="text-lg font-semibold text-blue-400 hover:text-blue-600 transition duration-300"
        >
          Go back to Home
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;
