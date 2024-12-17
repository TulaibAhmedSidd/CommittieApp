'use client';
import { useEffect, useState } from 'react';
import { fetchCommittees, fetchMembers } from '../apis';

export default function AssignMembers() {
    const [members, setMembers] = useState([]);
    const [committees, setCommittees] = useState([]);
    const [selectedMember, setSelectedMember] = useState('');
    const [selectedCommittee, setSelectedCommittee] = useState('');

    const fetchApis = async () => {
        const res = await fetchMembers();
        const res2 = await fetchCommittees();
        if (res) setMembers(res);
        if (res2) setCommittees(res2);

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

            if (!res.ok) throw new Error('Failed to assign member');
            alert('Member assigned successfully');
            fetchMembers();
            fetchCommittees();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Assign Member to Committee</h1>
            <div className="space-y-4">
                <select
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                    className="border p-2 w-full"
                >
                    <option value="">Select Member</option>
                    {members.map((member) => (
                        <option key={member._id} value={member._id}>
                            {member.name} - {member.email}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedCommittee}
                    onChange={(e) => setSelectedCommittee(e.target.value)}
                    className="border p-2 w-full"
                >
                    <option value="">Select Committee</option>
                    {committees.map((committee) => (
                        <option key={committee._id} value={committee._id}>
                            {committee.name} ({committee.members.length}/{committee.maxMembers})
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
        </div>
    );
}
