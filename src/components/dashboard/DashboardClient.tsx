"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import ProgressRing from "@/components/dashboard/ProgressRing";
import WeeklyChart from "@/components/dashboard/WeeklyChart";
import CalendarHeatmap from "@/components/dashboard/CalendarHeatmap";
import EntryList from "@/components/dashboard/EntryList";
import QuickAdd from "@/components/dashboard/QuickAdd";
import { getGreeting, formatDateDisplay } from "@/lib/utils";
import type {
  DailyProgress,
  WeeklyDataPoint,
  CalendarDay,
} from "@/types/index";

interface DashboardClientProps {
  initialProgress: DailyProgress;
  initialWeekly: WeeklyDataPoint[];
  initialCalendar: CalendarDay[];
  initialAverage: number;
  userName: string;
  calendarYear: number;
  calendarMonth: number;
}

export default function DashboardClient({
  initialProgress,
  initialWeekly,
  initialCalendar,
  initialAverage,
  userName,
  calendarYear,
  calendarMonth,
}: DashboardClientProps) {
  const [progress, setProgress] = useState(initialProgress);
  const [weekly, setWeekly] = useState(initialWeekly);
  const [calendar, setCalendar] = useState(initialCalendar);
  const [average, setAverage] = useState(initialAverage);
  const [calYear, setCalYear] = useState(calendarYear);
  const [calMonth, setCalMonth] = useState(calendarMonth);

  const refreshData = useCallback(async () => {
    try {
      const { getDailyProgress, getWeeklyData, getWeeklyAverage, getCalendarData } =
        await import("@/actions/protein");
      const [p, w, a, c] = await Promise.all([
        getDailyProgress(),
        getWeeklyData(),
        getWeeklyAverage(),
        getCalendarData(calYear, calMonth),
      ]);
      setProgress(p);
      setWeekly(w);
      setAverage(a);
      setCalendar(c);
    } catch (err) {
      console.error("Failed to refresh:", err);
    }
  }, [calYear, calMonth]);

  const handleChangeMonth = async (year: number, month: number) => {
    setCalYear(year);
    setCalMonth(month);
    try {
      const { getCalendarData } = await import("@/actions/protein");
      const c = await getCalendarData(year, month);
      setCalendar(c);
    } catch (err) {
      console.error("Failed to load calendar:", err);
    }
  };

  const greeting = getGreeting();
  const today = formatDateDisplay(new Date());

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-24"
    >
      {/* Greeting */}
      <motion.div variants={itemVariants}>
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          {greeting}, {userName} 👋
        </h1>
        <p
          className="text-sm mt-1 capitalize"
          style={{ color: "var(--text-secondary)" }}
        >
          {today}
        </p>
      </motion.div>

      {/* Progress Ring */}
      <motion.div variants={itemVariants} className="glass-card p-6 flex flex-col items-center">
        <ProgressRing
          percentage={progress.percentage}
          consumed={progress.consumed}
          target={progress.target}
        />
        <div className="flex gap-6 mt-5">
          <StatBadge
            label="Meta"
            value={`${progress.target}g`}
            color="var(--accent-blue)"
          />
          <StatBadge
            label="Restante"
            value={`${Math.max(0, progress.target - progress.consumed)}g`}
            color="var(--accent-orange)"
          />
          <StatBadge
            label="Média 7d"
            value={`${average}g`}
            color="var(--accent-purple)"
          />
        </div>
      </motion.div>

      {/* Today's Entries */}
      <motion.div variants={itemVariants}>
        <EntryList entries={progress.entries} />
      </motion.div>

      {/* Weekly Chart */}
      <motion.div variants={itemVariants}>
        <WeeklyChart data={weekly} />
      </motion.div>

      {/* Calendar */}
      <motion.div variants={itemVariants}>
        <CalendarHeatmap
          data={calendar}
          year={calYear}
          month={calMonth}
          onChangeMonth={handleChangeMonth}
        />
      </motion.div>

      {/* Quick Add FAB */}
      <QuickAdd onAdded={refreshData} />
    </motion.div>
  );
}

function StatBadge({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="text-center">
      <p
        className="text-lg font-bold tabular-nums"
        style={{ color }}
      >
        {value}
      </p>
      <p
        className="text-xs mt-0.5"
        style={{ color: "var(--text-tertiary)" }}
      >
        {label}
      </p>
    </div>
  );
}
