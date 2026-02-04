"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GoBackButton from "../../Components/GoBackButton";
import { checkerForAddAdmin } from "../../utils/commonFunc";
import { useLanguage } from "../../Components/LanguageContext";
import Card from "../../Components/Theme/Card";
import Input from "../../Components/Theme/Input";
import Button from "../../Components/Theme/Button";
import { toast } from "react-toastify";

export default function AddAdmin() {
    const { t } = useLanguage();
    const router = useRouter();
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [userLoggedDetails, setUserLoggedDetails] = useState(null);

    useEffect(() => {
        const detail = localStorage.getItem("admin_detail");
        const token = localStorage.getItem("admin_token");

        if (!token) {
            router.push("/admin/login");
            return;
        }

        if (detail) {
            const parsed = JSON.parse(detail);
            setUserLoggedDetails(parsed);
            if (!checkerForAddAdmin(parsed)) {
                router.push("/admin");
            }
        }
    }, [router]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("/api/admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || t("failedToAddOrganizer"));
            }

            toast.success(t("organizerAddedSuccess"));
            setFormData({ name: "", email: "", password: "" });
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (userLoggedDetails && !checkerForAddAdmin(userLoggedDetails)) return null;

    return (
        <div className="max-w-xl mx-auto p-6 mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-4">
                <GoBackButton />
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                    {t("addNewOrganizer")}
                </h1>
            </div>

            <Card className="border-none shadow-premium bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-700" />

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                        <Input
                            label={t("aliasName")}
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            placeholder={t("aliasName")}
                        />
                        <Input
                            label={t("emailPrimary")}
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder={t("emailPrimary")}
                        />
                        <Input
                            label={t("initialPassword")}
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            placeholder={t("initialPassword")}
                        />
                    </div>

                    <div className="flex flex-col gap-4 pt-4">
                        <Button
                            type="submit"
                            loading={loading}
                            className="w-full py-4 font-black uppercase text-xs tracking-[0.2em] shadow-xl"
                        >
                            {t("createOrganizer")}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => router.push("/admin")}
                            className="w-full py-4 font-black uppercase text-xs tracking-[0.2em]"
                        >
                            {t("cancel")}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
