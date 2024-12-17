"use client";

import { useState, useEffect } from "react";

export default function AddMember() {
  const [committees, setCommittees] = useState([]);
  const [selectedCommittee, setSelectedCommittee] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCommittees() {
      const res = await fetch("/api/committee");
      const data = await res.json();
      setCommittees(data);
    }
    fetchCommittees();
  }, []);

  const handleAddMember = async () => {
    setLoading(true);
    const res = await fetch("/api/member", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, committeeId: selectedCommittee }),
    });

    if (res.ok) {
      alert("Member added successfully!");
    } else {
      const error = await res.json();
      alert(`Failed to add member: ${error.error}`);
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Member</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddMember();
        }}
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Name</label>
          <input
            type="text"
            className="w-full border px-4 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Email</label>
          <input
            type="email"
            className="w-full border px-4 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Committee
          </label>
          <select
            className="w-full border px-4 py-2"
            value={selectedCommittee}
            onChange={(e) => setSelectedCommittee(e.target.value)}
            required
          >
            <option value="">Select a Committee</option>
            {committees.map((committee) => (
              <option key={committee._id} value={committee._id}>
                {committee.name} ({committee.members.length}/
                {committee.maxMembers})
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className={`bg-blue-500 text-white px-4 py-2 rounded ${
            loading && "opacity-50"
          }`}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Member"}
        </button>
      </form>
    </div>
  );
}
