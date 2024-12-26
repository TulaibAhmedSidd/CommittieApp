'use client'
import { useState, useEffect } from 'react';
import { fetchCommittees, updateCommittee } from '../apis';
import { useRouter } from 'next/navigation';
import GoBackButton from "../../Components/GoBackButton"
import { toast } from 'react-toastify';

export default function EditCommittee(params) {
  const router = useRouter();
  const id = params?.searchParams?.id;
  const [formData, setFormData] = useState({ name: '', description: '', maxMembers: '' });

  useEffect(() => {
    async function loadCommittee() {
      if (!id) return;
      try {
        const committee = await fetchCommittees().then((data) => data.find((c) => c._id === id));
        if (committee) setFormData(committee);
      } catch (err) {
        alert('Failed to fetch committee');
      }
    }
    loadCommittee();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCommittee(id, formData);
      router.push('/admin');
    } catch (err) {
      toast.error("Failed to update committee!", {
        position: "bottom-center",
      });
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
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <div className="flex items-center gap-2 mb-6">
        <GoBackButton />
        <h1 className="text-2xl font-bold ">Edit Committee</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Committee Name</label>
          <input
            type="text"
            name="name"
            placeholder="Committee Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border-gray-300 rounded px-4 py-2"
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
            className="w-full border-gray-300 rounded px-4 py-2"
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
            className="w-full border-gray-300 rounded px-4 py-2"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Update
        </button>
      </form>
    </div>
  );
}
