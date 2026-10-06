"use client";

import { useRef, useState } from "react";
import { FiCamera, FiImage, FiX } from "react-icons/fi";
import Bi from "./Bi";
import SecureImage from "./SecureImage";

// Shrinks a photo in the browser so uploads stay small (phone photos are often 4-8 MB).
async function compress(file, maxSide = 1280, quality = 0.7) {
  const dataUrl = await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
  const img = await new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = dataUrl;
  });
  const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", quality);
}

/**
 * Pick a photo from gallery or take one with the camera.
 * value: data URL or /api/assets/<id>. onChange(dataUrl | "").
 */
export default function PhotoPicker({ label, urdu, value, onChange, scope = "member", error }) {
  const galleryRef = useRef(null);
  const cameraRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState("");

  const handle = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setLocalError("Please choose a photo.");
      return;
    }
    setBusy(true);
    setLocalError("");
    try {
      onChange(await compress(file));
    } catch {
      setLocalError("Could not read this photo. Try another one.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <p className="text-sm font-semibold text-ink-800">
          <Bi en={label} ur={urdu} />
        </p>
      )}
      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-line bg-surface-100">
          <SecureImage src={value} scope={scope} alt={label || "Photo"} className="h-56 w-full" />
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Remove photo"
            className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink-700 shadow"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => cameraRef.current?.click()}
            className="flex min-h-[88px] flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-line bg-white text-ink-700 hover:border-primary-300"
          >
            <FiCamera className="h-6 w-6" aria-hidden />
            <span className="text-sm font-semibold">Take photo</span>
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => galleryRef.current?.click()}
            className="flex min-h-[88px] flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-line bg-white text-ink-700 hover:border-primary-300"
          >
            <FiImage className="h-6 w-6" aria-hidden />
            <span className="text-sm font-semibold">{busy ? "Loading…" : "From gallery"}</span>
          </button>
        </div>
      )}
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handle} />
      <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={handle} />
      {(error || localError) && <p className="text-sm font-medium text-danger-700">{error || localError}</p>}
    </div>
  );
}
