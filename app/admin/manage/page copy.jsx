"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiEdit2, FiTrash2, FiUserCheck, FiUserX, FiShield, FiMail, FiUser, FiMoreVertical, FiCheck, FiX } from "react-icons/fi";
import Card from "../../Components/Theme/Card";
import Button from "../../Components/Theme/Button";
import Input from "../../Components/Theme/Input";
import { toast } from "react-toastify";

export default function AdminManagementPage() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [editForm, setEditForm] = useState({ name: "", email: "", phone: "" });
    const router = useRouter();

    useEffect(() => {
        const adminDetail = localStorage.getItem("admin_detail");
        if (!adminDetail) {
            router.push("/admin/login");
            return;
        }
        const admin = JSON.parse(adminDetail);
        if (!admin.isSuperAdmin) {
            router.push("/admin");
            return;
        }
        fetchAdmins();
    }, [router]);

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/manage");
            const data = await res.json();
            setAdmins(data);
        } catch (err) {
            toast.error("Failed to fetch administrators");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (adminId, action) => {
        if (!confirm(`Are you sure you want to ${action} this admin?`)) return;

        setActionLoading(adminId);
        try {
            const res = await fetch("/api/admin/manage", {
                method: action === "delete" ? "DELETE" : "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    adminId,
                    updateData: action === "approve" ? { status: "approved" } : {}
                })
            });

            if (!res.ok) throw new Error(`${action} failed`);

            toast.success(`Admin ${action}ed successfully`);
            fetchAdmins();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setActionLoading(null);
        }
    };

    const startEdit = (admin) => {
        setEditingAdmin(admin._id);
        setEditForm({ name: admin.name, email: admin.email, phone: admin.phone || "" });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setActionLoading(editingAdmin);
        try {
            const res = await fetch("/api/admin/manage", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ adminId: editingAdmin, updateData: editForm })
            });

            if (!res.ok) throw new Error("Update failed");

            toast.success("Admin updated successfully");
            setEditingAdmin(null);
            fetchAdmins();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return (
        <div className="p-12 text-center text-slate-400 font-black uppercase tracking-widest animate-pulse">
            Syncing Command Personnel...
        </div>
    );

    return (
        <div className="p-8 md:p-12 space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                        Command <span className="text-primary-600">Personnel</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Manage all administrators and permissions</p>
                </div>
            </div>

            <div className="overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] shadow-premium border border-slate-100 dark:border-slate-800">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50">
                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Admin Identity</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Specialization</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Operational Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {admins.map((admin) => (
                            <tr key={admin._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="p-6">
                                    {editingAdmin === admin._id ? (
                                        <div className="space-y-3 max-w-xs">
                                            <Input
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                placeholder="Name"
                                                className="text-xs"
                                            />
                                            <Input
                                                value={editForm.email}
                                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                                placeholder="Email"
                                                className="text-xs"
                                            />
                                            <Input
                                                value={editForm.phone}
                                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                                placeholder="Phone"
                                                className="text-xs"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-600/10 text-primary-600 flex items-center justify-center font-black">
                                                {admin.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{admin.name}</p>
                                                <p className="text-xs text-slate-500 font-mono italic">{admin.email}</p>
                                                {admin.phone && <p className="text-[10px] text-primary-600 font-bold mt-1 tracking-widest">{admin.phone}</p>}
                                            </div>
                                        </div>
                                    )}
                                </td>
                                <td className="p-6">
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${admin.isSuperAdmin ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-500' : 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-500'}`}>
                                        <FiShield size={10} />
                                        {admin.isSuperAdmin ? 'Super Admin' : 'Organizer'}
                                    </div>
                                </td>
                                <td className="p-6">
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${admin.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-500' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                                        {admin.status === 'approved' ? <FiCheck size={10} /> : <FiX size={10} />}
                                        {admin.status}
                                    </div>
                                </td>
                                <td className="p-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        {editingAdmin === admin._id ? (
                                            <>
                                                <Button
                                                    onClick={handleUpdate}
                                                    loading={actionLoading === admin._id}
                                                    className="p-3 bg-green-600"
                                                >
                                                    <FiCheck />
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => setEditingAdmin(null)}
                                                    className="p-3 bg-red-500/10 text-red-500 border-red-500/20"
                                                >
                                                    <FiX />
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                {admin.status === 'pending' && (
                                                    <Button
                                                        onClick={() => handleAction(admin._id, "approve")}
                                                        loading={actionLoading === admin._id}
                                                        className="p-3 bg-primary-600"
                                                        title="Approve"
                                                    >
                                                        <FiUserCheck />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => startEdit(admin)}
                                                    className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-none"
                                                    title="Edit"
                                                >
                                                    <FiEdit2 />
                                                </Button>
                                                {!admin.isSuperAdmin && (
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() => handleAction(admin._id, "delete")}
                                                        loading={actionLoading === admin._id}
                                                        className="p-3 bg-red-500/10 text-red-500 border-red-500/20"
                                                        title="Delete"
                                                    >
                                                        <FiTrash2 />
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
