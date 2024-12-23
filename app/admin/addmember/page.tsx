"use client";

import GoBackButton from "@/app/components/GoBackButton";
import NotAvailText from "@/app/Components/NotAvailText";
import { checkArrNull } from "@/app/utils/commonFunc";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
// import { fetchMembers } from "../apis";

// export default function AddMember() {
//   const [committees, setCommittees] = useState([]);
//   const [selectedCommittee, setSelectedCommittee] = useState("");
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);

//   async function fetchCommittees() {
//     const res = await fetch("/api/committee");
//     const data = await res.json();
//     setCommittees(data);
//   }
//   useEffect(() => {
//     fetchCommittees();
//   }, []);

//   const handleAddMember = async () => {
//     setLoading(true);
//     const res = await fetch("/api/member", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name, email, committeeId: selectedCommittee }),
//     });

//     if (res.ok) {
//     //   alert("Member added successfully!");
//       setSelectedCommittee("");
//       setName("");
//       setEmail("");
//       fetchCommittees();
//     } else {
//       const error = await res.json();
//     //   alert(`Failed to add member: ${error.error}`);
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Add New Member</h1>
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           handleAddMember();
//         }}
//       >
//         <div className="mb-4">
//           <label className="block text-gray-700 font-bold mb-2">Name</label>
//           <input
//             type="text"
//             className="w-full border px-4 py-2"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 font-bold mb-2">Email</label>
//           <input
//             type="email"
//             className="w-full border px-4 py-2"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 font-bold mb-2">
//             Committee
//           </label>
//           <select
//             className="w-full border px-4 py-2"
//             value={selectedCommittee}
//             onChange={(e) => setSelectedCommittee(e.target.value)}
//             required
//           >
//             <option value="">Select a Committee</option>
//             {committees.map((committee) => (
//               <option key={committee._id} value={committee._id}>
//                 {committee.name} ({committee.members.length}/
//                 {committee.maxMembers})
//               </option>
//             ))}
//           </select>
//         </div>
//         <button
//           type="submit"
//           className={`bg-blue-500 text-white px-4 py-2 rounded ${
//             loading && "opacity-50"
//           }`}
//           disabled={loading}
//         >
//           {loading ? "Adding..." : "Add Member"}
//         </button>
//       </form>
//     </div>
//   );
// }

export default function AddMembers() {
  const [name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [members, setMembers] = useState([]);
  const [editingId, setEditingId] = useState(null); // Track the ID of the member being edited

  // Fetch all members from the backend
  async function fetchMembers() {
    try {
      const response = await fetch("/api/member");
      if (!response.ok) throw new Error("Failed to fetch members");
      const data = await response.json();
      setMembers(data);
    } catch (err) {
      alert(err.message);
    }
  }
  useEffect(() => {
    fetchMembers();
  }, []);

  // Handle form submission (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/member/${editingId}` : "/api/member"; // Edit if editingId is present
      const method = editingId ? "PUT" : "POST"; // Use PUT for edit, POST for create
      const response = await fetch(url, {
        method,
        body: JSON.stringify({ name, email, password: Password }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok)
        throw new Error(
          editingId ? "Failed to update member" : "Failed to add member"
        );

      // On success, reset fields and refetch members
      //   if (response.ok) {
      //     fetchMembers(); // Refetch members after adding or updating
      //   }
      alert(
        editingId ? "Member updated successfully" : "Member added successfully"
      );
      setName("");
      setEmail("");
      setPassword("");
      setEditingId(null);
      fetchMembers(); // Refetch members after adding or updating
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle edit button click
  const handleEdit = (member) => {
    setName(member.name);
    // setPassword(member.password);
    setEmail(member.email);
    setEditingId(member._id); // Set the ID of the member being edited
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/member/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete member");
      alert("Member deleted successfully");
      fetchMembers(); // Refetch members after deletion
    } catch (err) {
      alert(err.message);
    }
  };
  const router = useRouter();
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login"); // Redirect to login page if no token
    } else {
    }
  }, []);
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-2 mb-6">
        <GoBackButton />
        <h1 className="text-2xl font-bold ">Add / Edit Member</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <label className="mt-3" htmlFor="name">
          Member Name
        </label>
        <input
          type="text"
          name="name"
          placeholder="Member Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <label className="mt-3" htmlFor="Password">
          Member Password
        </label>
        <input
          type="password"
          name={"Password"}
          disabled={editingId ? true : false}
          placeholder="Password"
          value={Password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full"
          required={editingId ? false : true}
        />
        <label className="mt-3" htmlFor="email">
          Member Email
        </label>
        <input
          type="email"
          name={"email"}
          placeholder="Member Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          {editingId ? "Update Member" : "Add Member"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-4">Existing Members</h2>
      <div className="space-y-4">
        {checkArrNull(members) ? (
          <NotAvailText text="No Members available yet!" />
        ) : (
          members.map((member) => (
            <div
              key={member._id}
              className="flex justify-between items-center p-4 border border-gray-300 rounded"
            >
              <div>
                <p className="font-semibold">{member.name}</p>
                <p>{member.email}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(member)}
                  className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(member._id)}
                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
