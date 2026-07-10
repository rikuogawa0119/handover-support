import type { HTMLAttributes } from "react";

function classNames(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(" ");
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={classNames(
        "rounded-lg border border-border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={classNames(
        "inline-flex min-h-7 items-center rounded-md border border-border bg-muted px-2 text-xs font-semibold text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}
