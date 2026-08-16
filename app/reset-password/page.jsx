'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Card from '../Components/Theme/Card';
import Button from '../Components/Theme/Button';
import Input from '../Components/Theme/Input';
import { FiLock, FiKey } from 'react-icons/fi';

export default function ResetPassword(params) {
    const router = useRouter();
    const token = params?.searchParams?.token;
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
                router.push('/login');
            } else {
                toast.error(result.error || 'Failed to reset password', {
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
        <div className="min-h-screen flex justify-center items-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
            <Card className="w-full max-w-md p-8 md:p-10 shadow-2xl border-slate-200/80 dark:border-slate-800 backdrop-blur-xl">
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-xl shadow-primary-500/20 mb-4">
                        <FiKey size={28} />
                    </div>
                    <span className="eyebrow mb-2">Account Security</span>
                    <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">Reset Your Password</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                        Enter your new password below to regain access to your account.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        label="New Password"
                        icon={FiLock}
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Input
                        label="Confirm Password"
                        icon={FiLock}
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <Button
                        type="submit"
                        disabled={loading}
                        loading={loading}
                        variant="primary"
                        size="lg"
                        className="w-full mt-4"
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
