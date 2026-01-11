"use client";

import { motion } from "framer-motion";
import { Weekend } from "@/lib/types";

interface RiteCardProps {
  weekend: Weekend;
  onClick: () => void;
}

export function RiteCard({ weekend, onClick }: RiteCardProps) {
  const progressPercent = weekend.completed ? 100 : 0;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        rite-card w-full h-full p-3 md:p-4 lg:p-5 text-left flex flex-col
        ${weekend.completed ? "sanctified" : ""}
      `}
    >
      {/* Rite Number */}
      <div className="flex items-center justify-between mb-2">
        <span
          className={`
            rite-number text-xs md:text-sm font-mono uppercase tracking-wider
            ${weekend.completed ? "phosphor-text" : ""}
          `}
        >
          RITE {weekend.id.toString().padStart(2, "0")}
        </span>
        {weekend.completed ? (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-[var(--phosphor)] text-sm"
          >
            ⚙
          </motion.span>
        ) : (
          <span className="text-[var(--amber)] text-xs">++</span>
        )}
      </div>

      {/* Title */}
      <h3
        className={`
          text-xs md:text-sm lg:text-base font-medium mb-2 md:mb-3 leading-tight flex-grow
          ${weekend.completed ? "text-[var(--phosphor)]" : "text-[var(--foreground)]"}
        `}
        style={{ fontFamily: "var(--font-cinzel)" }}
      >
        {weekend.title}
      </h3>

      {/* Mini progress bar */}
      <div className="sanctification-bar h-1 md:h-1.5 lg:h-2 rounded-sm">
        <motion.div
          className="sanctification-fill h-full rounded-sm"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Status indicator */}
      <div className="mt-2 md:mt-3 flex items-center gap-1.5">
        <div
          className={`
            w-2 h-2 md:w-2.5 md:h-2.5 rounded-full
            ${weekend.completed
              ? "bg-[var(--phosphor)] shadow-[0_0_5px_var(--phosphor)]"
              : "bg-[var(--amber)] shadow-[0_0_5px_var(--amber-glow)]"
            }
          `}
        />
        <span className={`text-xs md:text-sm font-mono ${weekend.completed ? "text-[var(--phosphor-dim)]" : "text-[var(--amber-dim)]"}`}>
          {weekend.completed ? "SANCTIFIED" : "PENDING"}
        </span>
      </div>
    </motion.button>
  );
}
