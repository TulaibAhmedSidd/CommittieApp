"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import Spinner from "./Spinner"; // Custom loading spinner component
import { fetchCommitteebyId, fetchCommittees } from "../apis";
import GoBackButton from "@/app/Components/GoBackButton";
import RefreshButton from "@/app/Components/RefreshButton";
import NotAvailText from "@/app/Components/NotAvailText";

export default function MembersListing() {
  const [committees, setCommittees] = useState([]);
  const [selectedCommittee, setSelectedCommittee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

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

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
    }
  }, []);

  useEffect(() => {
    loadCommittees();
  }, []);

  const loadCommittees = async () => {
    try {
      setLoading(true);
      const data = await fetchCommittees(); // Replace with actual fetch logic
      setCommittees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCommitteById = async (id) => {
    try {
      setLoading(true);
      const data = await fetchCommitteebyId(id); // Replace with actual fetch logic
      setSelectedCommittee(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCommittee = (committeeId) => {
    const committee = committees.find((c) => c._id === committeeId);
    setSelectedCommittee(committee);
  };

  const handleMemberAction = async (memberId, action, successMessage) => {
    try {
      const response = await fetch(`/api/member/${action}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId,
          committeeId: selectedCommittee._id,
        }),
      });

      if (!response.ok) throw new Error("Action failed.");

      toast.success(successMessage, { position: "bottom-center" });
      loadCommitteById(selectedCommittee._id);
    } catch (err) {
      toast.error(err.message || "Action failed.", {
        position: "bottom-center",
      });
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          {usePathname()?.includes("assign-member") ? null : <GoBackButton />}
          <h1 className="text-3xl font-bold">Manage Members</h1>
        </div>
        <button
          onClick={() => router.push("/admin/addmember")}
          className="bg-green-500 text-white py-2 px-4 rounded-lg shadow hover:bg-green-600 transition"
        >
          Add Member
        </button>
      </div>

      <label className="block mb-6">
        <span className="font-semibold text-gray-700">Select a Committee</span>
        <select
          className="block w-full mt-2 border border-gray-300 rounded-lg px-4 py-2"
          onChange={(e) => handleSelectCommittee(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            -- Choose a committee --
          </option>
          {committees.map((committee) => {
            const isHisOwnCommittie =
              committee?.createdBy == userLoggedDetails?._id || false;

            return (
              <option
                key={committee._id}
                value={committee._id}
                disabled={isHisOwnCommittie ? false : true}
              >
                {committee.name}{!isHisOwnCommittie && " (Not your Committie)"}
              </option>
            );
          })}
        </select>
      </label>

      {selectedCommittee && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold">{selectedCommittee.name}</h2>
          <p className="text-gray-600">{selectedCommittee.description}</p>

          <div className="flex items-center gap-4 mt-4">
            <h3 className="text-xl font-semibold">
              Approved Members: {selectedCommittee?.members?.length || 0}
            </h3>
            <RefreshButton
              onClick={() => loadCommitteById(selectedCommittee._id)}
            />
          </div>

          <MemberList
            title="Pending Members"
            members={selectedCommittee.pendingMembers}
            onApprove={(id) =>
              handleMemberAction(id, "approve", "Member approved successfully!")
            }
          />

          <MemberList
            title="Approved Members"
            members={selectedCommittee.members}
            onUnapprove={(id) =>
              handleMemberAction(
                id,
                "disapprove",
                "Member unapproved successfully!"
              )
            }
            onUnassign={(id) =>
              handleMemberAction(
                id,
                "unassign",
                "Member unassigned successfully!"
              )
            }
          />
        </div>
      )}
    </div>
  );
}

function MemberList(props) {
  const { title, members, onApprove, onUnapprove, onUnassign } = props;
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold">{title}</h3>
      {members && members.length > 0 ? (
        <ul className="space-y-4 mt-2">
          {members.map((member) => (
            <li
              key={member._id}
              className="bg-gray-50 p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{member.name}</p>
                <p className="text-sm text-gray-600">{member.email}</p>
              </div>
              <div className="flex gap-2">
                {onApprove && (
                  <button
                    onClick={() => onApprove(member._id)}
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                )}
                {onUnapprove && (
                  <button
                    onClick={() => onUnapprove(member._id)}
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                  >
                    Unapprove
                  </button>
                )}
                {onUnassign && (
                  <button
                    onClick={() => onUnassign(member._id)}
                    className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
                  >
                    Unassign
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <NotAvailText text={`No ${title} Yet!`} />
      )}
    </div>
  );
}
