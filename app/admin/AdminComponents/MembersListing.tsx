"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiUsers, FiUserPlus, FiRefreshCw, FiCheckCircle, FiXCircle, FiMinusCircle, FiActivity, FiLayers, FiShield, FiTrendingUp } from "react-icons/fi";
import { fetchCommitteebyId, fetchCommittees } from "../apis";

import Card from "@/app/Components/Theme/Card";
import Button from "@/app/Components/Theme/Button";
import EmptyState from "@/app/Components/Theme/EmptyState";
import SectionHeader from "@/app/Components/Theme/SectionHeader";
import StatusPill from "@/app/Components/Theme/StatusPill";
import Table, { TableRow, TableCell } from "@/app/Components/Theme/Table";

export default function MembersListing() {
  const router = useRouter();
  const [committees, setCommittees] = useState<any[]>([]);
  const [selectedCommittee, setSelectedCommittee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userLoggedDetails, setUserLoggedDetails] = useState<any>(null);

  useEffect(() => {
    const detail = localStorage.getItem("admin_detail");
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    if (detail) setUserLoggedDetails(JSON.parse(detail));
    loadCommittees();
  }, [router]);

  const loadCommittees = async () => {
    try {
      setLoading(true);
      const data = await fetchCommittees();
      setCommittees(data?.committees || []);
    } catch (err) {
      toast.error("Registry unreachable");
    } finally {
      setLoading(false);
    }
  };

  const loadCommitteById = async (id: string) => {
    try {
      setLoading(true);
      const data = await fetchCommitteebyId(id);
      setSelectedCommittee(data);
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCommittee = (committeeId: string) => {
    const committee = committees.find((c: any) => c._id === committeeId);
    setSelectedCommittee(committee);
  };

  const handleMemberAction = async (memberId: string, action: string, successMessage: string) => {
    try {
      const adminToken = localStorage.getItem("admin_token") || localStorage.getItem("token");
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (adminToken) headers["Authorization"] = `Bearer ${adminToken}`;

      const response = await fetch(
        action === "delete"
          ? "/api/member/unassign-member"
          : `/api/member/${action}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            memberId,
            committeeId: selectedCommittee._id,
          }),
        }
      );

      if (!response.ok) throw new Error("Internal failure.");

      toast.success(successMessage);
      if (selectedCommittee?._id) loadCommitteById(selectedCommittee._id);
    } catch (err: any) {
      toast.error(err.message || "Action failed");
    }
  };

  if (loading && !selectedCommittee) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-500/10 rounded-full" />
          <div className="absolute top-0 w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-slate-400 font-black tracking-widest uppercase text-[10px] animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* Upper Meta Section */}
      <div className="dashboard-shell overflow-hidden p-8 md:p-10">
        <div className="absolute inset-y-0 right-0 w-72 bg-gradient-to-l from-primary-500/10 to-transparent" />
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow="Members"
            icon={FiShield}
            title="Member Archive"
            description="Manage committee participants, authorized identity status, and assignments."
          />
          <Button onClick={() => router.push("/admin/addmember")} className="px-8 py-4 font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-primary-500/20">
            <FiUserPlus className="mr-2" /> Add Participant
          </Button>
        </div>
      </div>

      <Card className="p-0 overflow-visible border-none bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-2xl">
        {/* Hub Selector */}
        <div className="p-8 bg-slate-900 dark:bg-white rounded-t-[2.5rem] border-b border-white/5 dark:border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <label className="block w-full max-w-md">
            <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] mb-3 block">Committee Circuit Selector</span>
            <div className="relative group">
              <select
                onChange={(e) => handleSelectCommittee(e.target.value)}
                value={selectedCommittee?._id || ""}
                className="w-full h-14 pl-6 pr-12 bg-white/10 dark:bg-slate-100 text-white dark:text-slate-900 border border-white/10 dark:border-slate-200 rounded-2xl text-xs font-black uppercase tracking-wider outline-none focus:ring-2 focus:ring-primary-500 transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled className="text-slate-900 dark:text-slate-900">Select Committee Circuit</option>
                {committees.map((c) => (
                  <option key={c._id} value={c._id} className="text-slate-900 font-bold">
                    {c.name} — RS {c.monthlyAmount?.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
          </label>

          {selectedCommittee && (
            <div className="flex items-center gap-4">
              <StatusPill tone="info">Ref: {selectedCommittee._id?.substring(0, 8)}</StatusPill>
              <StatusPill tone="success">Approved: {selectedCommittee.members?.length || 0}</StatusPill>
            </div>
          )}
        </div>

        {/* Member Table */}
        {!selectedCommittee ? (
          <div className="p-16">
            <EmptyState
              icon={FiLayers}
              title="No Circuit Selected"
              description="Select a committee circuit above to view and manage participants."
            />
          </div>
        ) : (
          <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{selectedCommittee.name}</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Active Participants List</p>
              </div>
              <Button variant="secondary" onClick={() => loadCommitteById(selectedCommittee._id)}>
                <FiRefreshCw />
              </Button>
            </div>

            <Table headers={["Participant", "Contact Number", "Role", "Status", "Actions"]}>
              {selectedCommittee.members?.map((m: any) => (
                <TableRow key={m._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary-600/10 text-primary-600 flex items-center justify-center font-black text-xs">
                        {m.name?.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 dark:text-white text-sm uppercase">{m.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{m.email || m._id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-600 dark:text-slate-400">
                    {m.phone || "N/A"}
                  </TableCell>
                  <TableCell>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-600">
                      {m.role || "Member"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusPill tone={m.status === "approved" ? "success" : "warning"}>
                      {m.status || "Approved"}
                    </StatusPill>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {m.status !== "approved" && (
                        <Button
                          size="sm"
                          onClick={() => handleMemberAction(m._id, "approve", "Member Authorized")}
                          className="bg-amber-500 hover:bg-amber-600 border-none font-black text-[10px] py-2 px-4 uppercase"
                        >
                          <FiCheckCircle className="mr-1" /> Authorize
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleMemberAction(m._id, "delete", "Member Unassigned")}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 border-none font-black text-[10px] py-2 px-4 uppercase"
                      >
                        <FiMinusCircle className="mr-1" /> Unassign
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
