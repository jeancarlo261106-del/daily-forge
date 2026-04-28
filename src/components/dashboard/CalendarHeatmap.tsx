"use client";

import { getProgressColor } from "@/lib/utils";
import type { CalendarDay } from "@/types/index";

interface CalendarHeatmapProps {
  data: CalendarDay[];
  year: number;
  month: number;
  onChangeMonth: (year: number, month: number) => void;
}

const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTH_LABELS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export default function CalendarHeatmap({
  data,
  year,
  month,
  onChangeMonth,
}: CalendarHeatmapProps) {
  // First day of month (0 = Sunday)
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const today = new Date().toISOString().split("T")[0];

  const prevMonth = () => {
    if (month === 1) onChangeMonth(year - 1, 12);
    else onChangeMonth(year, month - 1);
  };

  const nextMonth = () => {
    if (month === 12) onChangeMonth(year + 1, 1);
    else onChangeMonth(year, month + 1);
  };

  return (
    <div className="glass-card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
          style={{
            background: "var(--bg-input)",
            color: "var(--text-secondary)",
          }}
        >
          ‹
        </button>
        <h3
          className="text-sm font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          {MONTH_LABELS[month - 1]} {year}
        </h3>
        <button
          onClick={nextMonth}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
          style={{
            background: "var(--bg-input)",
            color: "var(--text-secondary)",
          }}
        >
          ›
        </button>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAY_LABELS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] py-1 font-medium"
            style={{ color: "var(--text-tertiary)" }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for offset */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Day cells */}
        {data.map((day) => {
          const dayNum = parseInt(day.date.split("-")[2]);
          const isToday = day.date === today;
          const color =
            day.consumed > 0 ? getProgressColor(day.percentage) : "transparent";
          const opacity = day.consumed > 0 ? Math.max(0.3, Math.min(1, day.percentage / 100)) : 0;

          return (
            <div
              key={day.date}
              className="aspect-square rounded-lg flex items-center justify-center text-[11px] font-medium relative transition-all"
              style={{
                background:
                  day.consumed > 0
                    ? `${color}${Math.round(opacity * 40).toString(16).padStart(2, "0")}`
                    : "rgba(255, 255, 255, 0.02)",
                color:
                  day.consumed > 0
                    ? "var(--text-primary)"
                    : "var(--text-tertiary)",
                border: isToday
                  ? "1px solid var(--accent-blue)"
                  : "1px solid transparent",
              }}
              title={`${day.consumed}g / ${day.target}g`}
            >
              {dayNum}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div
        className="flex items-center justify-center gap-4 mt-4 text-[10px]"
        style={{ color: "var(--text-tertiary)" }}
      >
        <span className="flex items-center gap-1">
          <span
            className="w-2.5 h-2.5 rounded-sm"
            style={{ background: "var(--accent-red)", opacity: 0.5 }}
          />
          &lt;40%
        </span>
        <span className="flex items-center gap-1">
          <span
            className="w-2.5 h-2.5 rounded-sm"
            style={{ background: "var(--accent-orange)", opacity: 0.6 }}
          />
          40-70%
        </span>
        <span className="flex items-center gap-1">
          <span
            className="w-2.5 h-2.5 rounded-sm"
            style={{ background: "var(--accent-blue)", opacity: 0.7 }}
          />
          70-100%
        </span>
        <span className="flex items-center gap-1">
          <span
            className="w-2.5 h-2.5 rounded-sm"
            style={{ background: "var(--accent-green)", opacity: 0.9 }}
          />
          100%
        </span>
      </div>
    </div>
  );
}
