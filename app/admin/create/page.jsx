'use client'
import { useState } from 'react';
import { createCommittee } from '../apis';
import { useRouter } from 'next/navigation';

export default function CreateCommittee() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: '', description: '', maxMembers: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createCommittee(formData);
            router.push('/admin');
        } catch (err) {
            alert('Failed to create committee');
        }
    };

    return (
        <div className="min-h-[100vh] flex justify-center items-center ">
            <div className=" min-w-[70vw] max-w-3xl mx-auto p-6 bg-white shadow rounded">
                <h1 className="text-2xl font-bold mb-4">Create Committee</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-semibold">Committee Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Committee Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-4 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold">Description</label>
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-4 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold">Max Members</label>
                        <input
                            type="number"
                            name="maxMembers"
                            placeholder="Max Members"
                            value={formData.maxMembers}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-4 py-2"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                    >
                        Create
                    </button>
                </form>
            </div>
        </div>
    );
}
