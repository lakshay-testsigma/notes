"use client";

import { Radar } from "react-chartjs-2";
import { useTheme } from "next-themes";
import {
  Chart as ChartJSCore,
  Filler,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
  type ChartData,
} from "chart.js";

ChartJSCore.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

export function ChartJS({
  data,
  caption,
}: {
  data: ChartData<"radar">;
  caption?: string;
}) {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  const grid = dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)";
  const text = dark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)";

  return (
    <figure className="my-6 flex flex-col items-center gap-2">
      <div className="aspect-square w-full max-w-md">
        <Radar
          key={resolvedTheme}
          data={data}
          options={{
            responsive: true,
            scales: {
              r: {
                grid: { color: grid },
                angleLines: { color: grid },
                ticks: { color: text, backdropColor: "transparent" },
                pointLabels: { color: text },
              },
            },
          }}
        />
      </div>
      {caption && <figcaption className="text-sm text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}
