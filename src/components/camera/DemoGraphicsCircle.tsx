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
import CameraViewLoading from "./CameraViewLoading";

export default function DemoGraphicCircle({
  analytics,
  item,
  date,
  loading,
}: {
  analytics: getDemoGraphicsResultsResponse["analytics"];
  item: string;
  date: string;
  loading: boolean;
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
  console.log(loading);

  return (
    <Card className="aspect-square h-full w-full shadow-xl">
      <CardHeader>
        <CardTitle>{item.split("_").join(" ").toUpperCase()}</CardTitle>
        <CardDescription>{`${new Date(date).toDateString()}`}</CardDescription>
      </CardHeader>
      <CardContent className="h-full w-full">
        {loading ? (
          <CameraViewLoading />
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
}
