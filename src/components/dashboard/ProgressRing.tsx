"use client";

import { motion } from "framer-motion";
import { getProgressColor } from "@/lib/utils";

interface ProgressRingProps {
  percentage: number;
  consumed: number;
  target: number;
  size?: number;
  strokeWidth?: number;
}

export default function ProgressRing({
  percentage,
  consumed,
  target,
  size = 220,
  strokeWidth = 14,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  const color = getProgressColor(percentage);

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.06)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            filter: `drop-shadow(0 0 8px ${color}50)`,
          }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute flex flex-col items-center">
        <motion.span
          key={consumed}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-4xl font-bold tabular-nums"
          style={{ color: "var(--text-primary)" }}
        >
          {consumed}g
        </motion.span>
        <span
          className="text-sm mt-1"
          style={{ color: "var(--text-secondary)" }}
        >
          de {target}g
        </span>
        <span
          className="text-xs mt-0.5 font-medium"
          style={{ color }}
        >
          {percentage}%
        </span>
      </div>
    </div>
  );
}
