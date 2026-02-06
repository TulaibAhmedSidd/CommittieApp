"use client";
import { useEffect, useState } from "react";

export default function PWAInstallBar() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showIOSHint, setShowIOSHint] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Detect mobile devices only
        const isMobileDevice =
            /iphone|ipad|ipod|android/i.test(navigator.userAgent);

        setIsMobile(isMobileDevice);

        if (!isMobileDevice) return;

        // Already installed
        if (
            window.matchMedia("(display-mode: standalone)").matches ||
            window.navigator.standalone === true
        ) {
            setIsInstalled(true);
            return;
        }

        // iOS detection
        const isIOS =
            /iphone|ipad|ipod/i.test(navigator.userAgent) &&
            !window.navigator.standalone;

        if (isIOS) {
            setShowIOSHint(true);
        }

        // Android install prompt
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener("beforeinstallprompt", handler);

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
        };
    }, []);

    // ❌ Do not render on desktop or if installed
    if (!isMobile || isInstalled) return null;

    return (
        <div className="fixed bottom-4 left-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 rounded-xl bg-black p-4 shadow-xl">
            {/* Android */}
            {deferredPrompt && (
                <div className="flex items-center justify-between gap-3">
                    <div className="text-sm text-white">
                        <p className="font-semibold">Install our app</p>
                        <p className="text-gray-300">
                            Faster access & offline support
                        </p>
                    </div>

                    <button
                        onClick={async () => {
                            deferredPrompt.prompt();
                            await deferredPrompt.userChoice;
                            setIsInstalled(true);
                            setDeferredPrompt(null);
                        }}
                        className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black"
                    >
                        Install
                    </button>
                </div>
            )}

            {/* iOS */}
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
