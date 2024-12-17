'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchCommittees, deleteCommittee } from './apis';

export default function Committiee() {
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this committee?')) return;
    try {
      await deleteCommittee(id);
      setCommittees(committees.filter((committee) => committee._id !== id));
    } catch (err) {
      alert('Failed to delete committee');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className='flex gap-1'>
        <Link href="/admin/create">
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Create New Committee
          </button>
        </Link>
        <Link href="/admin/announcement">
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Announcement
          </button>
        </Link>
        </div>
      </div>
      <ul className="space-y-4">
        {committees.map((committee) => (
          <li
            key={committee._id}
            className="bg-gray-100 p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <h3 className="text-xl font-semibold">{committee.name}</h3>
              <p>{committee.description}</p>
            </div>
            <div className="flex space-x-2">
              <Link href={`/admin/edit?id=${committee._id}`}>
                <button className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">
                  Edit
                </button>
              </Link>
              <button
                onClick={() => handleDelete(committee._id)}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
