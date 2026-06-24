"use client";

import { chartTheme } from "@/lib/theme";
import type { CategorySpend } from "@/lib/types";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { EmptyState } from "./EmptyState";

const COLORS = [chartTheme.accent, chartTheme.income, "#2196f3", "#9c27b0", "#ff9800", chartTheme.expense, "#00bcd4", "#8bc34a"];

export function SpendingPieChart({ data }: { data: CategorySpend[] }) {
  if (data.length === 0) {
    return <EmptyState message="No expenses this month" />;
  }

  const total = data.reduce((sum, item) => sum + item.total, 0);

  return (
    <div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="total" nameKey="category" paddingAngle={2}>
            {data.map((item, index) => (
              <Cell key={item.category} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: chartTheme.surface, border: `1px solid ${chartTheme.border}`, borderRadius: 6 }}
            formatter={(value) => `MYR ${Number(value).toFixed(2)}`}
          />
        </PieChart>
      </ResponsiveContainer>
      <ul className="mt-2 space-y-1 text-sm">
        {data.map((item, index) => (
          <li key={item.category} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: COLORS[index % COLORS.length] }} />
              <span className="text-[#e5e5e5]">{item.category}</span>
            </span>
            <span className="text-[#888888]">
              MYR {item.total.toFixed(2)}
              <span className="ml-2 text-xs">({((item.total / total) * 100).toFixed(0)}%)</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
