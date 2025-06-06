import { cn } from "@/lib/utils";

interface DescriptionListProps {
  children: React.ReactNode;
  className?: string;
}

export function DescriptionList({ children, className }: DescriptionListProps) {
  return (
    <dl className={cn("grid gap-4 md:grid-cols-2", className)}>{children}</dl>
  );
}

interface DescriptionListItemProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

export function DescriptionListItem({
  label,
  value,
  className,
}: DescriptionListItemProps) {
  return (
    <div className={className}>
      <dt className="text-sm font-medium text-gray-600">{label}</dt>
      <dd className="text-sm text-gray-900 mt-1">{value || "-"}</dd>
    </div>
  );
}
