'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Committees() {
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function loadCommittees() {
      try {
        const res = await fetch('/api/committees');
        if (!res.ok) throw new Error('Failed to fetch committees');
        const data = await res.json();
        setCommittees(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadCommittees();
  }, []);

  const handleRegister = async (committeeId) => {
    const name = prompt('Enter your name:');
    const email = prompt('Enter your email:');
    if (!name || !email) return alert('Name and email are required to register.');

    try {
      const res = await fetch(`/api/members?id=${committeeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) throw new Error('Registration failed');
      alert('Successfully registered! Await admin approval.');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Committees</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {committees.map((committee) => (
          <div key={committee._id} className="bg-white shadow rounded p-4">
            <h2 className="text-xl font-semibold">{committee.name}</h2>
            <p className="text-gray-600">{committee.description}</p>
            <p className="mt-2">
              Slots: <span className="font-bold">{committee.members.length}</span> /{' '}
              <span className="font-bold">{committee.maxMembers}</span>
            </p>
            {committee.status === 'open' ? (
              <button
                onClick={() => handleRegister(committee._id)}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Register
              </button>
            ) : (
              <p className="mt-4 text-red-500">No Slots Available</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
