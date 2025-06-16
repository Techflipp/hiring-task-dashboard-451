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
import CameraViewLoading from "./CameraViewLoading";

export default function DemoGraphicLine({
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
      color: "var(--color-primary)",
    },
  } satisfies ChartConfig;

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
        )}
      </CardContent>
    </Card>
  );
}
