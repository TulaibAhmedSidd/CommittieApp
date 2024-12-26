'use client';
import { useEffect, useState } from 'react';
import { fetchCommittees, fetchMembers } from '../apis';
import { useRouter } from 'next/navigation';
import MembersListing from '../AdminComponents/MembersListing';
import GoBackButton from '@/app/components/GoBackButton';
import RefreshButton from '@/app/components/RefreshButton';

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
            alert('Please select both a member and a committee');
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
            alert('Member assigned successfully');
        } catch (err) {
            alert(err);
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

    const CommittieApprovedMember = committees?.map((mem) => mem.members);

    const checkIfIdExists = (array, id) => {
        return array.some(user => user._id === id);
    };

    useEffect(() => {
        return () => {
            setSelectedCommitteeIndex(0)
        }
    }, [])

    console.log("selectedCommitteeIndex", selectedCommitteeIndex)
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
                        // setSelectedCommitteeIndex(index + 1)

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
                <select
                    disabled={loading}
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                    className="border p-2 w-full"
                >
                    <option value="">{loading ? 'Fetching Data...' : 'Select Member'}</option>
                    {members?.map((member) => (
                        <option key={member._id} value={member._id}
                            disabled={
                                checkIfIdExists(CommittieApprovedMember[selectedCommitteeIndex], member._id)
                            }
                        >
                            {member.name} - {member.email}
                        </option>
                    ))}
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
