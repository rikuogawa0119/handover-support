import type { HTMLAttributes } from "react";

function classNames(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(" ");
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={classNames(
        "rounded-xl border border-gray-200 bg-white text-card-foreground",
        className
      )}
      {...props}
    />
  );
}

const badgeVariants = {
  neutral: "bg-muted text-muted-foreground",
  gray: "bg-gray-100 text-gray-700",
  green: "bg-green-100 text-green-800",
  amber: "bg-amber-100 text-amber-800",
  red: "bg-red-100 text-red-800"
};

export function Badge({
  className,
  variant = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof badgeVariants }) {
  return (
    <span
      className={classNames(
        "inline-flex min-h-6 items-center rounded-full px-2.5 text-xs font-medium",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}
