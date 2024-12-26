"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GoBackButton from "@/app/components/GoBackButton";
import { toast } from "react-toastify";

export default function AdminRegister() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem("admin_token");
        if (!token) {
            router.push("/admin/login");  // Redirect to login page if no token
        } else {
        }
    }, []);
    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to register admin");
            }

            // On successful registration, redirect to admin login page or dashboard
            toast.success("Admin created successfully!", { position: "bottom-center" });
            router.push("/admin/login");
        } catch (err) {
            toast.error("Admin not!" + err, { position: "bottom-center" });
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className='flex items-center gap-2 mb-6' >
                <GoBackButton />
                <h1 className="text-3xl font-bold  text-center">Register New Admin</h1>
            </div>
            <form onSubmit={handleRegister} className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full"
                    />
                </div>

                {error && <div className="text-red-500 mb-4">{error}</div>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                >
                    {loading ? "Creating..." : "Create Admin"}
                </button>
            </form>
        </div>
    );
}
