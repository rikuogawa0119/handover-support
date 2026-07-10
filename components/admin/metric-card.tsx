function classNames(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(" ");
}

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
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-base">{label}</p>
      <p className={classNames("mt-1 text-[22px] font-medium", valueClassName ?? "text-gray-900")}>
        {value}
      </p>
    </div>
  );
}
