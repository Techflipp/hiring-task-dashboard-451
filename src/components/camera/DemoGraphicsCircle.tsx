"use client";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getDemoGraphicsResultsResponse } from "@/constants/apitypes";

export default function DemoGraphicCircle({
  analytics,
  item,
  date,
}: {
  analytics: getDemoGraphicsResultsResponse["analytics"];
  item: string;
  date: string;
}) {
  const chartData = Object.entries(
    analytics[item as keyof typeof analytics],
  ).map(([key, value]) => ({ key: key, value: value }));

  const chartConfig = {
    value: {
      label: "Value",
      color: "var(--color-sky-600)",
    },
  } satisfies ChartConfig;

  return (
    <Card className="aspect-square h-full w-full shadow-xl">
      <CardHeader>
        <CardTitle>{item.split("_").join(" ").toUpperCase()}</CardTitle>
        <CardDescription>{`${new Date(date).toDateString()}`}</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="size-full">
          <RadarChart data={chartData}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarGrid gridType="circle" />
            <PolarAngleAxis dataKey="key" />
            <Radar
              dataKey="value"
              fill="var(--color-value)"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
