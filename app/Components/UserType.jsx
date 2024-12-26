// 'use client'
// import { useRouter } from 'next/navigation'
// import React from 'react'

// const UserType = () => {
//     const router = useRouter()
//     return (
//         <div className="container mx-auto px-4 py-8 bg-white rounded-md">
//             <h1 className="text-2xl font-bold mb-6">Login As A</h1>
//             <button
//                 onClick={() => {
//                     router?.push('/userDash')
//                 }}
//                 type="submit"
//                 className="bg-blue-500 text-white px-4 py-2 mb-2 rounded w-full hover:bg-blue-600"
//             >
//                 Committie Member
//             </button>
//             <button
//                 onClick={() => {
//                     router?.push('/admin')
//                 }}
//                 type="submit"
//                 className="bg-blue-500 text-white px-4 py-2 mb-2 rounded w-full hover:bg-blue-600"
//             >
//                 Admin
//             </button>
//         </div>
//     )
// }

// export default UserType

"use client";

import { useRouter } from "next/navigation";

export default function UserType() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-700">
          Login As
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Committee Member Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <img
              src="https://via.placeholder.com/300x200?text=Member"
              alt="Committee Member"
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Committee Member
            </h2>
            <p className="text-gray-600 mb-6">
              Join and manage committees, check your participation status, and
              explore exciting opportunities.
            </p>
            <button
              onClick={() => router.push("/userDash")}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            >
              Login as Member
            </button>
          </div>

          {/* Admin Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <img
              src="https://via.placeholder.com/300x200?text=Admin"
              alt="Admin Dashboard"
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Admin
            </h2>
            <p className="text-gray-600 mb-6">
              Manage committees, approve members, and oversee results with
              advanced administrative tools.
            </p>
            <button
              onClick={() => router.push("/admin")}
              className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
            >
              Login as Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
