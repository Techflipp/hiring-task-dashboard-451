"use client";

import { useEffect, useState } from "react";

interface ResponsiveChartProps {
  children: React.ReactNode;
  minHeight?: number;
}

export function ResponsiveChart({
  children,
  minHeight = 300,
}: ResponsiveChartProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: minHeight });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let height = minHeight;

      if (width < 640) {
        height = 250;
      } else if (width < 1024) {
        height = 300;
      } else {
        height = 350;
      }

      setDimensions({ width, height });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [minHeight]);

  return <div style={{ height: dimensions.height }}>{children}</div>;
}
