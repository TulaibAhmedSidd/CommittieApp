"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiFileText, FiLogOut } from "react-icons/fi";
import { Bi, Button, Card, EmptyState, ErrorBox, Field, Loading, Page, PhotoPicker, SecureImage, Select, StatusBadge } from "@/app/ui";
import { W } from "@/app/utils/words";
import { memberApi } from "@/app/utils/api";
import { clearSession, saveSession, updateSessionAccount } from "@/app/utils/session";
import { formatPkPhone } from "@/app/utils/phone";

const PROFILE_URL = "/api/member/profile";
const CITY = { en: "City", ur: "شہر" };
const OTHER_DOCS = ["Gas Bill", "Water Bill", "Work ID"];
const ID_PHOTOS = [
  { key: "nicFront", en: "CNIC front", ur: "شناختی کارڈ (سامنے)" },
  { key: "nicBack", en: "CNIC back", ur: "شناختی کارڈ (پیچھے)" },
  { key: "electricityBill", en: "Electricity bill", ur: "بجلی کا بل" },
];

/** PATCH the profile with a busy flag and a toast. Returns the response or null. */
function useSave() {
  const [busy, setBusy] = useState(false);
  const save = async (body, message) => {
    setBusy(true);
    try {
      const d = await memberApi.patch(PROFILE_URL, body);
      toast.success(message);
      return d;
    } catch (e) {
      toast.error(e.message);
      return null;
    } finally {
      setBusy(false);
    }
  };
  return [busy, save];
}

/** One profile card: title, optional hint, fields, own Save button. */
function Box({ title, urdu, hint, extra, busy, onSave, saveLabel, children }) {
  return (
    <Card padding="p-5">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h2 className="text-[17px] font-bold text-ink-900">
            <Bi en={title} ur={urdu} stack />
          </h2>
          {extra}
        </div>
        {hint && <p className="-mt-2 text-sm text-ink-500">{hint}</p>}
        {children}
        <Button type="submit" full loading={busy}>
          {saveLabel || <Bi {...W.save} />}
        </Button>
      </form>
    </Card>
  );
}

function DetailsCard({ p }) {
  const [f, setF] = useState({ name: p.name || "", phone: formatPkPhone(p.phone), email: p.email || "", city: p.city || "" });
  const [busy, save] = useSave();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async () => {
    const { phone, ...rest } = f;
    const d = await save(phone.trim() ? f : rest, "Your details are saved.");
    if (d?.account) updateSessionAccount("member", d.account);
  };
  return (
    <Box title="Your details" urdu="آپ کی تفصیلات" busy={busy} onSave={submit}>
      <Field label={W.name.en} urdu={W.name.ur} autoComplete="name" value={f.name} onChange={set("name")} required />
      <Field label={W.phone.en} urdu={W.phone.ur} type="tel" inputMode="tel" placeholder="0300 1234567" value={f.phone} onChange={set("phone")} required />
      <Field label={W.email.en} urdu={W.email.ur} type="email" autoComplete="email" value={f.email} onChange={set("email")} />
      <Field label={CITY.en} urdu={CITY.ur} placeholder="e.g. Lahore" value={f.city} onChange={set("city")} />
    </Box>
  );
}

function PayoutCard({ p }) {
  const pd = p.payoutDetails || {};
  const [f, setF] = useState({ accountTitle: pd.accountTitle || "", bankName: pd.bankName || "", iban: pd.iban || "" });
  const [busy, save] = useSave();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <Box
      title="Where to send your payout"
      urdu="آپ کی رقم کہاں بھیجیں"
      hint="Your organizer sends your BC money here."
      busy={busy}
      onSave={() => save({ payoutDetails: f }, "Payout details saved.")}
    >
      <Field label="Account name" urdu="اکاؤنٹ کا نام" value={f.accountTitle} onChange={set("accountTitle")} />
      <Field label="Bank, JazzCash or Easypaisa" urdu="بینک، جیز کیش یا ایزی پیسہ" placeholder="e.g. HBL" value={f.bankName} onChange={set("bankName")} />
      <Field label="Account number or IBAN" urdu="اکاؤنٹ نمبر" inputMode="text" value={f.iban} onChange={set("iban")} />
    </Box>
  );
}

function VerifyCard({ p }) {
  const [status, setStatus] = useState(p.verificationStatus || "unverified");
  const [nic, setNic] = useState(p.nicNumber || "");
  const [saved, setSaved] = useState({ nicFront: p.nicFront || "", nicBack: p.nicBack || "", electricityBill: p.electricityBill || "" });
  const [imgs, setImgs] = useState(saved);
  const [busy, save] = useSave();
  const submit = async () => {
    const changed = {};
    for (const { key } of ID_PHOTOS) if (imgs[key] && imgs[key] !== saved[key]) changed[key] = imgs[key];
    const d = await save({ nicNumber: nic, ...changed }, "Saved. We will check your ID.");
    if (d) {
      setSaved({ ...saved, ...changed });
      if (d.verificationStatus) setStatus(d.verificationStatus);
    }
  };
  const badge =
    status === "verified" ? <StatusBadge status="verifiedId" /> : status === "pending" ? <StatusBadge status="pendingId" /> : <StatusBadge label="Not verified" tone="gray" />;
  return (
    <Box title="Verify identity (blue tick)" urdu={W.verifyIdentity.ur} hint="Optional. Some BCs ask for this." extra={badge} busy={busy} onSave={submit}>
      <Field label="CNIC number" urdu="شناختی کارڈ نمبر" inputMode="numeric" placeholder="35202-1234567-1" value={nic} onChange={(e) => setNic(e.target.value)} />
      {ID_PHOTOS.map((d) => (
        <PhotoPicker key={d.key} scope="member" label={d.en} urdu={d.ur} value={imgs[d.key]} onChange={(v) => setImgs({ ...imgs, [d.key]: v })} />
      ))}
    </Box>
  );
}

function DocsCard({ p }) {
  const [docs, setDocs] = useState(p.documents || []);
  const [name, setName] = useState(OTHER_DOCS[0]);
  const [image, setImage] = useState("");
  const [busy, save] = useSave();
  const submit = async () => {
    if (!image) return toast.error("Please add a photo.");
    const d = await save({ document: { name, image } }, "Document added.");
    if (d) {
      setDocs([...docs.filter((x) => x.name !== name), { name, url: image }]);
      setImage("");
    }
  };
  return (
    <Box title="Other documents" urdu="دیگر کاغذات" busy={busy} onSave={submit} saveLabel={<Bi en="Add document" ur="کاغذ شامل کریں" />}>
      {docs.length > 0 ? (
        <ul className="divide-y divide-line">
          {docs.map((d) => (
            <li key={d.name} className="flex min-h-[60px] items-center gap-3 py-2">
              <SecureImage src={d.url} scope="member" alt={d.name} className="h-14 w-14 shrink-0 rounded-lg bg-surface-100" />
              <span className="text-[15px] font-semibold text-ink-900">{d.name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState icon={FiFileText} title="No other documents yet" urdu="ابھی کوئی کاغذ نہیں" />
      )}
      <Select label="Which document" urdu="کون سا کاغذ" value={name} onChange={(e) => setName(e.target.value)}>
        {OTHER_DOCS.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </Select>
      <PhotoPicker scope="member" label="Photo" urdu="تصویر" value={image} onChange={setImage} />
    </Box>
  );
}

function PasswordCard() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [busy, save] = useSave();
  const submit = async () => {
    if (next.length < 6) return toast.error("New password must be at least 6 characters.");
    const d = await save({ currentPassword: current, newPassword: next }, "Password changed.");
    if (d?.token) {
      saveSession("member", d.token, d.account);
      setCurrent("");
      setNext("");
    }
  };
  return (
    <Box title="Change password" urdu="پاس ورڈ تبدیل کریں" busy={busy} onSave={submit}>
      <Field label="Current password" urdu="موجودہ پاس ورڈ" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
      <Field label="New password" urdu="نیا پاس ورڈ" type="password" autoComplete="new-password" hint="At least 6 characters." value={next} onChange={(e) => setNext(e.target.value)} required />
    </Box>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setError("");
    memberApi
      .get(PROFILE_URL)
      .then((d) => setProfile(d.profile))
      .catch((e) => setError(e.message));
  }, []);

  useEffect(load, [load]);

  const logout = () => {
    clearSession("member");
    router.replace("/login");
  };

  if (!profile && !error) return <Loading rows={4} />;

  return (
    <Page title={W.profile.en} urdu={W.profile.ur}>
      {error ? (
        <ErrorBox message={error} onRetry={load} />
      ) : (
        <>
          <DetailsCard p={profile} />
          <PayoutCard p={profile} />
          <VerifyCard p={profile} />
          <DocsCard p={profile} />
          <PasswordCard />
        </>
      )}
      <Button variant="secondary" size="lg" full icon={FiLogOut} onClick={logout}>
        <Bi {...W.logout} />
      </Button>
    </Page>
  );
}
