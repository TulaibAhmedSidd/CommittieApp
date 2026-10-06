"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiLock, FiPhone } from "react-icons/fi";
import { Bi, Button, Card, ErrorBox, Field, Loading, Page, PhotoPicker, Section, StatusBadge } from "../../ui";
import { W } from "../../utils/words";
import { adminApi } from "../../utils/api";
import { getSession, saveSession, updateSessionAccount } from "../../utils/session";
import { formatPkPhone } from "../../utils/phone";

function IdBadge({ status }) {
  if (status === "verified") return <StatusBadge status="verifiedId" />;
  if (status === "pending") return <StatusBadge status="pendingId" />;
  return <StatusBadge label="Not verified" tone="gray" />;
}

function DetailsCard({ profile, onSaved }) {
  const [form, setForm] = useState({
    name: profile.name || "",
    phone: formatPkPhone(profile.phone),
    email: profile.email || "",
    city: profile.city || "",
  });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await adminApi.patch("/api/admin/profile", form);
      if (data.account) updateSessionAccount("admin", data.account);
      onSaved(data.account);
      toast.success("Your details are saved.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Section title="Your details" urdu="آپ کی معلومات">
      <Card padding="p-5">
        <form className="space-y-4" onSubmit={save}>
          <Field label={W.name.en} urdu={W.name.ur} value={form.name} onChange={set("name")} autoComplete="name" required />
          <Field
            label={W.phone.en}
            urdu={W.phone.ur}
            prefix={<FiPhone />}
            type="tel"
            inputMode="tel"
            placeholder="0300 1234567"
            value={form.phone}
            onChange={set("phone")}
            autoComplete="tel"
            required
          />
          <Field label={W.email.en} urdu={W.email.ur} type="email" value={form.email} onChange={set("email")} autoComplete="email" />
          <Field label="City" urdu="شہر" value={form.city} onChange={set("city")} autoComplete="address-level2" />
          <Button type="submit" full size="lg" loading={saving}>
            <Bi {...W.save} />
          </Button>
        </form>
      </Card>
    </Section>
  );
}

function IdentityCard({ profile, onSaved }) {
  const [nicNumber, setNicNumber] = useState(profile.nicNumber || "");
  const [nicImage, setNicImage] = useState(profile.nicImage || "");
  const [status, setStatus] = useState(profile.verificationStatus);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!nicNumber.trim() && !nicImage) {
      toast.error("Please add your CNIC number or photo.");
      return;
    }
    setSaving(true);
    try {
      const body = { nicNumber: nicNumber.trim() };
      if (nicImage.startsWith("data:")) body.nicImage = nicImage;
      const data = await adminApi.patch("/api/admin/profile", body);
      if (data.account) {
        updateSessionAccount("admin", data.account);
        setStatus(data.account.verificationStatus);
        onSaved(data.account);
      }
      toast.success(body.nicImage ? "Sent. We will check your CNIC soon." : "Saved.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Section title="Identity (blue tick)" urdu="شناخت (بلیو ٹک)">
      <Card padding="p-5">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[15px] text-ink-600">Status</span>
            <IdBadge status={status} />
          </div>
          <Field
            label="CNIC number"
            urdu="شناختی کارڈ نمبر"
            inputMode="numeric"
            placeholder="35202-1234567-1"
            value={nicNumber}
            onChange={(e) => setNicNumber(e.target.value)}
          />
          <PhotoPicker label="CNIC photo" urdu="شناختی کارڈ کی تصویر" scope="admin" value={nicImage} onChange={setNicImage} />
          <Button full size="lg" loading={saving} onClick={save}>
            <Bi {...W.save} />
          </Button>
        </div>
      </Card>
    </Section>
  );
}

function PasswordCard() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    if (next.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    setSaving(true);
    try {
      const data = await adminApi.patch("/api/admin/profile", { currentPassword: current, newPassword: next });
      if (data.token) saveSession("admin", data.token, data.account || getSession("admin")?.account);
      setCurrent("");
      setNext("");
      toast.success("Password changed.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Section title="Change password" urdu="پاس ورڈ تبدیل کریں">
      <Card padding="p-5">
        <form className="space-y-4" onSubmit={save}>
          <Field
            label="Current password"
            urdu="موجودہ پاس ورڈ"
            prefix={<FiLock />}
            type="password"
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            required
          />
          <Field
            label="New password"
            urdu="نیا پاس ورڈ"
            prefix={<FiLock />}
            type="password"
            autoComplete="new-password"
            hint="At least 6 characters."
            value={next}
            onChange={(e) => setNext(e.target.value)}
            required
          />
          <Button type="submit" full size="lg" variant="secondary" loading={saving}>
            Change password
          </Button>
        </form>
      </Card>
    </Section>
  );
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setError("");
    adminApi
      .get("/api/admin/profile")
      .then((d) => setProfile(d.profile))
      .catch((e) => setError(e.message));
  }, []);

  useEffect(load, [load]);

  const merge = (account) => account && setProfile((p) => ({ ...p, ...account }));

  return (
    <Page title={W.profile.en} urdu={W.profile.ur} subtitle={profile?.referralCode ? `Your code: ${profile.referralCode}` : undefined}>
      {error && !profile ? (
        <ErrorBox message={error} onRetry={load} />
      ) : !profile ? (
        <Loading rows={3} />
      ) : (
        <>
          <DetailsCard profile={profile} onSaved={merge} />
          <IdentityCard profile={profile} onSaved={merge} />
          <PasswordCard />
        </>
      )}
    </Page>
  );
}
