'use client'

import { useEffect, useState } from 'react';
import { fetchCommittees, approveMember, deleteMember } from '../apis';
import { useRouter } from 'next/navigation';

export default function ManageMembers() {
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
    } else {
    }
  }, []);
  useEffect(() => {
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
    loadCommittees();
  }, []);

  const handleSelectCommittee = (committeeId) => {
    const committee = committees.find((c) => c._id === committeeId);
    setSelectedCommittee(committee);
  };

  // const handleApproveMember = async (memberId) => {
  //   try {
  //     await approveMember(selectedCommittee._id, memberId);
  //     const updatedCommittee = {
  //       ...selectedCommittee,
  //       members: selectedCommittee.members.map((m) =>
  //         m._id === memberId ? { ...m, status: 'approved' } : m
  //       ),
  //     };
  //     setSelectedCommittee(updatedCommittee);
  //   } catch (err) {
  //     alert('Failed to approve member');
  //   }
  // };

  const handleApproveMember = async (memberId) => {
    try {
      const response = await fetch('/api/member/approve', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: memberId,
          updates: { status: 'approved' },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve member');
      }

      const updatedMember = await response.json();
      alert(`Member ${updatedMember.name} approved successfully!`);

      // Update the UI state
      const updatedCommittee = {
        ...selectedCommittee,
        members: selectedCommittee.members.map((m) =>
          m._id === memberId ? { ...m, status: 'approved' } : m
        ),
      };
      setSelectedCommittee(updatedCommittee);
    } catch (err) {
      console.error(err.message);
      alert('Failed to approve member');
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    try {
      await deleteMember(memberId);
      const updatedCommittee = {
        ...selectedCommittee,
        members: selectedCommittee.members.filter((m) => m._id !== memberId),
      };
      setSelectedCommittee(updatedCommittee);
    } catch (err) {
      alert('Failed to remove member');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <div className='flex justify-between' >
        <h1 className="text-3xl font-bold mb-6">Manage Members</h1>
        <button
          onClick={() => router.push('/admin/addmember')}
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
          <h3 className="text-xl font-semibold mt-4">Members</h3>
          <ul className="space-y-4 mt-2">
            {selectedCommittee.members.map((member) => (
              <li
                key={member._id}
                className="bg-gray-100 p-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-sm text-gray-600">{member.email}</p>
                  <p
                    className={`text-sm mt-1 ${member.status === 'approved'
                      ? 'text-green-600'
                      : 'text-yellow-600'
                      }`}
                  >
                    {member.status === 'approved' ? 'Approved' : 'Pending'}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {member.status !== 'approved' && (
                    <button
                      onClick={() => handleApproveMember(member._id)}
                      className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteMember(member._id)}
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
