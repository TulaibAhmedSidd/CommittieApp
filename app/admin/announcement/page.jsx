'use client';

import { useEffect, useState } from 'react';
import NotAvailText from "@/app/Components/NotAvailText";
import { checkArrNull } from "@/app/utils/commonFunc";
import { useRouter } from 'next/navigation';
import GoBackButton from "../../Components/GoBackButton";

export default function AdminPage() {
    const [committees, setCommittees] = useState([]);
    const [selectedCommittee, setSelectedCommittee] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [previousResults, setPreviousResults] = useState([]);

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
            const committeeData = committees.find((committee) => committee._id === selectedCommittee);
            console.log("committeeData",committeeData)
            setPreviousResults(committeeData.result);
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
        <div className="container mx-auto p-6">
            <div className="flex items-center gap-2 mb-6">
                <GoBackButton />
                <h1 className="text-3xl font-bold ">Admin - Committee Announcements</h1>
            </div>

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
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-3"
                disabled={loading}
            >
                {loading ? 'Announcing...' : 'Announce Results'}
            </button>

            {/* Results Table */}
            {selectedCommittee && (
                <>
                    <div className="mt-6">
                        <h2 className="text-2xl font-semibold mb-2">Previously Announced Results</h2>
                        {previousResults.length > 0 ? (
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr>
                                        <th className="border p-2 bg-gray-200">Position</th>
                                        <th className="border p-2 bg-gray-200">Member ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {previousResults.map((result) => (
                                        <tr key={result.member._id}>
                                            <td className="border p-2 text-center">{result.position}</td>
                                            <td className="border p-2 text-center">{result.member.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <NotAvailText text="No results announced yet." />
                        )}
                    </div>

                    {/* Newly Announced Results */}
                    {results.length > 0 && (
                        <div className="mt-6">
                            <h2 className="text-2xl font-semibold mb-2">Newly Announced Results</h2>
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr>
                                        <th className="border p-2 bg-gray-200">Position</th>
                                        <th className="border p-2 bg-gray-200">Member ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((result) => (
                                        <tr key={result.member._id}>
                                            <td className="border p-2 text-center">{result.position}</td>
                                            <td className="border p-2 text-center">{result.member.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
