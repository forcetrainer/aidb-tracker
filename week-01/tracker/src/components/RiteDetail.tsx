"use client";

import { motion } from "framer-motion";
import { Weekend, WeekendScorecard } from "@/lib/types";
import { mechanicusPhrases } from "@/lib/data";

interface RiteDetailProps {
  weekend: Weekend;
  onClose: () => void;
  onToggleComplete: (id: number) => void;
  onUpdateNotes: (id: number, notes: string) => void;
  onUpdateScorecard: (id: number, field: keyof WeekendScorecard, value: number) => void;
}

function StarRating({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-mono text-[var(--foreground-dim)] uppercase">
        {label}
      </span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star === value ? 0 : star)}
            className={`star-rating text-lg ${star <= value ? "filled" : ""}`}
          >
            ⚙
          </button>
        ))}
      </div>
    </div>
  );
}

export function RiteDetail({
  weekend,
  onClose,
  onToggleComplete,
  onUpdateNotes,
  onUpdateScorecard,
}: RiteDetailProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[var(--background)]/95 overflow-y-auto"
    >
      {/* Header */}
      <div className="top-bar sticky top-0 z-10 px-4 py-3 flex items-center justify-between safe-top">
        <button
          onClick={onClose}
          className="text-[var(--amber)] font-mono text-sm flex items-center gap-2 hover:text-[var(--phosphor)] transition-colors"
        >
          <span>←</span>
          <span>RETURN</span>
        </button>
        <span className="text-xs font-mono">
          <span className="text-[var(--amber)]">RITE {weekend.id.toString().padStart(2, "0")}</span>
          <span className="text-[var(--foreground-dim)]"> / </span>
          <span className="text-[var(--phosphor)]">10</span>
        </span>
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Title section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <span
            className={`
              text-xs font-mono uppercase tracking-widest mb-2 block
              ${weekend.completed ? "phosphor-text" : "text-[var(--amber)]"}
            `}
          >
            ++ {weekend.completed ? mechanicusPhrases.complete : mechanicusPhrases.incomplete} ++
          </span>
          <h1
            className={`
              text-2xl md:text-3xl font-bold mb-3
              ${weekend.completed ? "phosphor-text" : "text-[var(--foreground-bright)]"}
            `}
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            {weekend.title}
          </h1>
          <p className="text-[var(--foreground)] text-sm">
            <span className="text-[var(--amber)]">OBJECTIVE:</span> {weekend.goal}
          </p>
        </motion.div>

        {/* Sanctification toggle */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <button
            onClick={() => onToggleComplete(weekend.id)}
            className={`
              w-full py-4 px-6 font-mono text-sm uppercase tracking-wider
              transition-all duration-300 flex items-center justify-center gap-3
              ${
                weekend.completed
                  ? "bg-[var(--phosphor)] text-[var(--background)] shadow-[0_0_20px_var(--phosphor-dim)]"
                  : "border border-[var(--amber)] text-[var(--amber)] hover:bg-[var(--amber)]/10 shadow-[0_0_10px_var(--amber-glow)]"
              }
            `}
          >
            <span className="text-lg">{weekend.completed ? "⚙" : "+"}</span>
            <span>{weekend.completed ? "RITE SANCTIFIED" : "MARK AS SANCTIFIED"}</span>
          </button>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 mb-6"
        >
          <div className="metal-plate p-4">
            <h3 className="text-xs font-mono text-[var(--amber)] uppercase mb-2">
              ++ REQUIRED DELIVERABLE ++
            </h3>
            <p className="text-sm text-[var(--foreground)]">{weekend.deliverable}</p>
          </div>

          <div className="metal-plate p-4">
            <h3 className="text-xs font-mono text-[var(--amber)] uppercase mb-2">
              ++ COMPLETION CRITERIA ++
            </h3>
            <p className="text-sm text-[var(--foreground)]">{weekend.doneWhen}</p>
          </div>
        </motion.div>

        {/* Cogitator Records (Notes) */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h3 className="text-xs font-mono text-[var(--amber)] uppercase mb-2">
            ++ {mechanicusPhrases.notes} ++
          </h3>
          <textarea
            value={weekend.notes}
            onChange={(e) => onUpdateNotes(weekend.id, e.target.value)}
            placeholder="Record your observations, learnings, and sacred insights..."
            className="data-log w-full min-h-[120px]"
          />
        </motion.div>

        {/* Sacred Metrics (Scorecard) */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h3 className="text-xs font-mono text-[var(--amber)] uppercase mb-3">
            ++ {mechanicusPhrases.scorecard} ++
          </h3>
          <div className="grid grid-cols-3 gap-4 metal-plate p-4">
            <StarRating
              label={mechanicusPhrases.outcome}
              value={weekend.scorecard.outcomeQuality}
              onChange={(v) => onUpdateScorecard(weekend.id, "outcomeQuality", v)}
            />
            <StarRating
              label={mechanicusPhrases.timeSaved}
              value={weekend.scorecard.timeSaved}
              onChange={(v) => onUpdateScorecard(weekend.id, "timeSaved", v)}
            />
            <StarRating
              label={mechanicusPhrases.repeatability}
              value={weekend.scorecard.repeatability}
              onChange={(v) => onUpdateScorecard(weekend.id, "repeatability", v)}
            />
          </div>
        </motion.div>

        {/* Binary signature */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs font-mono text-[var(--foreground-dim)] opacity-30"
        >
          01001111 01101101 01101110 01101001 01110011 01110011 01101001 01100001 01101000
        </motion.div>
      </div>
    </motion.div>
  );
}
