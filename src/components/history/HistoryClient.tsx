"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CalendarHeatmap from "@/components/dashboard/CalendarHeatmap";
import type { CalendarDay } from "@/types/index";

interface HistoryClientProps {
  initialCalendar: CalendarDay[];
  initialYear: number;
  initialMonth: number;
}

export default function HistoryClient({
  initialCalendar,
  initialYear,
  initialMonth,
}: HistoryClientProps) {
  const [calendar, setCalendar] = useState(initialCalendar);
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);

  const handleChangeMonth = async (y: number, m: number) => {
    setYear(y);
    setMonth(m);
    try {
      const { getCalendarData } = await import("@/actions/protein");
      const data = await getCalendarData(y, m);
      setCalendar(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Stats from current calendar data
  const daysWithData = calendar.filter((d) => d.consumed > 0);
  const daysOnTarget = calendar.filter((d) => d.percentage >= 100);
  const totalProtein = calendar.reduce((sum, d) => sum + d.consumed, 0);
  const avgProtein =
    daysWithData.length > 0 ? Math.round(totalProtein / daysWithData.length) : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Histórico
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: "var(--text-secondary)" }}
        >
          Acompanhe sua consistência ao longo do tempo
        </p>
      </div>

      {/* Monthly Stats */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 text-center"
        >
          <p
            className="text-2xl font-bold"
            style={{ color: "var(--accent-green)" }}
          >
            {daysOnTarget.length}
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            Dias na meta
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-4 text-center"
        >
          <p
            className="text-2xl font-bold"
            style={{ color: "var(--accent-blue)" }}
          >
            {avgProtein}g
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            Média diária
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4 text-center"
        >
          <p
            className="text-2xl font-bold"
            style={{ color: "var(--accent-orange)" }}
          >
            {daysWithData.length}
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            Dias registrados
          </p>
        </motion.div>
      </div>

      {/* Calendar */}
      <CalendarHeatmap
        data={calendar}
        year={year}
        month={month}
        onChangeMonth={handleChangeMonth}
      />
    </motion.div>
  );
}
