import type { HTMLAttributes } from "react";

function classNames(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(" ");
}

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={classNames("animate-pulse rounded-md bg-gray-200", className)} {...props} />;
}
