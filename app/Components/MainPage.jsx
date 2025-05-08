
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkArrNull, formatMoney } from "../utils/commonFunc";
import NotAvailText from "../Components/NotAvailText";
import MyCommittie2 from "./MyCommittie2";
import { toast } from "react-toastify";
import moment from "moment";
import AdminTabs from "../admin/AdminComponents/AdminTabs";
import Notifications from '../Components/NotifList'


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


//  Below component is good and beautifull 
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { checkArrNull } from '../utils/commonFunc'
// import NotAvailText from '../Components/NotAvailText'
// import MyCommittie from './MyCommittie'


// export default function MainPage() {
//   const [committees, setCommittees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [userLoggedIn, setUserLoggedIn] = useState(false);
//   const [myCommittie, setmyCommittie] = useState(false);
//   const [userLoggedData, setUserLoggedData] = useState(null);
//   const router = useRouter();


//   useEffect(() => {
//     // Check if user is logged in
//     const token = localStorage.getItem("token");
//     const userData = localStorage.getItem("member");
//     if (!token) {
//       setUserLoggedIn(false);
//       router.push("/login");  // Redirect to login page if no token
//     } else {
//       setUserLoggedIn(true);
//       setUserLoggedData(JSON.parse(userData));
//       fetchCommittees();
//     }
//   }, []);

//   const fetchCommittees = async () => {
//     try {
//       const res = await fetch("/api/committee");
//       if (!res.ok) throw new Error("Failed to fetch committees");
//       const data = await res.json();
//       setCommittees(data);
//       setLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   const registerForCommittee = async (committeeId) => {
//     try {
//       const res = await fetch(`/api/member?id=${committeeId}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name: userLoggedData?.name, email: userLoggedData?.email }),
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

//   // If the user is not logged in, they are redirected to the login page
//   if (!userLoggedIn) {
//     return <div>Redirecting to login...</div>;
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-6 pb-2 border-b-2 border-black ">
//         <h1 className="text-2xl font-bold capitalize">Welcome, {userLoggedData?.name}</h1>
//         <button
//           onClick={() => {
//             localStorage?.clear();
//             setTimeout(() => {
//               router.push('/login')
//               router.back()
//             }, 800);
//           }}
//           className="bg-red-400 text-white py-1 px-4 rounded hover:bg-red-600">
//           Logout
//         </button>
//       </div>
//       <div className="flex justify-between my-3" >
//         <button
//           onClick={() => {
//             setmyCommittie(!myCommittie)
//           }}
//           className="bg-green-400 text-white py-1 px-4 rounded hover:bg-green-600">
//           {myCommittie ? "Hide my committies" : 'See my available committies'}
//         </button>
//       </div>

//       {
//         myCommittie ?
//           <MyCommittie />
//           :
//           <>
//             <h1 className="text-2xl font-bold mb-6">Available Committees</h1>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {
//                 checkArrNull(committees) ?

//                   <NotAvailText text="No Committees available yet!" />
//                   :
//                   committees.map((committee) => (
//                     <div
//                       key={committee._id}
//                       className="p-6 bg-white shadow-md rounded-lg border border-gray-200"
//                     >
//                       <h2 className="text-xl font-semibold">{committee.name}</h2>
//                       <p className="text-gray-600">{committee.description}</p>
//                       <p className="mt-2">
//                         <strong>Slots Available: </strong>
//                         {committee.maxMembers - committee.members.length} / {committee.maxMembers}
//                       </p>
//                       <div className="mt-4 flex items-center gap-4">
//                         {committee.status === "open" ? (
//                           <button
//                             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                             onClick={() => registerForCommittee(committee._id)}
//                           >
//                             Ask to join this committee
//                           </button>
//                         ) : (
//                           <span className="text-red-500 font-semibold">Committee Full</span>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//             </div>

//             <div className="mt-12">
//               <h2 className="text-xl font-bold">Admin Announcements</h2>
//               <div className="mt-4 space-y-4">
//                 {
//                   checkArrNull(committees
//                     .filter((committee) => committee.result.length > 0)) ?

//                     <NotAvailText text="No Committees Announcement available yet!" />
//                     :
//                     committees
//                       .filter((committee) => committee.result.length > 0)
//                       .map((committee) => (
//                         <div
//                           key={committee._id}
//                           className="p-4 bg-green-100 rounded-lg shadow-md border border-green-300"
//                         >
//                           <h3 className="font-semibold">
//                             {committee.name} - Results Announced
//                           </h3>
//                           <ul className="mt-2 list-disc pl-5">
//                             {committee.result.map((res) => (
//                               <li key={res.position}>
//                                 Position {res.position}: {res.member}
//                               </li>
//                             ))}
//                           </ul>
//                         </div>
//                       ))}
//               </div>
//             </div>
//           </>
//       }
//     </div>
//   );
// }

// OLD working work
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { checkArrNull } from "../utils/commonFunc";
// import NotAvailText from "../Components/NotAvailText";
// import MyCommittie from "./MyCommittie";
// import RefreshButton from "./RefreshButton";
// import { CommonData } from "../utils/data";
// import { toast } from "react-toastify";

// export default function MainPage() {
//   const [committees, setCommittees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [userLoggedIn, setUserLoggedIn] = useState(false);
//   const [myCommittie, setmyCommittie] = useState(false);
//   const [userLoggedData, setUserLoggedData] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userData = localStorage.getItem("member");
//     if (!token) {
//       setUserLoggedIn(false);
//       router.push("/login");
//     } else {
//       setUserLoggedIn(true);
//       setUserLoggedData(JSON.parse(userData));
//       fetchCommittees();
//     }
//   }, []);

//   const fetchCommittees = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/committee");
//       if (!res.ok) throw new Error("Failed to fetch committees");
//       const data = await res.json();
//       setCommittees(data);
//       setLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   console.log("userLoggedData", userLoggedData)
//   const registerForCommittee = async (committeeId) => {
//     try {
//       const res = await fetch('/api/member/assign-members', {
//         method: 'PATCH',
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ memberId: userLoggedData?._id, committeeId: committeeId }),
//         // body: JSON.stringify({ name: userLoggedData?.name, email: userLoggedData?.email }),
//       });
//       if (!res.ok) throw new Error("");
//       fetchCommittees()
//       alert("Registered successfully!");
//     } catch (err) {
//       console.log('err',err)
//       // toast.error("Failed to register !" + err?.error, { position: "bottom-center" });
//     }
//   };

//   if (loading) {
//     return <div className="flex justify-center items-center h-screen">Loading...</div>;
//   }

//   if (error) {
//     return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
//   }

//   if (!userLoggedIn) {
//     return <div>Redirecting to login...</div>;
//   }

//   function ApprovedMember(arr) {
//     return arr.filter((item) => item?.status == CommonData.status.approved)
//   }
//   const AlreadyJoined = (committeeId) => {
//     return committeeId == userLoggedData?.committee;
//   }
//   return (
//     <div className="container mx-auto px-6 py-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-800">
//           Welcome, {userLoggedData?.name}
//         </h1>
//         <button
//           onClick={() => {
//             localStorage?.clear();
//             setTimeout(() => {
//               router.push("/login");
//             }, 800);
//           }}
//           className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
//         >
//           Logout
//         </button>
//       </div>

//       <div className="flex gap-2 mb-6">
//         <button
//           onClick={() => setmyCommittie(false)}
//           className={`${!myCommittie && 'bg-green-500'} ${!myCommittie && 'text-white'} px-4 py-2 rounded-lg hover:bg-green-600`}
//         >
//           {"All Committees"}
//         </button>
//         <button
//           onClick={() => setmyCommittie(true)}
//           className={`${myCommittie && 'bg-green-500'} ${myCommittie && 'text-white'} px-4 py-2 rounded-lg hover:bg-green-600`}
//         >
//           {"See My Committees"}
//         </button>
//       </div>

//       {myCommittie ? (
//         <MyCommittie />
//       ) : (
//         <>
//           <h2 className="text-2xl font-semibold mb-6 text-gray-700">
//             Available Committees
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {checkArrNull(committees) ? (
//               <NotAvailText text="No Committees Available Yet!" />
//             ) : (
//               committees.map((committee) => (
//                 <div
//                   key={committee._id}
//                   className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow"
//                 >
//                   <h3 className="text-xl font-semibold text-gray-800">
//                     {committee.name}
//                   </h3>
//                   <p className="text-gray-600">{committee.description}</p>
//                   <p className="mt-2 text-gray-800">
//                     <strong>Slots Available:</strong>{" "}
//                     {committee.maxMembers - ApprovedMember(committee?.members)?.length} /{" "}
//                     {committee.maxMembers}
//                   </p>
//                   <div className="mt-4">
//                     {
//                       AlreadyJoined(committee?._id)
//                         ?
//                         <span className="text-red-500 font-semibold">
//                           Already Joined
//                         </span> :
//                         committee.maxMembers - ApprovedMember(committee?.members)?.length != 0 ? (
//                           <button
//                             className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
//                             onClick={() => registerForCommittee(committee._id)}
//                           >
//                             Join Committee
//                           </button>
//                         ) : (
//                           <span className="text-red-500 font-semibold">
//                             Committee Full
//                           </span>
//                         )}
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </>
//       )}
//       <div className="mt-12">
//         <div className="flex items-center gap-2 mb-6">
//           <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2">
//             Admin Announcements
//           </h2>
//           <RefreshButton
//             onClick={() => {
//               fetchCommittees();
//             }}
//           />
//         </div>
//         <div className="space-y-6">
//           {checkArrNull(committees.filter((committee) => committee.result.length > 0)) ? (
//             <NotAvailText text="No Committees Announcement available yet!" />
//           ) : (
//             committees
//               .filter((committee) => committee.result.length > 0)
//               .map((committee) => (
//                 <div
//                   key={committee._id}
//                   className="p-6 bg-gradient-to-r from-green-50 to-green-100 shadow-lg rounded-lg border border-green-200"
//                 >
//                   <h3 className="text-2xl font-semibold text-green-800 mb-3">
//                     {committee.name} - Results Announced
//                   </h3>
//                   <p className="text-sm text-gray-600 mb-4">
//                     <em>Congratulations to the following members for their positions!</em>
//                   </p>
//                   <ul className="list-disc pl-5 space-y-2">
//                     {committee.result.map((res) => (
//                       <li key={res?.position} className="text-lg text-gray-700">
//                         <span className="font-bold">Position {res?.position}:</span>{" "}
//                         <span className="text-green-700">{res?.member?.name}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               ))
//           )}
//         </div>
//       </div>

//     </div>
//   );
// }


export default function MainPage() {
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [myCommittie, setmyCommittie] = useState(false);
  const [userLoggedData, setUserLoggedData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("member");
    if (!token) {
      setUserLoggedIn(false);
      router.push("/login");
    } else {
      setUserLoggedIn(true);
      setUserLoggedData(JSON.parse(userData));
      fetchCommittees();
    }
  }, []);
  useEffect(() => {
    if (userLoggedData?._id) {
      fetchMemberById(userLoggedData?._id);
    }
  }, [userLoggedData?._id]);

  const fetchMemberById = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/member/${id}`);
      if (!res.ok) throw new Error("Failed to fetch committees");
      const data = await res.json();
      setUserLoggedData(data)
      localStorage.setItem("member", JSON.stringify(data));
      setLoading(false);
    } catch (err) {
      localStorage.clear();
      router.push('/login')
      // setError(err.message);
      setLoading(false);
    }
  };
  const fetchCommittees = async () => {
    setLoading(true);
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
      const res = await fetch("/api/member/assign-members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: userLoggedData?._id,
          committeeId: committeeId,
        }),
      });
      if (!res.ok) throw new Error("Failed to register");
      fetchMemberById(userLoggedData?._id);
      fetchCommittees();
      toast.success("Registered successfully!", { position: "bottom-center" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to register!", { position: "bottom-center" });
    }
  };

  const disapproveMember = async (committeeId) => {
    try {
      const res = await fetch("/api/member/disapprove-members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: userLoggedData?._id,
          committeeId: committeeId,
        }),
      });
      if (!res.ok) throw new Error("Failed to disapprove");
      fetchCommittees();
      toast.success("Disapproved successfully!", { position: "bottom-center" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to disapprove!", { position: "bottom-center" });
    }
  };
  // console.log("userLoggedData", userLoggedData)
  const isApprovedMember = (committeeId) => {
    return userLoggedData?.committees.some(
      (committee) =>
        committee.committee === committeeId
    );
  };
  const renderText = (committeeId) => {
    // Check if user is in the approved members list
    const isApproved = userLoggedData?.committees.some(
      (committee) => committee.committee === committeeId && committee.status === "approved"
    );

    if (isApproved) {
      return "Joined & Approved"
    }

    // Check if user is in the pending members list
    const isPending = userLoggedData?.committees.some(
      (committee) => committee.committee === committeeId && committee.status === "pending"
    );

    if (isPending) {
      return "Joined & Pending"
    }

    // Default status
    return "Join Committie"
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!userLoggedIn) {
    return <div>Redirecting to login...</div>;
  }

  const getButtonStyles = (committeeId) => {
    const status = renderText(committeeId); // Get the status of the committee

    if (status.includes("Approved")) {
      return {
        bgColor: 'bg-slate-500',
        hoverColor: 'hover:bg-slate-300'
      };
    }
    if (status.includes("Pending")) {
      return {
        bgColor: 'bg-orange-400',
        hoverColor: 'hover:bg-orange-300'
      };
    }
    return {
      bgColor: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-400'
    };
  };
  return (
    <>


      <div className="container mx-auto px-6 py-8 mt-10">


        <div className="flex justify-between items-center mb-8 p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg">
          <h1 className="text-xl md:text-3xl font-bold text-white">
            Welcome, <span className="text-lg font-medium">{userLoggedData?.name}</span>
          </h1>
          <button
            onClick={() => {
              localStorage?.clear();
              setTimeout(() => {
                router.push("/login");
              }, 800);
            }}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-200 transform hover:scale-105"
          >
            Logout
          </button>
        </div>

        <Notifications user={true}
          userId={userLoggedData?._id} />
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setmyCommittie(false)}
            className={`${!myCommittie && "bg-green-500"
              } ${!myCommittie && "text-white"} px-4 py-2 rounded-lg hover:bg-green-600`}
          >
            {"All Committees"}
          </button>
          <button
            onClick={() => setmyCommittie(true)}
            className={`${myCommittie && "bg-green-500"
              } ${myCommittie && "text-white"} px-4 py-2 rounded-lg hover:bg-green-600`}
          >
            {"See My Committees"}
          </button>
        </div>

        {myCommittie ? (
          <MyCommittie2 />
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">
              Available Committees
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
              {checkArrNull(committees) ? (
                <NotAvailText text="No Committees Available Yet!" />
              ) : (
                committees.map((committee) => (
                  // <div
                  //   key={committee._id}
                  //   className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow"
                  // >
                  //   <h3 className="text-xl font-semibold text-gray-800">
                  //     {committee.name}
                  //   </h3>
                  //   <p className="text-gray-600">{committee.description}</p>
                  //   <p className="mt-2 text-gray-800">
                  //     <strong>Slots Available:</strong>{" "}
                  //     {committee.maxMembers - committee.members.length} /{" "}
                  //     {committee.maxMembers}
                  //   </p>
                  //   <div className="mt-4">
                  //     <button
                  //       disabled={String(renderText(committee._id))?.includes('Joined')}
                  //       className={`text-white px-4 py-2 rounded-lg 
                  //         ${getButtonStyles(committee._id).bgColor} 
                  //         ${getButtonStyles(committee._id).hoverColor}`}
                  //       onClick={() => registerForCommittee(committee._id)}
                  //     >
                  //       {renderText(committee._id)}
                  //     </button>
                  //     {/* )} */}
                  //   </div>
                  // </div>
                  <div
                    key={committee._id}
                    className="mt-4  bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow relative"
                  >
                    <div className="absolute top-[-30px] left-0 bg-violet-100 text-violet-600 px-3 py-1 rounded-full text-sm font-semibold shadow">
                      Created by Organizer: {committee?.adminDetails?.name}
                    </div>
                    {
                      committee?.result?.length > 0 &&
                      <div className="absolute top-3 left-5  text-pink-700 px-3 py-1 rounded-full text-sm font-semibold ">
                        Result Announced
                      </div>
                    }
                    <div className="absolute top-3 right-4 bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold shadow">
                      Months Duration: {committee.monthDuration}
                    </div>
                    {/* Committee Header */}
                    <h3 className="text-xl font-semibold text-gray-800 my-2 mt-5">
                      {committee.name}
                    </h3>
                    <p className="text-gray-600 mb-2">{committee.description}</p>

                    {/* Slots Available */}

                    <p className="text-gray-800 mb-4">
                      <strong>Slots Available:</strong>{" "}
                      <span className="font-bold text-gray-700">
                        {committee.maxMembers - committee.members.length} / {committee.maxMembers}
                      </span>
                    </p>

                    {/* Start and End Dates */}
                    <div className="flex justify-between mb-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Start Date</p>
                        <p className="text-lg font-semibold text-gray-700">{moment(committee.startDate).format('MMMM YYYY')}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">End Date</p>
                        <p className="text-lg font-semibold text-gray-700">{moment(committee.endDate).format('MMMM YYYY')}</p>
                      </div>
                    </div>

                    {/* Monthly Amount and Total Amount */}
                    <div className="bg-blue-50 p-4 rounded-lg shadow-inner border border-blue-200 mb-4 text-center">
                      <p className="text-sm text-gray-500">Monthly Amount</p>
                      <p className="text-2xl font-bold text-blue-600">PKR. {formatMoney(committee.monthlyAmount)}</p>
                      <p className="text-sm text-gray-500 mt-2">Total Amount</p>
                      <p className="text-xl font-bold text-blue-700">
                        PKR. {formatMoney(committee.totalAmount)}
                      </p>
                    </div>

                    {/* Registration Button */}
                    <div className="mt-4">
                      <button
                        disabled={String(renderText(committee._id))?.includes("Joined")}
                        className={`text-white px-4 py-2 rounded-lg w-full
                      ${getButtonStyles(committee._id).bgColor} 
                      ${getButtonStyles(committee._id).hoverColor}`}
                        onClick={() => registerForCommittee(committee._id)}
                      >
                        {renderText(committee._id)}
                      </button>
                    </div>
                  </div>

                ))
              )}
            </div>
          </>
        )}


        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Committee Announcements</h2>

          <div className="space-y-4">
            {committees.map((committee) => {
              console.log("committee.results", committee?.result)
              return (
                checkArrNull(committee?.result) ? (
                  <NotAvailText text={"No Committees Announcements Yet! For:" + committee?.name} />
                ) :
                  committee?.result?.length > 0 && (
                    <div key={committee?._id} className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                      <h3 className="text-xl font-semibold text-gray-800">{committee?.name}</h3>
                      <p className="text-gray-600">{committee?.description}</p>

                      <h4 className="mt-4 text-lg font-semibold text-gray-700">Results: Announced at {moment(committee?.announcementDate).format("LLL")}</h4>
                      {committee?.result?.map((result) => (
                        <div key={result?._id} className="bg-green-200 p-4 rounded-lg mt-2 flex justify-between  ">
                          <p className="text-gray-600 max-w-[20px]">{result?.position}</p>
                          <h5 className="font-semibold text-gray-800">{result?.member?.name}</h5>
                          <p className="text-sm text-gray-500 hidden md:block">Posted on: {moment(result?.announcementDate).format("LT")}</p>
                        </div>
                      ))}
                    </div>
                  )
              )
            }
            )}
          </div>
        </div>
      </div>
    </>
  );
}
