// "use client";

// import { useEffect, useState } from "react";
// import {
//   fetchCommittees,
//   approveMember,
//   deleteMember,
//   fetchCommitteebyId,
// } from "../apis";
// import { usePathname, useRouter } from "next/navigation";
// import GoBackButton from "../../Components/GoBackButton";
// import RefreshButton from "../../Components/RefreshButton";
// import { toast } from "react-toastify";

// export default function MembersListing() {
//   const [committees, setCommittees] = useState([]);
//   const [selectedCommittee, setSelectedCommittee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const router = useRouter();
//   useEffect(() => {
//     // Check if user is logged in
//     const token = localStorage.getItem("admin_token");
//     if (!token) {
//       router.push("/admin/login"); // Redirect to login page if no token
//     } else {
//     }
//   }, []);
//   async function loadCommittees() {
//     try {
//       const data = await fetchCommittees();
//       setCommittees(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }
//   async function loadCommitteById(id) {
//     try {
//       const data = await fetchCommitteebyId(id);
//       // setCommittees([data]);
//       setSelectedCommittee(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }
//   useEffect(() => {
//     loadCommittees();
//   }, []);

//   const handleSelectCommittee = (committeeId) => {
//     const committee = committees.find((c) => c._id === committeeId);
//     setSelectedCommittee(committee);
//   };

//   // const handleApproveMember = async (memberId) => {
//   //   try {
//   //     await approveMember(selectedCommittee._id, memberId);
//   //     const updatedCommittee = {
//   //       ...selectedCommittee,
//   //       members: selectedCommittee.pendingMembers.map((m) =>
//   //         m._id === memberId ? { ...m, status: 'approved' } : m
//   //       ),
//   //     };
//   //     setSelectedCommittee(updatedCommittee);
//   //   } catch (err) {
//   //       toast.success("Successfully registered!", { position: "bottom-center" });

//   // alert('Failed to approve member');
//   //   }
//   // };

//   const handleApproveMember = async (memberId) => {
//     try {
//       const response = await fetch("/api/member/approve", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           memberId: memberId,
//           updates: { status: "approved" },
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to approve member");
//       }

//       const updatedMember = await response.json();
//       toast.success("Successfully registered!", { position: "bottom-center" });

//       // Update the UI state
//       const updatedCommittee = {
//         ...selectedCommittee,
//         members: selectedCommittee.pendingMembers.map((m) =>
//           m._id === memberId ? { ...m, status: "approved" } : m
//         ),
//       };
//       setSelectedCommittee(updatedCommittee);
//     } catch (err) {
//       console.error(err.message);
//       toast.error("Failed to approve member !", { position: "bottom-center" });
//     }
//   };
//   const routerPath = usePathname();
//   const handleDeleteMember = async (memberId) => {
//     if (!confirm("Are you sure you want to remove this member?")) return;
//     try {
//       await deleteMember(memberId);
//       const updatedCommittee = {
//         ...selectedCommittee,
//         members: selectedCommittee.pendingMembers.filter((m) => m._id !== memberId),
//       };
//       setSelectedCommittee(updatedCommittee);
//     } catch (err) {
//       toast.error("Failed to remove member!", { position: "bottom-center" });
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p className="text-red-500">Error: {error}</p>;

//   return (
//     <div className="">
//       <div className="flex justify-between">
//         <div className="flex items-center gap-2 mb-6">
//           {routerPath?.includes("assign-member") ? "" : <GoBackButton />}
//           <h1 className="text-3xl font-bold ">Manage Members</h1>
//         </div>
//         <button
//           onClick={() => router.push("/admin/addmember")}
//           className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
//         >
//           Add member
//         </button>
//       </div>
//       <div className="space-y-4">
//         <label className="block">
//           <span className="font-semibold">Select a Committee</span>
//           <select
//             className="block w-full mt-2 border-gray-300 rounded px-4 py-2"
//             onChange={(e) => handleSelectCommittee(e.target.value)}
//             defaultValue=""
//           >
//             <option value="" disabled>
//               -- Choose a committee --
//             </option>
//             {committees.map((committee) => (
//               <option key={committee._id} value={committee._id}>
//                 {committee.name}
//               </option>
//             ))}
//           </select>
//         </label>
//       </div>

//       {selectedCommittee && (
//         <div className="mt-6">
//           <h2 className="text-2xl font-semibold">{selectedCommittee.name}</h2>
//           <p className="text-gray-600">{selectedCommittee.description}</p>
//           <div className="mt-4 flex gap-2 items-center">
//             <h3 className="text-xl font-semibold ">
//               {selectedCommittee?.members?.length} - Members
//             </h3>
//             <RefreshButton
//               onClick={() => {
//                 loadCommitteById(selectedCommittee?._id);
//               }}
//             />
//           </div>

//           <ul className="space-y-4 mt-2">
//             {selectedCommittee.pendingMembers.map((member) => (
//               <li
//                 key={member._id}
//                 className="bg-gray-100 p-4 rounded shadow flex justify-between items-center"
//               >
//                 <div>
//                   <p className="font-semibold">{member.name}</p>
//                   <p className="text-sm text-gray-600">{member.email}</p>
//                   <p
//                     className={`text-sm mt-1 ${
//                       member.status === "approved"
//                         ? "text-green-600"
//                         : "text-yellow-600"
//                     }`}
//                   >
//                     {member.status === "approved" ? "Approved" : "Pending"}
//                   </p>
//                 </div>
//                 <div className="flex space-x-2">
//                   {member.status !== "approved" && (
//                     <button
//                       onClick={() => handleApproveMember(member._id)}
//                       className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
//                     >
//                       Approve
//                     </button>
//                   )}
//                   <button
//                     onClick={() => handleDeleteMember(member._id)}
//                     className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import {
  fetchCommittees,
  approveMember,
  deleteMember,
  fetchCommitteebyId,
} from "../apis";
import { usePathname, useRouter } from "next/navigation";
import GoBackButton from "../../Components/GoBackButton";
import RefreshButton from "../../Components/RefreshButton";
import { toast } from "react-toastify";
import NotAvailText from "@/app/Components/NotAvailText";
import { checkArrNull } from "@/app/utils/commonFunc";

export default function MembersListing() {
  const [committees, setCommittees] = useState([]);
  const [selectedCommittee, setSelectedCommittee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login"); // Redirect to login page if no token
    }
  }, []);

  async function loadCommittees() {
    try {
      const data = await fetchCommittees();
      setCommittees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadCommitteById(id) {
    try {
      const data = await fetchCommitteebyId(id);
      setSelectedCommittee(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCommittees();
  }, []);

  const handleSelectCommittee = (committeeId) => {
    const committee = committees.find((c) => c._id === committeeId);
    setSelectedCommittee(committee);
  };

  const handledisApproveMemberdisapprove = async (memberId) => {
    try {
      const response = await fetch("/api/member/disapprove", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: memberId,
          updates: { status: "approved" },
          committeeId: selectedCommittee._id, // Send the committee ID
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to approve member");
      }

      const updatedMember = await response.json();
      toast.success("Successfully approved member!", {
        position: "bottom-center",
      });

      // Update the UI state
      const updatedCommittee = {
        ...selectedCommittee,
        members: selectedCommittee.pendingMembers.filter(
          (m) => m._id !== memberId
        ), // Remove from pending members
        pendingMembers: selectedCommittee.pendingMembers
          .filter((m) => m._id !== memberId)
          .map((m) => (m._id === memberId ? { ...m, status: "approved" } : m)), // Mark as approved
      };

      setSelectedCommittee(updatedCommittee);
      loadCommitteById(selectedCommittee?._id);
    } catch (err) {
      console.error(err.message);
      toast.error("Failed to approve member!", { position: "bottom-center" });
    }
  };
  const handledisApproveMember = async (memberId) => {
    try {
      const response = await fetch("/api/member/unassign-member", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: memberId,
          updates: { status: "approved" },
          committeeId: selectedCommittee._id, // Send the committee ID
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to approve member");
      }

      const updatedMember = await response.json();
      toast.success("Successfully approved member!", {
        position: "bottom-center",
      });

      // Update the UI state
      const updatedCommittee = {
        ...selectedCommittee,
        members: selectedCommittee.pendingMembers.filter(
          (m) => m._id !== memberId
        ), // Remove from pending members
        pendingMembers: selectedCommittee.pendingMembers
          .filter((m) => m._id !== memberId)
          .map((m) => (m._id === memberId ? { ...m, status: "approved" } : m)), // Mark as approved
      };

      setSelectedCommittee(updatedCommittee);
      loadCommitteById(selectedCommittee?._id);
    } catch (err) {
      console.error(err.message);
      toast.error("Failed to approve member!", { position: "bottom-center" });
    }
  };
  const handleApproveMember = async (memberId) => {
    try {
      const response = await fetch("/api/member/approve", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: memberId,
          updates: { status: "approved" },
          committeeId: selectedCommittee._id, // Send the committee ID
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to approve member");
      }

      const updatedMember = await response.json();
      toast.success("Successfully approved member!", {
        position: "bottom-center",
      });

      // Update the UI state
      const updatedCommittee = {
        ...selectedCommittee,
        members: selectedCommittee.pendingMembers.filter(
          (m) => m._id !== memberId
        ), // Remove from pending members
        pendingMembers: selectedCommittee.pendingMembers
          .filter((m) => m._id !== memberId)
          .map((m) => (m._id === memberId ? { ...m, status: "approved" } : m)), // Mark as approved
      };

      setSelectedCommittee(updatedCommittee);
      loadCommitteById(selectedCommittee?._id);
    } catch (err) {
      console.error(err.message);
      toast.error("Failed to approve member!", { position: "bottom-center" });
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    try {
      await deleteMember(memberId);
      const updatedCommittee = {
        ...selectedCommittee,
        members: selectedCommittee.pendingMembers.filter(
          (m) => m._id !== memberId
        ),
      };
      setSelectedCommittee(updatedCommittee);
    } catch (err) {
      toast.error("Failed to remove member!", { position: "bottom-center" });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="">
      <div className="flex justify-between">
        <div className="flex items-center gap-2 mb-6">
          {usePathname()?.includes("assign-member") ? "" : <GoBackButton />}
          <h1 className="text-3xl font-bold ">Manage Members</h1>
        </div>
        <button
          onClick={() => router.push("/admin/addmember")}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Add member
        </button>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="font-semibold">Select a Committee</span>
          <select
            className="block w-full mt-2 border-gray-300 rounded px-4 py-2"
            onChange={(e) => handleSelectCommittee(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>
              -- Choose a committee --
            </option>
            {committees.map((committee) => (
              <option key={committee._id} value={committee._id}>
                {committee.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {selectedCommittee && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold">{selectedCommittee.name}</h2>
          <p className="text-gray-600">{selectedCommittee.description}</p>
          <div className="mt-4 flex gap-2 items-center">
            <h3 className="text-xl font-semibold">
              {selectedCommittee?.members?.length} - Approved Members
            </h3>
            <RefreshButton
              onClick={() => {
                loadCommitteById(selectedCommittee?._id);
                loadCommittees();
              }}
            />
          </div>

          {/* Pending Members */}
          <ul className="space-y-4 mt-2">
            <h3 className="text-xl font-semibold">Pending Members</h3>
            {checkArrNull(selectedCommittee.pendingMembers) ? (
              <NotAvailText text="No Pending Members Yet!" />
            ) : (
              selectedCommittee.pendingMembers.map((member) => (
                <li
                  key={member._id}
                  className="bg-gray-100 p-4 rounded shadow flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.email}</p>
                    <p
                      className={`text-sm mt-1 ${
                        member.status === "approved"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {member.status === "approved" ? "Approved" : "Pending"}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApproveMember(member._id)}
                      className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                    {/* <button
                      onClick={() => handleDeleteMember(member._id)}
                      className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                    >
                      Remove
                    </button> */}
                  </div>
                </li>
              ))
            )}
          </ul>

          {/* Approved Members */}
          <ul className="space-y-4 mt-2">
            <h3 className="text-xl font-semibold">Approved Members</h3>
            {checkArrNull(selectedCommittee.members) ? (
              <NotAvailText text="No Approved Members Yet!" />
            ) : (
              selectedCommittee.members.map((member) => (
                <li
                  key={member._id}
                  className="bg-gray-100 p-4 rounded shadow flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.email}</p>
                    <p className={`text-sm mt-1 ${"text-green-600"}`}>
                      Approved
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        handledisApproveMemberdisapprove(member._id)
                      }
                      className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                    >
                      Un Approve
                    </button>
                    <button
                      onClick={() => handledisApproveMember(member._id)}
                      className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                    >
                      Unassign from Committie
                    </button>
                    {/* <button
                      onClick={() => handleDeleteMember(member._id)}
                      className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                    >
                      Remove
                    </button> */}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
