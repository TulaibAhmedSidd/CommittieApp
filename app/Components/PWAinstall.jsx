"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FiDownload, FiX } from "react-icons/fi";

// "Add to home screen" bar. Android: real install button. iOS: one-line hint. Can be dismissed.
// Hidden inside the app areas (they have their own bottom nav) and after dismissing.
export default function InstallBar() {
  const pathname = usePathname();
  const [prompt, setPrompt] = useState(null);
  const [ios, setIos] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = localStorage.getItem("install_dismissed") === "1";
    } catch {}
    const standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    const mobile = /iphone|ipad|ipod|android/i.test(navigator.userAgent);
    if (dismissed || standalone || !mobile) return;

    if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
      setIos(true);
      setHidden(false);
    }
    const handler = (e) => {
      e.preventDefault();
      setPrompt(e);
      setHidden(false);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const inApp = pathname.startsWith("/admin") || pathname.startsWith("/userDash");
  if (hidden || inApp || (!prompt && !ios)) return null;

  const dismiss = () => {
    setHidden(true);
    try {
      localStorage.setItem("install_dismissed", "1");
    } catch {}
  };

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 flex items-center gap-3 rounded-xl border border-line bg-white p-3 shadow-sheet">
      <FiDownload className="h-5 w-5 shrink-0 text-primary-600" aria-hidden />
      <p className="flex-1 text-sm text-ink-800">{ios ? "Tap Share, then “Add to Home Screen”." : "Add CommittieApp to your home screen."}</p>
      {prompt && (
        <button
          type="button"
          onClick={async () => {
            prompt.prompt();
            await prompt.userChoice;
            dismiss();
          }}
          className="min-h-[40px] rounded-lg bg-primary-600 px-3 text-sm font-semibold text-white"
        >
          Install
        </button>
      )}
      <button type="button" onClick={dismiss} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full text-ink-500 hover:bg-surface-100">
        <FiX className="h-5 w-5" />
      </button>
    </div>
  );
}
