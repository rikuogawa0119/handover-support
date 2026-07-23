import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function TaskSection({
  icon,
  title,
  count,
  emptyMessage,
  children
}: {
  icon: ReactNode;
  title: string;
  count: number;
  emptyMessage: string;
  children: ReactNode;
}) {
  return (
    <Card className="rounded-xl shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          {icon}
          <p className="text-base font-bold">{title}</p>
          <Badge variant={count === 0 ? "gray" : "amber"}>{count}</Badge>
        </div>
        <div className="mt-3">
          {count === 0 ? (
            <p className="py-2 text-sm text-muted-foreground">{emptyMessage}</p>
          ) : (
            children
          )}
        </div>
      </CardContent>
    </Card>
  );
}
