"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  Tooltip,
} from "recharts";
import type { WeeklyDataPoint } from "@/types/index";

interface WeeklyChartProps {
  data: WeeklyDataPoint[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as WeeklyDataPoint;
  return (
    <div
      className="glass-strong px-3 py-2 rounded-xl"
      style={{ fontSize: "0.8rem" }}
    >
      <p style={{ color: "var(--text-primary)" }} className="font-semibold">
        {d.consumed}g / {d.target}g
      </p>
    </div>
  );
}

export default function WeeklyChart({ data }: WeeklyChartProps) {
  const target = data[0]?.target ?? 140;

  return (
    <div className="glass-card p-5">
      <h3
        className="text-sm font-semibold mb-4"
        style={{ color: "var(--text-secondary)" }}
      >
        Últimos 7 dias
      </h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barCategoryGap="25%">
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
            vertical={false}
          />
          <XAxis
            dataKey="dayLabel"
            tick={{ fill: "rgba(245,245,247,0.4)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "rgba(245,245,247,0.3)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={35}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
          />
          <ReferenceLine
            y={target}
            stroke="var(--accent-green)"
            strokeDasharray="4 4"
            strokeOpacity={0.5}
          />
          <Bar dataKey="consumed" radius={[6, 6, 0, 0]} maxBarSize={32}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  entry.consumed >= target
                    ? "var(--accent-green)"
                    : entry.consumed >= target * 0.7
                      ? "var(--accent-blue)"
                      : entry.consumed >= target * 0.4
                        ? "var(--accent-orange)"
                        : "var(--accent-red)"
                }
                fillOpacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
