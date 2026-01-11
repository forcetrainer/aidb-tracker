"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTracker } from "@/lib/useTracker";
import { useMachineSpirit } from "@/lib/useMachineSpirit";
import { mechanicusPhrases } from "@/lib/data";
import { RiteCard } from "./RiteCard";
import { RiteDetail } from "./RiteDetail";
import { InstallPrompt } from "./InstallPrompt";
import { MachineSpirit, digitalClickGenerator } from "./MachineSpirit";

// Typing text component for loading screen
function TypingText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (displayed < text.length) {
      const timer = setTimeout(() => {
        if (text[displayed] !== " ") {
          digitalClickGenerator.playClick();
        }
        setDisplayed(d => d + 1);
      }, 40);
      return () => clearTimeout(timer);
    } else {
      onComplete?.();
    }
  }, [displayed, text, onComplete]);

  return (
    <span>
      {text.slice(0, displayed)}
      {displayed < text.length && <span className="typewriter-cursor" />}
    </span>
  );
}

export function Tracker() {
  const searchParams = useSearchParams();
  const sessionStarted = searchParams.get("session") === "start";

  const {
    weekends,
    isLoaded,
    isDemo,
    toggleComplete,
    updateNotes,
    updateScorecard,
    completedCount,
    progressPercentage,
  } = useTracker();

  // Show splash on every visit UNLESS we just came from auth/demo redirect
  const [showSplash, setShowSplash] = useState(true);
  const [selectedRiteId, setSelectedRiteId] = useState<number | null>(null);

  // Check for session=start param and hide splash if present, then clean URL
  useEffect(() => {
    if (sessionStarted) {
      setShowSplash(false);
      // Clean up the URL by removing the query param
      window.history.replaceState({}, "", "/");
    }
  }, [sessionStarted]);
  const [activeTab, setActiveTab] = useState<"rites" | "progress">("rites");
  const [hasStarted, setHasStarted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const prevCompletedRef = useRef(completedCount);

  const spirit = useMachineSpirit();
  const selectedRite = weekends.find((w) => w.id === selectedRiteId);

  // Show initialization on first load
  useEffect(() => {
    if (isLoaded && !isInitialized) {
      const timer = setTimeout(() => {
        spirit.greet();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, isInitialized, spirit]);

  // Detect when all 10 are complete
  useEffect(() => {
    if (prevCompletedRef.current < 10 && completedCount === 10) {
      spirit.allComplete();
    }
    prevCompletedRef.current = completedCount;
  }, [completedCount, spirit]);

  // Handle rite selection
  const handleRiteSelect = (id: number) => {
    const rite = weekends.find((w) => w.id === id);
    if (rite) {
      spirit.accessDataShrine(rite.title);
    }
    setSelectedRiteId(id);
  };

  // Handle toggle with Machine Spirit feedback
  const handleToggleComplete = (id: number) => {
    const rite = weekends.find((w) => w.id === id);
    if (rite) {
      if (rite.completed) {
        spirit.unsanctify(id);
      } else {
        spirit.sanctify(id, rite.title);
      }
    }
    toggleComplete(id);
  };

  // Handle initialization complete
  const handleInitComplete = () => {
    spirit.closeDialog();
    setIsInitialized(true);
  };

  // Splash screen - choose mode (always shows unless redirected with ?session=start)
  if (showSplash && !sessionStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-6xl mb-6"
          >
            ⚙
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl font-bold phosphor-text mb-2"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            OMNISSIAH PROTOCOL
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xs text-[var(--foreground-dim)] font-mono mb-8"
          >
            AI RESOLUTION TRACKER v1.0
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col gap-4"
          >
            <motion.a
              href="/?auth"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 border border-[var(--phosphor)] text-[var(--phosphor)] font-mono text-sm uppercase tracking-wider hover:bg-[var(--phosphor)]/10 transition-colors shadow-[0_0_20px_var(--phosphor-glow)] cursor-pointer"
            >
              ++ Initialize Protocol ++
            </motion.a>
            <motion.a
              href="/?demo"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 border border-[var(--amber)] text-[var(--amber)] font-mono text-sm uppercase tracking-wider hover:bg-[var(--amber)]/10 transition-colors shadow-[0_0_20px_var(--amber-glow)] cursor-pointer"
            >
              ++ Training Simulation ++
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Start screen - enables audio (after auth/demo selection)
  if (!hasStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl mb-6"
          >
            ⚙
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xs text-[var(--foreground-dim)] font-mono mb-6 uppercase"
          >
            {isDemo ? "Training Simulation Ready" : "Protocol Access Granted"}
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setHasStarted(true)}
            className="px-8 py-4 border border-[var(--phosphor)] text-[var(--phosphor)] font-mono text-sm uppercase tracking-wider hover:bg-[var(--phosphor)]/10 transition-colors shadow-[0_0_20px_var(--phosphor-glow)]"
          >
            ++ Begin ++
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Loading/initialization state
  if (!isLoaded || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-4xl mb-4"
          >
            ⚙
          </motion.div>
          <p className="phosphor-text font-mono text-sm">
            <TypingText text={!isLoaded ? "AWAKENING MACHINE SPIRIT..." : "INITIALIZING COGITATOR..."} />
          </p>
        </motion.div>

        {/* Initialization Dialog */}
        <AnimatePresence>
          {spirit.isOpen && (
            <MachineSpirit
              messages={spirit.messages}
              header={spirit.header}
              onComplete={handleInitComplete}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top Bar */}
      <header className="top-bar sticky top-0 z-40 px-4 py-3 safe-top">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙</span>
            <h1
              className="text-sm md:text-lg lg:text-xl font-bold phosphor-text tracking-wide"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              OMNISSIAH PROTOCOL
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {isDemo && (
              <span className="text-[10px] px-2 py-0.5 bg-[var(--amber)]/20 text-[var(--amber)] font-mono uppercase border border-[var(--amber-dim)]">
                Demo
              </span>
            )}
            <div className="text-xs md:text-sm font-mono">
              <span className="text-[var(--amber)]">{completedCount}</span>
              <span className="text-[var(--foreground-dim)]">/</span>
              <span className="text-[var(--phosphor)]">10</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20">
        <AnimatePresence mode="wait">
          {activeTab === "rites" ? (
            <motion.div
              key="rites"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto"
            >
              {/* Overall Progress */}
              <div className="mb-6 md:mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs md:text-sm font-mono text-[var(--amber)] uppercase">
                    ++ {mechanicusPhrases.progress} ++
                  </span>
                  <span className="text-xs md:text-sm font-mono phosphor-text">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <div className="sanctification-bar h-3 md:h-4 rounded">
                  <motion.div
                    className="sanctification-fill h-full rounded"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                {completedCount === 10 && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mt-3 phosphor-text phosphor-glow font-mono text-sm"
                  >
                    {mechanicusPhrases.allComplete}
                  </motion.p>
                )}
              </div>

              {/* Rites Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-5 auto-rows-fr">
                {weekends.map((weekend, index) => (
                  <motion.div
                    key={weekend.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <RiteCard
                      weekend={weekend}
                      onClick={() => handleRiteSelect(weekend.id)}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Mechanicus blessing */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-8 text-xs font-mono text-[var(--foreground-dim)] opacity-50 cursor-pointer hover:opacity-100 hover:text-[var(--amber)] transition-all"
                onClick={() => spirit.showProgress(completedCount)}
              >
                {mechanicusPhrases.greeting}
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="progress"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto"
            >
              {/* Progress Overview */}
              <div className="mb-6">
                <h2
                  className="text-xl font-bold phosphor-text mb-4"
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  Sanctification Progress
                </h2>

                {/* Large progress visualization */}
                <div className="metal-plate p-6 mb-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative">
                      <svg className="w-32 h-32" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="var(--border)"
                          strokeWidth="8"
                        />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="var(--phosphor)"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 45}`}
                          strokeDashoffset={2 * Math.PI * 45 * (1 - progressPercentage / 100)}
                          initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                          animate={{
                            strokeDashoffset: 2 * Math.PI * 45 * (1 - progressPercentage / 100),
                          }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          transform="rotate(-90 50 50)"
                          style={{
                            filter: "drop-shadow(0 0 5px var(--phosphor-dim))",
                          }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold phosphor-text font-mono">
                          {Math.round(progressPercentage)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-sm text-[var(--foreground)]">
                    {completedCount} of 10 Sacred Rites completed
                  </p>
                </div>

                {/* Individual rite progress bars */}
                <div className="space-y-3">
                  {weekends.map((weekend) => (
                    <button
                      key={weekend.id}
                      onClick={() => handleRiteSelect(weekend.id)}
                      className="w-full metal-plate p-3 flex items-center gap-3 text-left hover:border-[var(--phosphor-dim)] transition-colors"
                    >
                      <span
                        className={`
                          w-8 h-8 flex items-center justify-center font-mono text-sm
                          ${weekend.completed
                            ? "bg-[var(--phosphor)] text-[var(--background)]"
                            : "border border-[var(--border)] text-[var(--foreground-dim)]"
                          }
                        `}
                      >
                        {weekend.completed ? "⚙" : weekend.id}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm truncate ${
                            weekend.completed ? "phosphor-text" : "text-[var(--foreground)]"
                          }`}
                        >
                          {weekend.title}
                        </p>
                        <div className="sanctification-bar h-1 mt-1 rounded-sm">
                          <div
                            className={`sanctification-fill h-full rounded-sm ${
                              weekend.completed ? "w-full" : "w-0"
                            }`}
                          />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav fixed bottom-0 left-0 right-0 z-40 safe-bottom">
        <div className="flex max-w-4xl mx-auto">
          <button
            onClick={() => setActiveTab("rites")}
            className={`bottom-nav-item flex-1 py-4 flex flex-col items-center gap-1 ${
              activeTab === "rites" ? "active" : ""
            }`}
          >
            <span className="text-lg">⚙</span>
            <span className="text-xs font-mono uppercase">Rites</span>
          </button>
          <button
            onClick={() => setActiveTab("progress")}
            className={`bottom-nav-item flex-1 py-4 flex flex-col items-center gap-1 ${
              activeTab === "progress" ? "active" : ""
            }`}
          >
            <span className="text-lg">◐</span>
            <span className="text-xs font-mono uppercase">Progress</span>
          </button>
        </div>
      </nav>

      {/* Rite Detail Modal */}
      <AnimatePresence>
        {selectedRite && (
          <RiteDetail
            weekend={selectedRite}
            onClose={() => setSelectedRiteId(null)}
            onToggleComplete={handleToggleComplete}
            onUpdateNotes={updateNotes}
            onUpdateScorecard={updateScorecard}
          />
        )}
      </AnimatePresence>

      {/* PWA Install Prompt */}
      <InstallPrompt />

      {/* Machine Spirit Dialog */}
      <AnimatePresence>
        {spirit.isOpen && (
          <MachineSpirit
            messages={spirit.messages}
            header={spirit.header}
            onComplete={spirit.closeDialog}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
