"use client";

import { useEffect, useRef } from "react";

interface DemographicsChartProps {
  data: Record<string, number>;
  type: "gender" | "age" | "emotion" | "ethnicity";
}

export function DemographicsChart({ data, type }: DemographicsChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || Object.keys(data).length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const labels = Object.keys(data);
    const values = Object.values(data);
    const total = values.reduce((sum, val) => sum + val, 0);

    if (total === 0) return;

    const colors = [
      "#3B82F6", // blue
      "#10B981", // green
      "#F59E0B", // yellow
      "#EF4444", // red
      "#8B5CF6", // purple
      "#06B6D4", // cyan
      "#F97316", // orange
      "#EC4899", // pink
    ];

    const barWidth = canvas.width / labels.length;
    const maxValue = Math.max(...values);
    const barHeight = canvas.height - 60; // Leave space for labels

    // Draw bars
    labels.forEach((label, index) => {
      const value = values[index];
      const height = (value / maxValue) * barHeight;
      const x = index * barWidth + barWidth * 0.1;
      const y = canvas.height - 60 - height;

      // Bar
      ctx.fillStyle = colors[index % colors.length];
      ctx.fillRect(x, y, barWidth * 0.8, height);

      // Value label
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(value.toString(), x + barWidth * 0.4, y - 5);

      // Percentage label
      const percentage = ((value / total) * 100).toFixed(1);
      ctx.fillStyle = "#9CA3AF";
      ctx.font = "10px Arial";
      ctx.fillText(`${percentage}%`, x + barWidth * 0.4, y - 20);

      // Category label
      ctx.fillStyle = "#D1D5DB";
      ctx.font = "11px Arial";
      ctx.fillText(
        label.charAt(0).toUpperCase() + label.slice(1).replace("_", " "),
        x + barWidth * 0.4,
        canvas.height - 10
      );
    });
  }, [data, type]);

  if (Object.keys(data).length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="w-full h-auto"
      />
    </div>
  );
}
