"use client";

import GoBackButton from "../../Components/GoBackButton";
import NotAvailText from "../../Components/NotAvailText";
import { checkArrNull } from "@/app/utils/commonFunc";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

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
      toast.error("Member eeoor!" + err.message, { position: "bottom-center" });
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
        body: JSON.stringify({
          name,
          email: email?.toLowerCase(),
          password: Password,
          committees: [],
        }),
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
      toast.success(
        editingId ? "Member updated successfully" : "Member added successfully",
        {
          position: "bottom-center",
        }
      );
      setName("");
      setEmail("");
      setPassword("");
      setEditingId(null);
      fetchMembers(); // Refetch members after adding or updating
    } catch (err) {
      toast.error("Member eeoor!" + err.message, { position: "bottom-center" });
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
      toast.success("Member deleted successfully!", {
        position: "bottom-center",
      });
      fetchMembers(); // Refetch members after deletion
    } catch (err) {
      toast.error("Member eeoor!" + err.message, { position: "bottom-center" });
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
    <div className="container mt-20 mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <GoBackButton />
        <h1 className="text-3xl font-semibold text-gray-800">
          {editingId ? "Edit Member" : "Add Member"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <div>
          <label
            htmlFor="name"
            className="block text-lg font-semibold text-gray-700 mb-2"
          >
            Member Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter member's name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-lg font-semibold text-gray-700 mb-2"
          >
            Member Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter member's password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={editingId ? true : false}
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={!editingId}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-lg font-semibold text-gray-700 mb-2"
          >
            Member Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter member's email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {editingId ? "Update Member" : "Add Member"}
        </button>
      </form>

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Existing Members
      </h2>

      <div className="space-y-6">
        {members && members.length === 0 ? (
          <NotAvailText text="No Members available yet!" />
        ) : (
          members.map((member) => (
            <div
              key={member._id}
              className="flex justify-between items-center p-4 border border-gray-200 rounded-lg shadow-sm"
            >
              <div>
                <p className="font-semibold text-gray-800">{member.name}</p>
                <p className="text-gray-600">{member.email}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(member)}
                  className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(member._id)}
                  className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
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
