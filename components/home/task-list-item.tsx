import Link from "next/link";
import { Button } from "@/components/ui/button";

export function TaskListItem({
  title,
  description,
  href,
  actionLabel
}: {
  title: string;
  description: string;
  href: string;
  actionLabel: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b py-2 last:border-b-0">
      <div className="min-w-0">
        <p className="font-medium">{title}</p>
        <p className="truncate text-sm text-muted-foreground">{description}</p>
      </div>
      <Button asChild size="sm" variant="outline" className="shrink-0">
        <Link href={href}>{actionLabel}</Link>
      </Button>
    </div>
  );
}
