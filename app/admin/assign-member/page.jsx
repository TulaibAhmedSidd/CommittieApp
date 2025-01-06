'use client'
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchMembers, fetchCommittees } from '../apis'; // Ensure this matches your API calls
import GoBackButton from '@/app/Components/GoBackButton';
import RefreshButton from '@/app/Components/RefreshButton';
import { useRouter } from 'next/navigation';
import MembersListing from '../AdminComponents/MembersListing';

const AssignMembers = () => {
    const [members, setMembers] = useState([]);
    const [committees, setCommittees] = useState([]);
    const [selectedMember, setSelectedMember] = useState('');
    const [selectedCommittee, setSelectedCommittee] = useState('');
    const [loading, setLoading] = useState(false);
    const [userLoggedDetails, setUserLoggedDetails] = useState(null);


    let detail = null;
    if (typeof window !== "undefined") {
        detail = localStorage.getItem("admin_detail");
    }
    useEffect(() => {
        // Check if user is logged in
        if (detail) {
            setUserLoggedDetails(JSON.parse(detail));
        }
    }, [detail]);


    const fetchApis = async () => {
        setLoading(true);
        try {
            const res = await fetchMembers();
            const res2 = await fetchCommittees();
            if (res) setMembers(res);
            if (res2) setCommittees(res2);
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
            toast.error('Error fetching data', { position: "bottom-center" });
        }
    };

    useEffect(() => {
        fetchApis();
    }, []);

    const handleAssign = async () => {
        if (!selectedMember || !selectedCommittee) {
            toast.info('Please select both a member and a committee!', { position: "bottom-center" });
            return;
        }

        try {
            const res = await fetch('/api/member/assign-members', {
                method: 'PATCH',
                body: JSON.stringify({ memberId: selectedMember, committeeId: selectedCommittee }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Error assigning member');
            }
            fetchApis();
            toast.success('Member assigned successfully!', { position: "bottom-center" });
        } catch (err) {
            toast.error('Error: ' + err.message, { position: "bottom-center" });
        }
    };

    const router = useRouter();
    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            router.push('/admin/login');
        }
    }, []);

    return (
        <div className="container mx-auto p-6 mt-[120px]">
            <div className="flex items-center gap-2 mb-6">
                <GoBackButton />
                <h1 className="text-3xl font-bold text-gray-800">Assign Member to Committee</h1>
                <RefreshButton onClick={fetchApis} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="mb-4 text-gray-600">Follow these steps to assign a member to a committee:</p>
                <ol className="list-decimal pl-6 mb-6 text-gray-600">
                    <li>Select the committee from the list below.</li>
                    <li>Select a member to assign to the selected committee.</li>
                    <li>Click the "Assign Member" button to confirm.</li>
                </ol>

                {/* Select Committee */}
                <label className="block text-gray-700 font-semibold mb-2">Step 1: Select Committee</label>
                <select
                    disabled={loading}
                    value={selectedCommittee}
                    onChange={(e) => setSelectedCommittee(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">{loading ? 'Fetching Data...' : 'Select Committee'}</option>
                    {committees?.map((committee) => {
                        const approvedMembersCount = committee.members?.length;
                        const isHisOwnCommittie = committee?.createdBy == userLoggedDetails?._id || false;

                        return (
                            <option key={committee._id} value={committee._id} disabled={isHisOwnCommittie ? false : true}>
                                {committee.name} ({approvedMembersCount} Approved Members / out of {committee.maxMembers}){!isHisOwnCommittie && " (Not your Committie)"}
                            </option>
                        );
                    })}
                </select>

                {/* Select Member */}
                <label className="block text-gray-700 font-semibold mb-2 mt-4">Step 2: Select Member</label>
                <select
                    disabled={loading || !selectedCommittee}
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">{loading ? 'Fetching Data...' : 'Select Member'}</option>
                    {members?.map((member) => {
                        const committee = committees.find((c) => c._id === selectedCommittee);
                        const isMemberInPendingCommittee = committee?.pendingMembers?.some((m) => m._id === member._id);
                        const isMemberInApprovedCommittee = committee?.members?.some((m) => m._id === member._id);
                        const isMemberInCommittee = isMemberInPendingCommittee || isMemberInApprovedCommittee;
                        const isHisOwnCommittie =
                            member?.createdBy == userLoggedDetails?._id ?false:true

                        return (
                            <option
                                key={member._id}
                                value={member._id}
                                disabled={isMemberInCommittee ||isHisOwnCommittie} // Disable if already in selected committee
                            >
                                {member.name} - {member.email}
                                {isMemberInCommittee ? " (Already in Committee)" : ""}
                            </option>
                        );
                    })}
                </select>

                {/* Assign Button */}
                <div className="mt-6">
                    <button
                        onClick={handleAssign}
                        className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        Assign Member
                    </button>
                </div>
            </div>

            {/* Optionally, add a section for Member Listing */}
            <div className="mt-4 py-8 bg-white p-6 rounded-lg shadow-md">
                <MembersListing />
            </div>
        </div>
    );
};

export default AssignMembers;
