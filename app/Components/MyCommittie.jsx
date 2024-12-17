"use client";

import { useEffect, useState } from "react";

export default function MyCommittie() {
    const [committees, setCommittees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [userId, setUserId] = useState(null); // Replace this with the actual user ID, e.g., from a login state

    useEffect(() => {
        // Check if user is logged in
        // const token = localStorage.getItem("token");
        let userData = localStorage.getItem("member");
        userData = JSON.parse(userData)
        if (userData) setUserId(userData?._id)
        //   setUserLoggedIn(false);
        //   router.push("/login");  // Redirect to login page if no token
        // } else {
        // }
    }, []);
    async function fetchCommittees() {
        try {
            const res = await fetch("/api/member/my-committie", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });

            if (!res.ok) throw new Error("Failed to fetch committees");
            const data = await res.json();
            setCommittees(data.committees);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchCommittees();
    }, [userId]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">My Committees</h1>

            {committees.length === 0 ? (
                <div>No committees found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {committees.map((member) => (
                        <div
                            key={member._id}
                            className="p-6 bg-white shadow-md rounded-lg border border-gray-200"
                        >
                            <h2 className="text-xl font-semibold">{member.committee.name}</h2>
                            <p className="text-gray-600">{member.committee.description}</p>
                            <p className="mt-2">
                                <strong>Status: </strong>
                                <span
                                    className={`${member.status === "approved"
                                        ? "text-green-500"
                                        : member.status === "rejected"
                                            ? "text-red-500"
                                            : "text-yellow-500"
                                        } font-semibold`}
                                >
                                    {member.status}
                                </span>
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
