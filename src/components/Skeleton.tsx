import React from "react";

export function Skeleton({
  className = "",
  style = {},
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-700 rounded ${className}`}
      style={style}
    />
  );
}
