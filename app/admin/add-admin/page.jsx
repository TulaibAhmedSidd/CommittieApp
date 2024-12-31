'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import GoBackButton from '@/app/Components/GoBackButton';

export default function AddAdmin() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const router = useRouter();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        try {
            // Replace this with your API call
            const response = await fetch('/api/admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add admin');
            }

            setSuccessMessage('Admin added successfully!');
            setFormData({ name: '', email: '', password: '' });
        } catch (err) {
            setError(err.message);
        }
    };
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login"); // Redirect to login page if no token
    } else {
    }
  }, []);
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                <div className='flex items-center gap-2 mb-4' >
                    <GoBackButton />
                    <h1 className="text-2xl font-semibold text-center text-gray-800 ">
                        Add New Committee Organizer
                    </h1>
                </div>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter full name"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter email address"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-200"
                    >
                        Add Organizer
                    </button>
                </form>
                <button
                    onClick={() => router.push('/admin')}
                    className="mt-4 w-full bg-gray-500 text-white py-2 rounded-md shadow-md hover:bg-gray-600 transition duration-200"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
