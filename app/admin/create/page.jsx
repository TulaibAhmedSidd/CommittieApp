'use client'
import { useEffect, useState } from "react";
import { createCommittee } from "../apis";
import { useRouter } from "next/navigation";
import GoBackButton from "../../Components/GoBackButton";
import { toast } from "react-toastify";

export default function CreateCommittee() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        maxMembers: "",
        monthlyAmount: "",
        monthDuration: "",
        startDate: "",
        endDate: "",
        totalAmount: "", // New field
        createdBy: ''
    });

    const [errors, setErrors] = useState({}); // Track validation errors
    const [userLoggedDetails, setUserLoggedDetails] = useState(null);
    let detail = null;
    if (typeof window !== "undefined") {
        detail = localStorage.getItem("admin_detail");
    }
    useEffect(() => {
        // Check if user is logged in
        if (detail) {
            setUserLoggedDetails(JSON.parse(detail));
            setFormData({ ...formData, createdBy: userLoggedDetails?._id });
        }
    }, [detail]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Calculate endDate and totalAmount dynamically
        if (name === "startDate" || name === "monthDuration") {
            calculateEndDate({ ...formData, [name]: value });
        }
        if (name === "monthlyAmount" || name === "monthDuration") {
            calculateTotalAmount({ ...formData, [name]: value });
        }
    };

    const calculateEndDate = ({ startDate, monthDuration }) => {
        if (!startDate || !monthDuration) return;

        const start = new Date(startDate);
        const duration = parseInt(monthDuration, 10);

        if (!isNaN(duration) && duration > 0) {
            const calculatedEndDate = new Date(start.setMonth(start.getMonth() + duration - 1));
            setFormData((prevData) => ({
                ...prevData,
                endDate: calculatedEndDate.toISOString().split("T")[0],
            }));
        }
    };

    const calculateTotalAmount = ({ monthlyAmount, monthDuration }) => {
        const installment = parseFloat(monthlyAmount);
        const duration = parseInt(monthDuration, 10);

        if (!isNaN(installment) && !isNaN(duration) && installment > 0 && duration > 0) {
            const total = installment * duration;
            setFormData((prevData) => ({
                ...prevData,
                totalAmount: Math.round(total), // Ensure two decimal places
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                totalAmount: "",
            }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Committee name is required.";
        if (!formData.description.trim()) newErrors.description = "Description is required.";
        if (!formData.monthDuration || formData.monthDuration < 3) newErrors.monthDuration = "Month duration must be greater than 0.";
        if (!formData.maxMembers || formData.maxMembers <= 0) newErrors.maxMembers = "Max members must be greater than 0.";
        if (!formData.monthlyAmount || formData.monthlyAmount <= 0) newErrors.monthlyAmount = "Monthly installment must be greater than 0.";
        if (!formData.startDate) newErrors.startDate = "Start date is required.";
        if (formData.startDate && new Date(formData.startDate) < new Date()) newErrors.startDate = "Start date cannot be in the past.";
        if (!formData.endDate) newErrors.endDate = "End date cannot be calculated.";
        if (!formData.totalAmount) newErrors.totalAmount = "Total amount cannot be calculated.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            let allData = { ...formData, createdBy: userLoggedDetails?._id, }
            console.log("allData", allData)
            await createCommittee(allData);
            router.push("/admin");
        } catch (err) {
            toast.error("Failed to create committee!", {
                position: "bottom-center",
            });
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("admin_token");
        if (!token) {
            router.push("/admin/login");
        }
    }, []);

    return (
        <div className="min-h-[100vh] flex justify-center items-center mt-20">
            <div className="min-w-[70vw] max-w-3xl mx-auto p-6 bg-white shadow rounded">
                <div className="flex items-center gap-2 mb-4">
                    <GoBackButton />
                    <h1 className="text-2xl font-bold">Create Committee</h1>
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
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
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
                        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                    </div>
                    <div>
                        <label className="block font-semibold">Month Duration</label>
                        <input
                            type="number"
                            name="monthDuration"
                            placeholder="Month Duration"
                            max={36}
                            min={3}
                            value={formData.monthDuration}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-4 py-2"
                            required
                        />
                        {errors.monthDuration && <p className="text-red-500 text-sm">{errors.monthDuration}</p>}
                    </div>
                    <div>
                        <label className="block font-semibold">Max Members</label>
                        <input
                            type="number"
                            name="maxMembers"
                            placeholder="Max Members"
                            min={1}
                            max={40}
                            value={formData.maxMembers}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-4 py-2"
                            required
                        />
                        {errors.maxMembers && <p className="text-red-500 text-sm">{errors.maxMembers}</p>}
                    </div>
                    <div>
                        <label className="block font-semibold">Monthly Amount</label>
                        <input
                            type="number"
                            name="monthlyAmount"
                            min={1}
                            placeholder="Monthly Amount"
                            value={formData.monthlyAmount}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-4 py-2"
                            required
                        />
                        {errors.monthlyAmount && <p className="text-red-500 text-sm">{errors.monthlyAmount}</p>}
                    </div>
                    <div>
                        <label className="block font-semibold">Total Amount</label>
                        <input
                            type="number"
                            name="totalAmount"
                            value={formData.totalAmount}
                            readOnly
                            className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-100"
                        />
                        {errors.totalAmount && <p className="text-red-500 text-sm">{errors.totalAmount}</p>}
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
                        {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
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
                        {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate}</p>}
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
