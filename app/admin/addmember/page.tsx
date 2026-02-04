"use client";

import {
  APIRoute,
  AppRoutes,
  LocalKeys,
} from "@/app/utils/commonData";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiUser, FiMail, FiLock, FiCheckCircle, FiChevronRight, FiChevronLeft, FiPlus, FiTrash2, FiEdit3, FiUsers, FiSearch, FiPhone, FiFilter, FiActivity, FiInfo } from "react-icons/fi";

import Button from "../../Components/Theme/Button";
import Input from "../../Components/Theme/Input";
import Card from "../../Components/Theme/Card";
import Table, { TableRow, TableCell } from "../../Components/Theme/Table";
import StepProgress from "../../Components/Theme/StepProgress";
import { useLanguage } from "../../Components/LanguageContext";

export const dynamic = "force-dynamic";

export default function AddMembers() {
  const { t } = useLanguage();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [members, setMembers] = useState([]);
  const [myMemFilter, setMyMemFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [userLoggedDetails, setUserLoggedDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const steps = [t("basicInfo"), t("security"), t("review")];

  useEffect(() => {
    const detail = localStorage.getItem("admin_detail");
    const token = localStorage.getItem(LocalKeys.admin_token);

    if (!token) {
      router.push(AppRoutes.adminLogin);
      return;
    }

    if (detail) {
      setUserLoggedDetails(JSON.parse(detail));
    }

    fetchMembers();
  }, [router]);

  async function fetchMembers() {
    setFetching(true);
    try {
      const response = await fetch(APIRoute.member);
      if (!response.ok) throw new Error("Failed to load members");
      const data = await response.json();
      setMembers(data);
    } catch (err) {
      toast.error(t("error") + ": " + err.message);
    } finally {
      setFetching(false);
    }
  }

  const handleNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const validateStep = () => {
    if (step === 0) return name.length > 2 && email.includes("@");
    if (step === 1) return true; // Password is now optional in edit mode
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const url = editingId ? `${APIRoute.member}${editingId}` : APIRoute.member;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: JSON.stringify({
          name,
          email: email.toLowerCase(),
          password,
          phone,
          userId: userLoggedDetails?._id, // Fixed: Pass userId for API auth
          committees: [],
          createdBy: userLoggedDetails?._id,
          createdByAdminName: userLoggedDetails?.name
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Could not save member");

      toast.success(editingId ? t("updateSuccess") : t("createSuccess"));

      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setEditingId(null);
      setStep(0);
      fetchMembers();
    } catch (err) {
      toast.error(t("error") + ": " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member) => {
    setName(member.name);
    setEmail(member.email);
    setPhone(member.phone || "");
    setEditingId(member._id);
    setStep(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm(t("confirmDelete"))) return;
    try {
      const response = await fetch(`${APIRoute.member}${id}`, {
        method: "DELETE",
        body: JSON.stringify({ userId: userLoggedDetails?._id }),
      });
      if (!response.ok) throw new Error("Failed to delete member");
      toast.success(t("deleteSuccess"));
      fetchMembers();
    } catch (err) {
      toast.error(t("error") + ": " + err.message);
    }
  };

  const handleBulkSim = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/member/bulk-upload", {
        method: "POST",
        body: JSON.stringify({
          adminId: userLoggedDetails?._id,
          adminName: userLoggedDetails?.name,
          count: 10
        }),
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) throw new Error("Failed to generate members");
      toast.success(t("simulationSuccess"));
      fetchMembers();
    } catch (err) {
      toast.error(t("error") + ": " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = myMemFilter === "All"
    ? members
    : members.filter(m => m.createdBy === userLoggedDetails?._id);

  return (
    <div className="space-y-12 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary-600 font-black tracking-[0.2em] text-[10px] uppercase">
            <FiActivity className="animate-pulse" /> {t("members")}
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
            {editingId ? t("editMember") : t("addMember")}
          </h1>
          <p className="text-slate-500 font-medium italic">
            Manage your members and their access here.
          </p>
        </div>
        {!editingId && (
          <Button
            variant="outline"
            onClick={handleBulkSim}
            loading={loading}
            className="border-primary-500/30 text-primary-600 font-black uppercase text-[9px] tracking-widest py-3 px-6 hover:bg-primary-500/5 shadow-premium"
          >
            <FiPlus className="mr-2" /> {t("triggerSimulation")}
          </Button>
        )}
      </div>

      {/* Steps Card */}
      <Card className="max-w-3xl mx-auto border-none shadow-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-8 md:p-12 overflow-visible">
        <div className="mb-10">
          <StepProgress steps={steps} currentStep={step} />
        </div>

        <div className="mt-8 min-h-[350px]">
          {step === 0 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
              <div className="flex items-center gap-4 p-5 bg-primary-500/5 rounded-2xl border border-primary-500/10 mb-8">
                <div className="p-3 bg-primary-600 text-white rounded-xl shadow-lg shadow-primary-500/20">
                  <FiUser size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest">{t("step")} 1</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">{t("basicInfo")}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Input
                  label={t("aliasName")}
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-14 text-lg font-black tracking-tight"
                  required
                />
                <Input
                  label={t("emailPrimary")}
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 text-lg font-black tracking-tight"
                  required
                />
              </div>

              <Input
                label={t("phoneProxy")}
                type="tel"
                placeholder="+92 300 1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-14 text-lg font-black tracking-tight"
                icon={<FiPhone className="text-slate-400" />}
              />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
              <div className="flex items-center gap-4 p-5 bg-amber-500/5 rounded-2xl border border-amber-500/10 mb-8">
                <div className="p-3 bg-amber-500 text-white rounded-xl shadow-lg shadow-amber-500/20">
                  <FiLock size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{t("step")} 2</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">{t("security")}</p>
                </div>
              </div>

              <div className="space-y-4">
                <Input
                  label={editingId ? t("resetAccess") : t("initialPassword")}
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!editingId}
                  className="h-14 text-lg font-black tracking-tight"
                  error={password && password.length > 0 && password.length < 6 ? "Minimum 6 characters required" : ""}
                />
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-3">
                  <FiInfo className="text-primary-500" />
                  {editingId ? t("passwordResetEditInfo") : t("passwordResetInfo")}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
              <div className="flex items-center gap-4 p-5 bg-green-500/5 rounded-2xl border border-green-500/10 mb-8">
                <div className="p-3 bg-green-500 text-white rounded-xl shadow-lg shadow-green-500/20">
                  <FiCheckCircle size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">{t("step")} 3</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">{t("reviewDetails")}</p>
                </div>
              </div>

              <Card className="bg-slate-900 dark:bg-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">{t("name")}</span>
                    <p className="text-xl font-black text-white dark:text-slate-900 tracking-tighter">{name}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">{t("email")}</span>
                    <p className="text-xl font-black text-white dark:text-slate-900 tracking-tighter lowercase">{email}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">{t("phone")}</span>
                    <p className="text-xl font-black text-white dark:text-slate-900 tracking-tighter">{phone || t("noData")}</p>
                  </div>
                </div>
                <FiUser size={120} className="absolute -bottom-10 -right-10 text-white/5 dark:text-slate-900/5 rotate-12 group-hover:scale-110 transition-transform duration-1000" />
              </Card>
            </div>
          )}
        </div>

        <div className="mt-12 flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-8">
          <button onClick={handleBack} disabled={step === 0 || loading} className={`flex items-center gap-2 font-black uppercase text-xs tracking-widest text-slate-400 hover:text-slate-600 transition-colors ${step === 0 ? "invisible" : ""}`}>
            <FiChevronLeft /> {t("back")}
          </button>

          {step < steps.length - 1 ? (
            <Button onClick={handleNext} disabled={!validateStep()} className="px-10 py-4 font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-primary-500/20">
              {t("next")} <FiChevronRight className="ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              loading={loading}
              className={`px-10 py-4 font-black uppercase text-xs tracking-[0.2em] shadow-xl border-none ${editingId ? "bg-primary-600 shadow-primary-500/20" : "bg-green-600 hover:bg-green-700 shadow-green-500/20"}`}
            >
              {editingId ? t("confirmRecalibration") : t("finalizeRegistration")} <FiCheckCircle className="ml-2" />
            </Button>
          )}
        </div>
      </Card>

      {/* Member List */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-2 h-10 bg-primary-600 rounded-full" />
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{t("memberRegistryTitle")}</h2>
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl shadow-inner border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setMyMemFilter("All")}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${myMemFilter === "All"
                ? "bg-white dark:bg-slate-800 text-primary-600 shadow-xl"
                : "text-slate-400 hover:text-slate-600"
                }`}
            >
              {t("allIndices")}
            </button>
            <button
              onClick={() => setMyMemFilter("My")}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${myMemFilter === "My"
                ? "bg-white dark:bg-slate-800 text-primary-600 shadow-xl"
                : "text-slate-400 hover:text-slate-600"
                }`}
            >
              {t("underCustody")}
            </button>
          </div>
        </div>

        <Card className="p-0 border-none overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-xl">
          <Table headers={[t("members"), t("email"), t("status"), t("actions")]}>
            {fetching ? (
              <TableRow>
                <TableCell className="text-center py-24" colSpan={4}>
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-primary-500/10 rounded-full" />
                      <div className="absolute top-0 w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="text-slate-400 font-black tracking-widest uppercase text-[9px] animate-pulse">{t("loading")}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell className="text-center py-24" colSpan={4}>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-300">
                      <FiSearch size={32} />
                    </div>
                    <p className="text-slate-400 font-black tracking-tight uppercase">{t("noData")}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member) => (
                <TableRow key={member._id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:rotate-12 transition-transform">
                        {member.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 dark:text-white tracking-tight uppercase text-base leading-none mb-1">{member.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t("uid")}://{member._id.substring(0, 8)}</span>
                          <span className="text-[8px] font-black px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded uppercase">{t("managedBy")}: {member.createdByAdminName || "Root"}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-600 dark:text-slate-300 font-bold lowercase italic">{member.email}</span>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                        <FiPhone className="text-primary-500" size={10} /> {member.phone || "No Phone"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`
                      inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border font-black text-[9px] uppercase tracking-widest
                      ${member.status === "approved"
                        ? "bg-green-500/10 text-green-600 border-green-500/20"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/20"}
                    `}>
                      <div className={`w-1.5 h-1.5 rounded-full ${member.status === 'approved' ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`} />
                      {member.status === "approved" ? t("approved") : t("pending")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={member?.createdBy !== userLoggedDetails?._id && userLoggedDetails?.email?.toLowerCase() !== "tulaib@gmail.com"}
                        onClick={() => handleEdit(member)}
                        className="p-3 h-10 w-10 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl"
                      >
                        <FiEdit3 size={18} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={member?.createdBy !== userLoggedDetails?._id && userLoggedDetails?.email?.toLowerCase() !== "tulaib@gmail.com"}
                        onClick={() => handleDelete(member._id)}
                        className="p-3 h-10 w-10 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                      >
                        <FiTrash2 size={18} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </Table>
        </Card>
      </div>
    </div>
  );
}
