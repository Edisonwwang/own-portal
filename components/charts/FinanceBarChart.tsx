"use client";

import { chartTheme } from "@/lib/theme";
import type { FinanceMonthPoint } from "@/lib/types";
import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { EmptyState } from "./EmptyState";

export function FinanceBarChart({ data }: { data: FinanceMonthPoint[] }) {
  if (data.length === 0) {
    return <EmptyState message="No finance data yet" />;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.border} />
        <XAxis dataKey="month" tick={{ fill: chartTheme.textMuted, fontSize: 11 }} />
        <YAxis tick={{ fill: chartTheme.textMuted, fontSize: 11 }} />
        <Tooltip
          contentStyle={{ background: chartTheme.surface, border: `1px solid ${chartTheme.border}`, borderRadius: 6 }}
          labelStyle={{ color: chartTheme.text }}
          formatter={(value) => `MYR ${Number(value).toFixed(2)}`}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: chartTheme.textMuted }} />
        <Bar dataKey="income" name="Income" fill={chartTheme.income} opacity={0.85} radius={[3, 3, 0, 0]} />
        <Bar dataKey="expenses" name="Expenses" fill={chartTheme.expense} opacity={0.85} radius={[3, 3, 0, 0]} />
        <Line type="monotone" dataKey="net" name="Net" stroke={chartTheme.accent} strokeWidth={2} dot={{ r: 3 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
