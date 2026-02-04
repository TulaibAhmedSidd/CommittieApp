"use client";

import { useState, useEffect } from "react";
import { fetchCommittees, updateCommittee } from "../apis";
import { useRouter } from "next/navigation";
import GoBackButton from "../../Components/GoBackButton";
import { toast } from "react-toastify";
import { useLanguage } from "../../Components/LanguageContext";
import Button from "../../Components/Theme/Button";
import Input from "../../Components/Theme/Input";
import Card from "../../Components/Theme/Card";

export default function EditCommittee(params) {
  const { t } = useLanguage();
  const router = useRouter();
  const id = params?.searchParams?.id;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    maxMembers: "",
    monthlyAmount: "",
    monthDuration: "",
    startDate: "",
    endDate: "",
    totalAmount: "",
  });

  useEffect(() => {
    async function loadCommittee() {
      if (!id) return;
      try {
        const committees = await fetchCommittees();
        const committee = committees.find((c) => c._id === id);
        if (committee) {
          setFormData({
            ...committee,
            startDate: committee.startDate
              ? new Date(committee.startDate).toISOString().split("T")[0]
              : "",
            endDate: committee.endDate
              ? new Date(committee.endDate).toISOString().split("T")[0]
              : "",
          });
        }
      } catch (err) {
        toast.error(t("fetchCommitteeError"));
      }
    }
    loadCommittee();
  }, [id, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };

    if (name === "startDate" || name === "monthDuration") {
      const startDate = name === "startDate" ? value : formData.startDate;
      const monthDuration = name === "monthDuration" ? parseInt(value) : parseInt(formData.monthDuration);

      if (startDate && monthDuration > 0) {
        const calculatedEndDate = new Date(startDate);
        calculatedEndDate.setMonth(calculatedEndDate.getMonth() + monthDuration - 1);
        updatedFormData.endDate = calculatedEndDate.toISOString().split("T")[0];
      }
    }

    if (name === "monthlyAmount" || name === "monthDuration") {
      const monthlyAmount = name === "monthlyAmount" ? parseFloat(value) : parseFloat(formData.monthlyAmount);
      const monthDuration = name === "monthDuration" ? parseInt(value) : parseInt(formData.monthDuration);

      if (monthlyAmount > 0 && monthDuration > 0) {
        updatedFormData.totalAmount = (monthlyAmount * monthDuration).toFixed(2);
      }
    }

    setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { name, description, maxMembers, monthlyAmount, monthDuration, startDate } = formData;

    if (!name || !description || !maxMembers || !monthlyAmount || !monthDuration || !startDate) {
      toast.error(t("allFieldsRequired"));
      setLoading(false);
      return;
    }

    if (maxMembers <= 0 || monthlyAmount <= 0) {
      toast.error(t("valuesGreaterThanZero"));
      setLoading(false);
      return;
    }

    if (monthDuration < 3) {
      toast.error(t("valuesGreaterThanThree"));
      setLoading(false);
      return;
    }

    try {
      await updateCommittee(id, formData);
      toast.success(t("updateSuccess"));
      router.push("/admin");
    } catch (err) {
      toast.error(t("updateError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

  return (
    <div className="max-w-3xl mx-auto p-6 mt-12 space-y-8">
      <div className="flex items-center gap-4">
        <GoBackButton />
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
          {t("editCommittee")}
        </h1>
      </div>

      <Card className="border-none shadow-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-8 md:p-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Input
              label={t("operationName")}
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              label={t("maxLoadMembers")}
              name="maxMembers"
              type="number"
              min={1}
              value={formData.maxMembers}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest ml-1">
              {t("missionDirectiveDesc")}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="input-field min-h-[120px] bg-white/5 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-base font-medium resize-none shadow-sm transition-all focus:ring-2 focus:ring-primary-500/20"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Input
              label={t("monthlyCommitmentPkr")}
              name="monthlyAmount"
              type="number"
              min={1}
              value={formData.monthlyAmount}
              onChange={handleChange}
              required
            />
            <Input
              label={t("cycleDurationMonths")}
              name="monthDuration"
              type="number"
              min={3}
              value={formData.monthDuration}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Input
              label={t("cycleInitializationStart")}
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">
                {t("projectedTermination")}
              </label>
              <div className="h-14 flex items-center px-6 bg-slate-100 dark:bg-slate-950/50 rounded-xl text-slate-500 italic font-black text-lg border border-slate-200 dark:border-slate-800">
                {formData.endDate || "Pending..."}
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[2rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex justify-between items-center shadow-xl">
            <div>
              <p className="text-[10px] uppercase font-black tracking-[0.3em] opacity-60 mb-2">
                {t("totalPoolValuation")}
              </p>
              <h4 className="text-4xl font-black tracking-tighter uppercase">
                PKR {formData.totalAmount ? parseInt(formData.totalAmount).toLocaleString() : "0"}
              </h4>
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <Button type="submit" loading={loading} className="px-12 py-4 font-black uppercase text-xs tracking-widest shadow-xl">
              {t("save")}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
