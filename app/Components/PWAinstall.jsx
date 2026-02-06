"use client";
import { useEffect, useState } from "react";

export default function PWAInstallBar() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showIOSHint, setShowIOSHint] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (
            window.matchMedia("(display-mode: standalone)").matches ||
            window.navigator.standalone === true
        ) {
            setIsInstalled(true);
            return;
        }

        // Detect iOS Safari
        const isIOS =
            /iphone|ipad|ipod/i.test(window.navigator.userAgent) &&
            !window.navigator.standalone;

        if (isIOS) {
            setShowIOSHint(true);
        }

        // Android / Desktop install prompt
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener("beforeinstallprompt", handler);

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
            setIsInstalled(true);
        }

        setDeferredPrompt(null);
    };

    if (isInstalled) return null;

    return (
        <div className="fixed bottom-4 left-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 rounded-xl bg-black p-4 shadow-xl">
            {deferredPrompt && (
                <div className="flex items-center justify-between gap-3">
                    <div className="text-sm text-white">
                        <p className="font-semibold">Install our app</p>
                        <p className="text-gray-300">
                            Faster access & offline support
                        </p>
                    </div>

                    <button
                        onClick={handleInstall}
                        className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
                    >
                        Install
                    </button>
                </div>
            )}

            {showIOSHint && !deferredPrompt && (
                <div className="text-sm text-white">
                    <p className="font-semibold">Install this app</p>
                    <p className="mt-1 text-gray-300">
                        Tap <span className="font-semibold">Share</span> →
                        <span className="font-semibold"> Add to Home Screen</span>
                    </p>
                </div>
            )}
        </div>
    );
}
