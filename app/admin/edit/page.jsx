'use client';
import { useState, useEffect } from 'react';
import { fetchCommittees, updateCommittee } from '../apis';
import { useRouter } from 'next/navigation';
import GoBackButton from "../../Components/GoBackButton";
import { toast } from 'react-toastify';

export default function EditCommittee(params) {
  const router = useRouter();
  const id = params?.searchParams?.id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxMembers: '',
    monthlyAmount: '',
    monthDuration: '',
    startDate: '',
    endDate: '',
    totalAmount: '',
  });

  // Load committee data
  // useEffect(() => {
  //   async function loadCommittee() {
  //     if (!id) return;
  //     try {
  //       const committee = await fetchCommittees().then((data) =>
  //         data.find((c) => c._id === id)
  //       );
  //       if (committee) {
  //         // Pre-fill form with committee data
  //         setFormData(committee);
  //       }
  //     } catch (err) {
  //       toast.error('Failed to fetch committee!', {
  //         position: 'bottom-center',
  //       });
  //     }
  //   }
  //   loadCommittee();
  // }, [id]);

  useEffect(() => {
    async function loadCommittee() {
      if (!id) return;
      try {
        const committee = await fetchCommittees().then((data) =>
          data.find((c) => c._id === id)
        );
        if (committee) {
          setFormData({
            ...committee,
            startDate: committee.startDate
              ? new Date(committee.startDate).toISOString().split('T')[0]
              : '',
            endDate: committee.endDate
              ? new Date(committee.endDate).toISOString().split('T')[0]
              : '',
          });
        }
      } catch (err) {
        toast.error('Failed to fetch committee!', { position: 'bottom-center' });
      }
    }
    loadCommittee();
  }, [id]);
  

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };

    // Calculate endDate and totalAmount dynamically
    if (name === 'startDate' || name === 'monthDuration') {
      const startDate = name === 'startDate' ? value : formData.startDate;
      const monthDuration =
        name === 'monthDuration' ? parseInt(value) : parseInt(formData.monthDuration);

      if (startDate && monthDuration > 0) {
        const calculatedEndDate = new Date(startDate);
        calculatedEndDate.setMonth(calculatedEndDate.getMonth() + monthDuration -1);
        updatedFormData.endDate = calculatedEndDate.toISOString().split('T')[0];
      }
    }

    if (name === 'monthlyAmount' || name === 'monthDuration') {
      const monthlyAmount =
        name === 'monthlyAmount' ? parseFloat(value) : parseFloat(formData.monthlyAmount);
      const monthDuration =
        name === 'monthDuration' ? parseInt(value) : parseInt(formData.monthDuration);

      if (monthlyAmount > 0 && monthDuration > 0) {
        updatedFormData.totalAmount = (monthlyAmount * monthDuration).toFixed(2);
      }
    }

    setFormData(updatedFormData);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const {
      name,
      description,
      maxMembers,
      monthlyAmount,
      monthDuration,
      startDate,
    } = formData;

    if (!name || !description || !maxMembers || !monthlyAmount || !monthDuration || !startDate) {
      toast.error('All fields are required!', { position: 'bottom-center' });
      return;
    }

    if (maxMembers <= 0 || monthlyAmount <= 0 || monthDuration <= 0) {
      toast.error('Values must be greater than zero!', { position: 'bottom-center' });
      return;
    }
    if (maxMembers <= 0 || monthlyAmount <= 0 || monthDuration < 3) {
      toast.error('Values must be greater than Three!', { position: 'bottom-center' });
      return;
    }

    try {
      await updateCommittee(id, formData);
      toast.success('Committee updated successfully!', { position: 'bottom-center' });
      router.push('/admin');
    } catch (err) {
      toast.error('Failed to update committee!', { position: 'bottom-center' });
    }
  };

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-20">
      <div className="flex items-center gap-2 mb-6">
        <GoBackButton />
        <h1 className="text-2xl font-bold">Edit Committee</h1>
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
            min={1}
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Monthly Amount</label>
          <input
            type="number"
            name="monthlyAmount"
            placeholder="Monthly Amount"
            value={formData.monthlyAmount}
            onChange={handleChange}
            min={1}
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Month Duration</label>
          <input
            type="number"
            name="monthDuration"
            placeholder="Month Duration"
            value={formData.monthDuration}
            onChange={handleChange}
            min={3}
            max={36}
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            readOnly
            className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block font-semibold">Total Amount</label>
          <input
            type="text"
            name="totalAmount"
            value={formData.totalAmount}
            readOnly
            className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-100"
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
