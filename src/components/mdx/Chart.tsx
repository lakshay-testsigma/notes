"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface ChartProps {
  data: { label: string; value: number }[];
  valueLabel?: string;
  caption?: string;
}

export function Chart({ data, valueLabel = "Value", caption }: ChartProps) {
  const config = {
    value: { label: valueLabel, color: "var(--chart-2)" },
  } satisfies ChartConfig;

  return (
    <figure className="my-6">
      <ChartContainer config={config} className="min-h-[220px] w-full">
        <BarChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis width={36} tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="value" fill="var(--color-value)" radius={4} />
        </BarChart>
      </ChartContainer>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
