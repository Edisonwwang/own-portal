"use client";

import { chartTheme } from "@/lib/theme";
import type { MoodDataPoint } from "@/lib/types";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { EmptyState } from "./EmptyState";

export function MoodTrendChart({ data }: { data: MoodDataPoint[] }) {
  if (data.length === 0) {
    return <EmptyState message="No mood data yet" />;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={chartTheme.accent} stopOpacity={0.3} />
            <stop offset="95%" stopColor={chartTheme.accent} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={chartTheme.textMuted} stopOpacity={0.2} />
            <stop offset="95%" stopColor={chartTheme.textMuted} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.border} />
        <XAxis dataKey="day" tick={{ fill: chartTheme.textMuted, fontSize: 11 }} />
        <YAxis domain={[1, 10]} tick={{ fill: chartTheme.textMuted, fontSize: 11 }} />
        <Tooltip
          contentStyle={{ background: chartTheme.surface, border: `1px solid ${chartTheme.border}`, borderRadius: 6 }}
          labelStyle={{ color: chartTheme.text }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: chartTheme.textMuted }} />
        <Area
          type="monotone"
          dataKey="avg_mood"
          name="Mood"
          stroke={chartTheme.accent}
          fill="url(#moodGrad)"
          strokeWidth={2}
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="avg_energy"
          name="Energy"
          stroke={chartTheme.textMuted}
          fill="url(#energyGrad)"
          strokeWidth={2}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
