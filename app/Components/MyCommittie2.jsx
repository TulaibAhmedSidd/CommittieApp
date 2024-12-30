"use client";

import { useEffect, useState } from "react";

// export default function MyCommittie2() {
//   const [committees, setCommittees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [userId, setUserId] = useState(null);

//   useEffect(() => {
//     let userData = localStorage.getItem("member");
//     userData = JSON.parse(userData);
//     if (!userId && userData) setUserId(userData?._id);
//   }, [userId]);
// console.log("committees =>",committees)
//   const fetchCommittees = async () => {
//     try {
//       const res = await fetch("/api/member/my-committie", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId }),
//       });

//       if (!res.ok) throw new Error("Failed to fetch committees");
//       const data = await res.json();
//       setCommittees(data.committees);
//       setLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (userId) fetchCommittees();
//   }, [userId]);

//   if (loading) {
//     return <div className="flex justify-center items-center h-screen">Loading...</div>;
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen text-red-500">
//         {error}
//       </div>
//     );
//   }

//   const renderStatus = (committee) => {
//     // Check if user is in the approved members list
//     const isApproved = committee?.members.some(
//       (member) => member?._id === userId
//     );

//     if (isApproved) {
//       return <span className="text-green-500 font-semibold">Approved</span>;
//     }

//     // Check if user is in the pending members list
//     const isPending = committee?.pendingMembers.some(
//       (member) => member?._id === userId
//     );

//     if (isPending) {
//       return <span className="text-yellow-500 font-semibold">Pending</span>;
//     }
//     // Default status
//     return <span className="text-red-500 font-semibold">Not Requested</span>;
//   };

//   return (
//     <div className="container mx-auto px-6 py-8">
//       <h2 className="text-2xl font-bold mb-6">My Committees</h2>

//       <div className="space-y-6">
//         {committees.length === 0 ? (
//           <p className="text-gray-500">You have no committee interactions yet.</p>
//         ) : (
//           committees.map((committee) => (
//             <div
//               key={committee?._id}
//               className="bg-white p-6 border rounded-lg shadow-lg hover:shadow-xl transition-shadow"
//             >
//               <h3 className="text-xl font-semibold text-gray-800">
//                 {committee?.name}
//               </h3>
//               <p className="text-gray-600">{committee?.description}</p>
//               <p className="mt-2 text-gray-800">
//                 <strong>Status:</strong> {renderStatus(committee)}
//               </p>
//               {committee?.result?.length > 0 && (
//                 <div className="mt-4">
//                   <h4 className="text-lg font-semibold text-gray-800">
//                     Results:
//                   </h4>
//                   <ul className="list-disc pl-5 space-y-2">
//                     {committee?.result.map((res) => (
//                       <li key={res?.position} className="text-gray-700">
//                         <strong>Position {res?.position}:</strong>{" "}
//                         {res?.member?.name}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }


export default function MyCommittie2() {
  const [committees, setCommittees] = useState({ approvedCommittees: [], pendingCommittees: [] });
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

      // Update state to hold both approved and pending committees
      setCommittees({
        approvedCommittees: data.approvedCommittees || [],
        pendingCommittees: data.pendingCommittees || [],
      });
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

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  const renderStatus = (committee) => {
    // Check if user is in the approved members list
    const isApproved = committee?.members.some(
      (member) => member?._id === userId
    );

    if (isApproved) {
      return <span className="text-green-500 font-semibold">Approved</span>;
    }

    // Check if user is in the pending members list
    const isPending = committee?.pendingMembers.some(
      (member) => member?._id === userId
    );

    if (isPending) {
      return <span className="text-yellow-500 font-semibold">Pending</span>;
    }
    // Default status
    return <span className="text-red-500 font-semibold">Not Requested</span>;
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold mb-6">My Committees</h2>

      {/* Approved Committees */}
      <div className="space-y-6">
        {committees.approvedCommittees.length === 0 ? (
          <p className="text-gray-500">You have no approved committees.</p>
        ) : (
          committees.approvedCommittees.map((committee) => (
            <div
              key={committee?._id}
              className="bg-white p-6 border rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {committee?.name}
              </h3>
              <p className="text-gray-600">
                <strong>Max Members: </strong> {committee?.maxMembers}
              </p>
              <p className="text-gray-600">
                <strong>Approved Members: </strong> {committee?.members?.length}
              </p>
              <p className="text-gray-600">
                <strong>Committie Details: </strong>{committee?.description}
              </p>
              <p className="text-gray-600">
                <strong>Remaining Members: </strong>{committee?.maxMembers - committee?.members?.length}
              </p>
              <p className=" text-gray-800">
                <strong>Status:</strong>
                <span className="text-green-500 font-semibold pl-1">
                  {"Approved member"}
                </span>
              </p>
              {committee?.result?.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-lg font-semibold text-gray-800">Results:</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    {committee?.result.map((res) => (
                      <li key={res?.position} className="text-gray-700">
                        <strong>Position {res?.position}:</strong>{" "}
                        {res?.member?.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pending Committees */}
      <div className="space-y-6 mt-6">
        {committees.pendingCommittees.length === 0 ? (
          <p className="text-gray-500">You have no pending committees.</p>
        ) : (
          committees.pendingCommittees.map((committee) => (
            <div
              key={committee?._id}
              className="bg-white p-6 border rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {committee?.name}
              </h3>
              <p className="text-gray-600">{committee?.description}</p>
              <p className="mt-2 text-gray-800">
                <strong>Status:</strong> {renderStatus(committee)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
