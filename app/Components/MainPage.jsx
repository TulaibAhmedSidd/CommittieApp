// "use client";

// import { useEffect, useState } from "react";

// export default function MainPage() {



//   const [committees, setCommittees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     async function fetchCommittees() {
//       try {
//         const res = await fetch("/api/committee");
//         if (!res.ok) throw new Error("Failed to fetch committees");
//         const data = await res.json();
//         setCommittees(data);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     }
//     fetchCommittees();
//   }, []);

//   const registerForCommittee = async (committeeId) => {
//     try {
//       const res = await fetch(`/api/member?id=${committeeId}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name: "User Name", email: "user@example.com" }),
//       });
//       if (!res.ok) throw new Error("Failed to register");
//       alert("Registered successfully!");
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   if (loading) {
//     return <div className="flex justify-center items-center h-screen">Loading...</div>;
//   }

//   if (error) {
//     return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">Available Committees</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {committees.map((committee) => (
//           <div
//             key={committee._id}
//             className="p-6 bg-white shadow-md rounded-lg border border-gray-200"
//           >
//             <h2 className="text-xl font-semibold">{committee.name}</h2>
//             <p className="text-gray-600">{committee.description}</p>
//             <p className="mt-2">
//               <strong>Slots Available: </strong>
//               {committee.maxMembers - committee.members.length} / {committee.maxMembers}
//             </p>
//             <div className="mt-4 flex items-center gap-4">
//               {committee.status === "open" ? (
//                 <button
//                   className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                   onClick={() => registerForCommittee(committee._id)}
//                 >
//                   Ask to Register in this committie
//                 </button>
//               ) : (
//                 <span className="text-red-500 font-semibold">Committee Full</span>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="mt-12">
//         <h2 className="text-xl font-bold">Admin Announcements</h2>
//         <div className="mt-4 space-y-4">
//           {committees
//             .filter((committee) => committee.result.length > 0)
//             .map((committee) => (
//               <div
//                 key={committee._id}
//                 className="p-4 bg-green-100 rounded-lg shadow-md border border-green-300"
//               >
//                 <h3 className="font-semibold">
//                   {committee.name} - Results Announced
//                 </h3>
//                 <ul className="mt-2 list-disc pl-5">
//                   {committee.result.map((res) => (
//                     <li key={res.position}>
//                       Position {res.position}: {res.member}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkArrNull } from '../utils/commonFunc'
import NotAvailText from '../Components/NotAvailText'
import MyCommittie from './MyCommittie'


export default function MainPage() {
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [myCommittie, setmyCommittie] = useState(false);
  const [userLoggedData, setUserLoggedData] = useState(null);
  const router = useRouter();


  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("member");
    if (!token) {
      setUserLoggedIn(false);
      router.push("/login");  // Redirect to login page if no token
    } else {
      setUserLoggedIn(true);
      setUserLoggedData(JSON.parse(userData));
      fetchCommittees();
    }
  }, []);

  const fetchCommittees = async () => {
    try {
      const res = await fetch("/api/committee");
      if (!res.ok) throw new Error("Failed to fetch committees");
      const data = await res.json();
      setCommittees(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const registerForCommittee = async (committeeId) => {
    try {
      const res = await fetch(`/api/member?id=${committeeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userLoggedData?.name, email: userLoggedData?.email }),
      });
      if (!res.ok) throw new Error("Failed to register");
      alert("Registered successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  // If the user is not logged in, they are redirected to the login page
  if (!userLoggedIn) {
    return <div>Redirecting to login...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6 pb-2 border-b-2 border-black ">
        <h1 className="text-2xl font-bold capitalize">Welcome, {userLoggedData?.name}</h1>
        <button
          onClick={() => {
            localStorage?.clear();
            setTimeout(() => {
              router.push('/login')
              router.back()
            }, 800);
          }}
          className="bg-red-400 text-white py-1 px-4 rounded hover:bg-red-600">
          Logout
        </button>
      </div>
      <div className="flex justify-between my-3" >
        <button
          onClick={() => {
            setmyCommittie(!myCommittie)
          }}
          className="bg-green-400 text-white py-1 px-4 rounded hover:bg-green-600">
          {myCommittie ? "Hide my committies" : 'See my available committies'}
        </button>
      </div>

      {
        myCommittie ?
          <MyCommittie />
          :
          <>
            <h1 className="text-2xl font-bold mb-6">Available Committees</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {
                checkArrNull(committees) ?

                  <NotAvailText text="No Committees available yet!" />
                  :
                  committees.map((committee) => (
                    <div
                      key={committee._id}
                      className="p-6 bg-white shadow-md rounded-lg border border-gray-200"
                    >
                      <h2 className="text-xl font-semibold">{committee.name}</h2>
                      <p className="text-gray-600">{committee.description}</p>
                      <p className="mt-2">
                        <strong>Slots Available: </strong>
                        {committee.maxMembers - committee.members.length} / {committee.maxMembers}
                      </p>
                      <div className="mt-4 flex items-center gap-4">
                        {committee.status === "open" ? (
                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={() => registerForCommittee(committee._id)}
                          >
                            Ask to join this committee
                          </button>
                        ) : (
                          <span className="text-red-500 font-semibold">Committee Full</span>
                        )}
                      </div>
                    </div>
                  ))}
            </div>

            <div className="mt-12">
              <h2 className="text-xl font-bold">Admin Announcements</h2>
              <div className="mt-4 space-y-4">
                {
                  checkArrNull(committees
                    .filter((committee) => committee.result.length > 0)) ?

                    <NotAvailText text="No Committees Announcement available yet!" />
                    :
                    committees
                      .filter((committee) => committee.result.length > 0)
                      .map((committee) => (
                        <div
                          key={committee._id}
                          className="p-4 bg-green-100 rounded-lg shadow-md border border-green-300"
                        >
                          <h3 className="font-semibold">
                            {committee.name} - Results Announced
                          </h3>
                          <ul className="mt-2 list-disc pl-5">
                            {committee.result.map((res) => (
                              <li key={res.position}>
                                Position {res.position}: {res.member}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
              </div>
            </div>
          </>
      }
    </div>
  );
}
