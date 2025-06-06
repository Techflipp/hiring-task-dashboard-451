export function formatConfigValue(
  value: number | undefined,
  suffix?: string
): string {
  if (value === undefined || value === null) {
    return "Default";
  }
  return suffix ? `${value}${suffix}` : String(value);
}

export function formatPercentage(value: number | undefined): string {
  if (value === undefined || value === null) {
    return "Default";
  }
  return `${(value * 100).toFixed(0)}%`;
}

export function formatSeconds(value: number | undefined): string {
  return formatConfigValue(value, "s");
}
