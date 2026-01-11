"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type Platform = "ios" | "android" | "desktop" | "unknown";

function detectPlatform(): Platform {
  if (typeof window === "undefined") return "unknown";

  const ua = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isAndroid = /android/.test(ua);

  if (isIOS) return "ios";
  if (isAndroid) return "android";
  return "desktop";
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;

  // Check if running as PWA
  const isStandaloneMode =
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

  return isStandaloneMode;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [platform, setPlatform] = useState<Platform>("unknown");
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed or running as PWA
    const wasDismissed = localStorage.getItem("pwa-prompt-dismissed");
    if (wasDismissed || isStandalone()) {
      setDismissed(true);
      return;
    }

    setPlatform(detectPlatform());

    // For Android/Desktop - listen for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // For iOS - show manual instructions after a delay
    const detectedPlatform = detectPlatform();
    if (detectedPlatform === "ios") {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 2000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("beforeinstallprompt", handler);
      };
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem("pwa-prompt-dismissed", "true");
    setShowPrompt(false);
    setDismissed(true);
  };

  if (dismissed || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm"
      >
        <div className="install-banner p-4 rounded">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚙</span>
            <div className="flex-1">
              <h3
                className="text-sm font-bold text-[var(--phosphor)] mb-1"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                Install Sacred Interface
              </h3>

              {platform === "ios" ? (
                <p className="text-xs text-[var(--foreground)] mb-3">
                  Tap the <span className="text-[var(--phosphor)]">Share</span> button, then{" "}
                  <span className="text-[var(--phosphor)]">&quot;Add to Home Screen&quot;</span> to
                  install this cogitator interface.
                </p>
              ) : platform === "android" ? (
                <p className="text-xs text-[var(--foreground)] mb-3">
                  Install this application for offline access and faster communion with the Machine
                  Spirit.
                </p>
              ) : (
                <p className="text-xs text-[var(--foreground)] mb-3">
                  Install the Omnissiah Protocol for direct access from your desktop.
                </p>
              )}

              <div className="flex gap-2">
                {platform !== "ios" && deferredPrompt && (
                  <button
                    onClick={handleInstall}
                    className="flex-1 py-2 px-3 bg-[var(--phosphor)] text-[var(--background)] text-xs font-mono uppercase"
                  >
                    INSTALL
                  </button>
                )}
                <button
                  onClick={handleDismiss}
                  className="py-2 px-3 border border-[var(--border)] text-[var(--foreground-dim)] text-xs font-mono uppercase"
                >
                  DISMISS
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
