"use client";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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
}: {
  analytics: getDemoGraphicsResultsResponse["analytics"];
  item: string;
}) {
  const chartData = Object.entries(
    analytics[item as keyof typeof analytics]
  ).map(([key, value]) => ({ key: key, value: value }));

  const chartConfig = {
    value: {
      label: "Value",
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{item.split("_").join(" ").toUpperCase()}</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="key"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="value" fill="var(--color-value)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
