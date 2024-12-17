'use client'

import { useEffect, useState } from 'react';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch('/api/committees');
        if (!res.ok) throw new Error('Failed to fetch announcements');
        const data = await res.json();
        const withResults = data.filter((c) => c.result.length > 0);
        setAnnouncements(withResults);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Committee Announcements</h1>
      {announcements.length === 0 ? (
        <p>No announcements available yet.</p>
      ) : (
        announcements.map((announcement) => (
          <div key={announcement._id} className="bg-gray-100 p-4 rounded shadow mb-4">
            <h2 className="text-xl font-semibold">{announcement.name}</h2>
            <p className="text-gray-600">{announcement.description}</p>
            <h3 className="mt-4 text-lg font-semibold">Results:</h3>
            <ul className="mt-2 space-y-2">
              {announcement.result.map((entry) => (
                <li key={entry.member} className="text-gray-800">
                  <span className="font-bold">#{entry.position}:</span>{' '}
                  {announcement.members.find((m) => m._id === entry.member)?.name || 'Unknown'}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
