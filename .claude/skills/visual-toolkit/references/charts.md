# Charts — recharts (default) + Chart.js (when needed)

Quantitative data: comparison, trend, distribution, share. Both libs are available; **pick recharts unless it can't do the job.**

## Which one

| Situation | Use |
|---|---|
| bar, line, area, pie/donut, scatter, composed, most dashboards | **recharts** (installed, RSC-friendly, shadcn `chart.tsx` wrapper) |
| radar, polar-area, mixed bar+line with rich per-point animation, canvas perf on 10k+ points, a Chart.js-specific plugin | **Chart.js** via `react-chartjs-2` |

recharts is default: zero new deps, composable React, works with the existing shadcn chart theming. Add Chart.js (`chart.js` + `react-chartjs-2`) only when a chart type or animation recharts lacks.

## recharts recipe (via shadcn chart wrapper)

shadcn ships `src/components/ui/chart.tsx` (`ChartContainer`, `ChartTooltip`, `ChartConfig`) — colors come from CSS vars so charts match light/dark automatically.

```tsx
// src/components/mdx/Chart.tsx  — thin MDX wrapper around a recharts chart
"use client";
import { Bar, BarChart, XAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const config = { value: { label: "Revenue", color: "var(--chart-1)" } } satisfies ChartConfig;

export function Chart({ data }: { data: { month: string; value: number }[] }) {
  return (
    <figure className="my-6">
      <ChartContainer config={config} className="min-h-[220px] w-full">
        <BarChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="value" fill="var(--color-value)" radius={4} />
        </BarChart>
      </ChartContainer>
    </figure>
  );
}
```

## Chart.js recipe (only when needed)

```tsx
// src/components/mdx/ChartJS.tsx
"use client";
import { Radar } from "react-chartjs-2";
import { Chart as C, RadialLinearScale, PointElement, LineElement, Filler, Tooltip } from "chart.js";
C.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

export function ChartJS({ data }: { data: any }) {
  return <div className="my-6"><Radar data={data} options={{ responsive: true }} /></div>;
}
```

## Rules

- Colors from theme CSS vars (`--chart-1..5`), never hard-coded hex — must read in both themes.
- Label axes with units; drop chart-junk (no 3D, no heavy gridlines, no legend when one series).
- One message per chart; put it in the caption ("Revenue beat target every month after Feb").
- Prefer a small table when there are ≤ 4 numbers — a chart is overkill.
