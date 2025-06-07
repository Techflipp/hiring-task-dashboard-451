"use client";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
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

export function DemoGraphicChart({
  analytics,
  item,
  date,
}: {
  analytics: getDemoGraphicsResultsResponse["analytics"];
  item: string;
  date: string;
}) {
  const chartData = Object.entries(
    analytics[item as keyof typeof analytics]
  ).map(([key, value]) => ({ key: key, value: value }));

  const chartConfig = {
    value: {
      label: "Value",
      color: "var(--color-sky-600)",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{item.split("_").join(" ").toUpperCase()}</CardTitle>
        <CardDescription>{`${new Date(date).toDateString()}`}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData} layout="vertical">
            <XAxis type="number" dataKey="value" hide />
            <YAxis
              dataKey="key"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(val) => val.split("_").join(" ")}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="value" fill="var(--color-value)" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
