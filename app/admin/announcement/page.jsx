'use client';

import { useEffect, useState } from 'react';
import NotAvailText from "@/app/Components/NotAvailText";
import { checkArrNull } from "@/app/utils/commonFunc";

export default function AdminPage() {
    const [committees, setCommittees] = useState([]);
    const [selectedCommittee, setSelectedCommittee] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch all committees
    useEffect(() => {
        async function fetchCommittees() {
            try {
                const res = await fetch('/api/committee');
                const data = await res.json();
                setCommittees(data);
            } catch (err) {
                console.error('Error fetching committees:', err);
            }
        }
        fetchCommittees();
    }, []);

    // Handle announcement API call
    async function handleAnnounceResults() {
        if (!selectedCommittee) {
            setError('Please select a committee to announce results.');
            return;
        }
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/announcement', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ committeeId: selectedCommittee }),
            });

            const data = await res.json();
            if (res.ok) {
                setResults(data.result);
            } else {
                setError(data.error || 'Failed to announce results');
            }
        } catch (err) {
            console.error('Error announcing results:', err);
            setError('Failed to announce results');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Admin - Committee Announcements</h1>

            {/* Committee Selection */}
            <div className="mb-4">
                <label htmlFor="committee" className="block text-lg font-medium">
                    Select Committee
                </label>
                <select
                    id="committee"
                    value={selectedCommittee}
                    onChange={(e) => setSelectedCommittee(e.target.value)}
                    className="w-full border p-2 rounded"
                >
                    <option value="">-- Select Committee --</option>
                    {committees.map((committee) => (
                        <option key={committee._id} value={committee._id}>
                            {committee.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Announce Button */}
            <button
                onClick={handleAnnounceResults}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={loading}
            >
                {loading ? 'Announcing...' : 'Announce Results'}
            </button>

            {/* Results Table */}
            {

                checkArrNull(results) ? (
                    <NotAvailText text="No Members available yet!" />
                ) :
                    results.length > 0 && (
                        <div className="mt-6">
                            <h2 className="text-2xl font-semibold mb-2">Results</h2>
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr>
                                        <th className="border p-2 bg-gray-200">Position</th>
                                        <th className="border p-2 bg-gray-200">Member ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((result) => (
                                        <tr key={result.member}>
                                            <td className="border p-2 text-center">{result.position}</td>
                                            <td className="border p-2 text-center">{result.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
        </div>
    );
}
