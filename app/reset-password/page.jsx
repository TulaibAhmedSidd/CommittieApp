'use client'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function ResetPassword(params) {
    const router = useRouter();
    const token = params?.searchParams?.token;
    console.log("params", params)
    console.log("token", token)
    //   const { token } = router.query; // Get token from the query string
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords don't match", {
                position: "bottom-center",
            });
            return;
        }

        setLoading(true);

        try {
            // Call your API to reset the password with the token and new password
            const response = await fetch('/api/member/reset-password', {
                method: 'POST',
                body: JSON.stringify({ token, password }),
                headers: { 'Content-Type': 'application/json' },
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('Password reset successful', {
                    position: 'bottom-center',
                });
                router.push('/login'); // Redirect to login page
            } else {
                toast.error(result.error, {
                    position: 'bottom-center',
                });
            }
        } catch (err) {
            toast.error('Error resetting password', {
                position: 'bottom-center',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[100vh] flex justify-center items-center ">
            <div className=" flex-col  max-w-lg mx-auto p-6 bg-white shadow rounded">
                <h1 className="text-2xl font-bold mb-4">Reset Your Password</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-semibold">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded px-4 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded px-4 py-2"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        disabled={loading}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}
