import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  valueClassName
}: {
  label: string;
  value: number;
  valueClassName?: string;
}) {
  return (
    <Card className="rounded-xl shadow-sm">
      <CardContent className="p-4">
        <p className="text-base">{label}</p>
        <p className={cn("mt-1 text-[22px] font-medium", valueClassName ?? "text-foreground")}>
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
