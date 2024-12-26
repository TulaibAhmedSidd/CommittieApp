'use client';
import { useEffect, useState } from 'react';
import { fetchCommittees, fetchMembers } from '../apis';
import { useRouter } from 'next/navigation';
import MembersListing from '../AdminComponents/MembersListing';
import GoBackButton from '@/app/components/GoBackButton';
import RefreshButton from '@/app/components/RefreshButton';
import { toast } from 'react-toastify';

export default function AssignMembers() {
    const [members, setMembers] = useState([]);
    const [committees, setCommittees] = useState([]);
    const [selectedMember, setSelectedMember] = useState('');
    const [selectedCommittee, setSelectedCommittee] = useState('');
    const [selectedCommitteeIndex, setSelectedCommitteeIndex] = useState(0);
    const [loading, setLoading] = useState(false)
    const fetchApis = async () => {
        setLoading(true)
        try {
            const res = await fetchMembers();
            const res2 = await fetchCommittees();
            if (res) setMembers(res);
            if (res2) setCommittees(res2);
            if (res || res2) {
                setLoading(false)
            }

        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchApis()
    }, []);

    // const fetchMembers = async () => {
    //     const res = await fetch('/api/members');
    //     const data = await res.json();
    //     setMembers(data);
    // };

    // const fetchCommittees = async () => {
    //     const res = await fetch('/api/committees');
    //     const data = await res.json();
    //     setCommittees(data);
    // };

    const handleAssign = async () => {
        if (!selectedMember || !selectedCommittee) {
            toast.info("Please select both a member and a committee!" + err, { position: "bottom-center" });
            return;
        }

        try {
            const res = await fetch('/api/member/assign-members', {
                method: 'PATCH',
                body: JSON.stringify({ memberId: selectedMember, committeeId: selectedCommittee }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) {
                throw new Error('Failed to assign member/ either already assigned')
            };
            fetchApis()
            toast.success("Member assigned successfully!", { position: "bottom-center" });
        } catch (err) {
            toast.error("error:!" + err, { position: "bottom-center" });
        }
    };
    const router = useRouter();
    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem("admin_token");
        if (!token) {
            router.push("/admin/login"); // Redirect to login page if no token
        } else {
        }
    }, []);


    useEffect(() => {
        return () => {
            setSelectedCommitteeIndex(0)
        }
    }, [])
    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center gap-2 mb-6">
                <GoBackButton />
                <h1 className="text-2xl font-bold ">Assign Member to Committee</h1>
                <RefreshButton
                    onClick={() => {
                        fetchApis();
                    }}
                />
            </div>
            <div className="space-y-4">
                <select
                    disabled={loading}
                    value={selectedCommittee}
                    onChange={(e) => {
                        console.log(e.target)
                        setSelectedCommittee(e.target.value);
                        const selectedCommitteeIndex = committees?.findIndex(
                            (committee) => committee._id === e.target.value
                        );
                        setSelectedCommitteeIndex(selectedCommitteeIndex); // Update the index state
                    }}
                    className="border p-2 w-full"
                >
                    <option value="">{loading ? 'Fetching Data...' : 'Select Committee'}</option>
                    {committees?.map((committee, index) => {
                        let memebersApproved = committee.members?.filter((meme) => meme?.status != 'pending')
                        return (
                            <option key={committee._id} value={committee._id} onClick={() => setSelectedCommitteeIndex(index + 1)}>
                                {committee.name} ({memebersApproved?.length + " - Approved member"} / out of {committee.maxMembers})
                            </option>
                        )
                    })
                    }
                </select>

                {/* Member select */}
                <select
                    disabled={loading || !selectedCommittee}
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                    className="border p-2 w-full"
                >
                    <option value="">{loading ? 'Fetching Data...' : 'Select Member'}</option>
                    {members?.map((member) => {
                        const selectedCommitteeMembers =
                            selectedCommittee
                                ? committees.find((committee) => committee._id === selectedCommittee)?.members || []
                                : [];

                        const isMemberInCommittee = Array.isArray(selectedCommitteeMembers)
                            && selectedCommitteeMembers.some(
                                (m) => m._id === member._id && m.status === 'approved'
                            );

                        return (
                            <option
                                key={member._id}
                                value={member._id}
                                disabled={isMemberInCommittee} // Disable if already in committee
                            >
                                {member.name} - {member.email}
                                {isMemberInCommittee ? " (Already in Committee)" : ""}
                            </option>
                        );
                    })}
                </select>



                <button
                    onClick={handleAssign}
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                >
                    Assign Member
                </button>
            </div>
            <div className='py-8'>
                <MembersListing />
            </div>
        </div>
    );
}
