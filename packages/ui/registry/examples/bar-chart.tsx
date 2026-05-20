"use client";

// In your app (monorepo/npm): import { BarChart, Bar, BarXAxis, Grid, ChartTooltip } from "@bklitui/ui/charts"
import {
  Bar,
  BarChart,
  BarXAxis,
  ChartTooltip,
  Grid,
} from "@/components/charts";

const data = [
  { month: "Jan", revenue: 12_000, profit: 4500 },
  { month: "Feb", revenue: 15_500, profit: 5200 },
  { month: "Mar", revenue: 11_000, profit: 3800 },
  { month: "Apr", revenue: 18_500, profit: 7100 },
  { month: "May", revenue: 16_800, profit: 5400 },
  { month: "Jun", revenue: 21_200, profit: 8800 },
];

export default function Component() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-3xl">
        <BarChart data={data} xDataKey="month">
          <Grid horizontal />
          <Bar
            dataKey="revenue"
            fill="var(--chart-line-primary)"
            lineCap="round"
          />
          <Bar
            dataKey="profit"
            fill="var(--chart-line-secondary)"
            lineCap="round"
          />
          <BarXAxis />
          <ChartTooltip />
        </BarChart>
      </div>
    </main>
  );
}
