// "use client";

// import { useEffect, useState } from "react";

// export default function MyCommittie() {
//     const [committees, setCommittees] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     const [userId, setUserId] = useState(null); // Replace this with the actual user ID, e.g., from a login state

//     console.log("userId", userId)
//     useEffect(() => {
//         // Check if user is logged in
//         let userData = localStorage.getItem("member");
//         userData = JSON.parse(userData)
//         if (!userId) {
//             if (userData) setUserId(userData?._id)
//         }
//     }, [userId]);

//     async function fetchCommittees() {
//         try {
//             const res = await fetch("/api/member/my-committie", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ userId: userId }),
//             });

//             if (!res.ok) throw new Error("Failed to fetch committees");
//             const data = await res.json();
//             setCommittees(data.committees);
//             setLoading(false);
//         } catch (err) {
//             setError(err.message);
//             setLoading(false);
//         }
//     }
//     useEffect(() => {
//         if(userId){
//             fetchCommittees();
//         }
//     }, [userId]);

//     if (loading) {
//         return <div className="flex justify-center items-center h-screen">Loading...</div>;
//     }

//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-2xl font-bold mb-4">My Committees</h1>

//             <div className="space-y-4">
//                 {committees.map((committee) => (
//                     <div key={committee._id} className="p-4 border rounded shadow-md bg-white">
//                         <h2 className="text-xl font-semibold">{committee.name}</h2>
//                         <p>{committee.description}</p>
//                         <p>
//                             <strong>Status:</strong> {committee.status}
//                         </p>
//                         {committee.result.status === "accounted" ? (
//                             <p className="text-green-500">
//                                 Your Position: {committee.result.position}
//                             </p>
//                         ) : committee.result.status === "not accounted" ? (
//                             <p className="text-red-500">You are not in the results</p>
//                         ) : (
//                             <p className="text-yellow-500">Results not announced</p>
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </div>
       
//     );
// }



"use client";

import { useEffect, useState } from "react";

export default function MyCommittie() {
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    let userData = localStorage.getItem("member");
    userData = JSON.parse(userData);
    if (!userId && userData) setUserId(userData?._id);
  }, [userId]);

  const fetchCommittees = async () => {
    try {
      const res = await fetch("/api/member/my-committie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) throw new Error("Failed to fetch committees");
      const data = await res.json();
      setCommittees(data.committees);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchCommittees();
  }, [userId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto ">
      <h2 className="text-2xl font-bold mb-6">My Committees</h2>

      <div className="space-y-4">
        {committees.map((committee) => (
          <div
            key={committee._id}
            className="bg-white p-6 border rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-800">
              {committee.name}
            </h3>
            <p className="text-gray-600">{committee.description}</p>
            <p className="text-gray-800">
              <strong>Status:</strong> {committee.status}
            </p>
            {committee.result.status === "accounted" ? (
              <p className="text-green-500 mt-2">
                Your Position: {committee.result.position}
              </p>
            ) : committee.result.status === "not accounted" ? (
              <p className="text-red-500 mt-2">You are not in the results</p>
            ) : (
              <p className="text-yellow-500 mt-2">Results not announced</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
