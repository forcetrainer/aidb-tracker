"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Digital click sound generator
class DigitalClickGenerator {
  private audioContext: AudioContext | null = null;

  private ensureContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  playClick() {
    const ctx = this.ensureContext();
    const now = ctx.currentTime;

    // Very short click
    const duration = 0.01;

    // Mid-low pitched oscillator
    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.setValueAtTime(400 + Math.random() * 100, now);

    // Secondary tone for texture
    const osc2 = ctx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(600 + Math.random() * 150, now);

    // Sharp gain envelope
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.07, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Bandpass for focused click sound
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.value = 500;
    bandpass.Q.value = 1.5;

    // Connect
    osc.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(bandpass);
    bandpass.connect(ctx.destination);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + duration);
    osc2.stop(now + duration);
  }
}

// Export for use in other components
export const digitalClickGenerator = new DigitalClickGenerator();

interface SpiritMessage {
  text: string;
  color: "green" | "amber";
}

interface MachineSpiritProps {
  messages: SpiritMessage[];
  onComplete?: () => void;
  header?: string;
}

export function MachineSpirit({ messages, onComplete, header = "MACHINE SPIRIT RESPONSE" }: MachineSpiritProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedChars, setDisplayedChars] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const clickGeneratorRef = useRef<DigitalClickGenerator | null>(null);

  // Initialize click generator
  useEffect(() => {
    clickGeneratorRef.current = new DigitalClickGenerator();
  }, []);

  const currentMessage = messages[currentLineIndex];
  const displayedText = currentMessage?.text.slice(0, displayedChars) || "";
  const isLineComplete = displayedChars >= (currentMessage?.text.length || 0);

  // Typewriter effect with sound
  useEffect(() => {
    if (!currentMessage) return;

    if (displayedChars < currentMessage.text.length) {
      const timer = setTimeout(() => {
        // Play click sound (skip for spaces)
        const nextChar = currentMessage.text[displayedChars];
        if (nextChar !== " " && clickGeneratorRef.current) {
          clickGeneratorRef.current.playClick();
        }
        setDisplayedChars((c) => c + 1);
      }, 35); // typing speed
      return () => clearTimeout(timer);
    } else if (currentLineIndex < messages.length - 1) {
      // Move to next line after a pause
      const timer = setTimeout(() => {
        setCurrentLineIndex((i) => i + 1);
        setDisplayedChars(0);
      }, 400);
      return () => clearTimeout(timer);
    } else if (!isComplete) {
      // All done - wait then auto-dismiss
      setIsComplete(true);
      const timer = setTimeout(() => {
        onComplete?.();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [displayedChars, currentLineIndex, currentMessage, messages.length, isComplete, onComplete]);

  const handleDismiss = useCallback(() => {
    onComplete?.();
  }, [onComplete]);

  return (
    <motion.div
      className="machine-spirit-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleDismiss}
    >
      <motion.div
        className="machine-spirit-dialog cursor-pointer"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={handleDismiss}
      >
        <div className="machine-spirit-header">{header}</div>

        <div className="space-y-2">
          {/* Completed lines */}
          {messages.slice(0, currentLineIndex).map((msg, i) => (
            <div key={i} className={`spirit-line ${msg.color}`}>
              {msg.text}
            </div>
          ))}

          {/* Current typing line */}
          {currentMessage && (
            <div className={`spirit-line ${currentMessage.color}`}>
              {displayedText}
              {!isLineComplete && (
                <span className={`typewriter-cursor ${currentMessage.color}`} />
              )}
            </div>
          )}
        </div>

        {/* Dismiss hint */}
        <motion.div
          className="mt-6 text-center text-xs text-[var(--foreground-dim)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: isComplete ? 1 : 0.3 }}
        >
          ++ CLICK TO ACKNOWLEDGE ++
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// Message generator helpers
export const SPIRIT_MESSAGES = {
  greeting: (): SpiritMessage[] => [
    { text: "COGITATOR SYSTEMS ONLINE.", color: "green" },
    { text: "MACHINE SPIRIT AWAKENED.", color: "green" },
    { text: "THE OMNISSIAH WATCHES OVER YOUR PROGRESS.", color: "amber" },
  ],

  sanctify: (riteNumber: number, riteTitle: string): SpiritMessage[] => [
    { text: `++ RITE ${riteNumber} SANCTIFIED ++`, color: "green" },
    { text: `${riteTitle.toUpperCase()}`, color: "green" },
    { text: "THE MACHINE SPIRIT IS PLEASED. PRAISE THE OMNISSIAH.", color: "amber" },
  ],

  unsanctify: (riteNumber: number): SpiritMessage[] => [
    { text: `RITE ${riteNumber} STATUS REVOKED.`, color: "green" },
    { text: "SANCTIFICATION WITHDRAWN. THE PATH CONTINUES.", color: "amber" },
  ],

  accessDataShrine: (riteTitle: string): SpiritMessage[] => [
    { text: "ACCESSING DATA-SHRINE...", color: "green" },
    { text: `${riteTitle.toUpperCase()}`, color: "amber" },
  ],

  allComplete: (): SpiritMessage[] => [
    { text: "++ ALL SACRED RITES COMPLETE ++", color: "green" },
    { text: "TOTAL SANCTIFICATION ACHIEVED.", color: "green" },
    { text: "YOU HAVE WALKED THE PATH OF IRON.", color: "amber" },
    { text: "PRAISE THE OMNISSIAH! HAIL THE MACHINE GOD!", color: "amber" },
  ],

  progressUpdate: (completed: number): SpiritMessage[] => [
    { text: `SANCTIFICATION PROGRESS: ${completed}/10 RITES.`, color: "green" },
    { text: completed >= 5
      ? "THE OMNISSIAH ACKNOWLEDGES YOUR DEVOTION."
      : "CONTINUE YOUR SACRED WORK, INITIATE.",
      color: "amber"
    },
  ],
};
