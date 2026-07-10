"use client";

function classNames(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(" ");
}

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
  activeClassName?: string;
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel
}: {
  options: Array<SegmentedOption<T>>;
  value: T | null;
  onChange: (value: T) => void;
  ariaLabel: string;
}) {
  return (
    <div className="grid grid-flow-col auto-cols-fr gap-2" role="group" aria-label={ariaLabel}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={classNames(
              "h-11 rounded-lg border text-sm font-medium transition",
              active
                ? (option.activeClassName ?? "border-primary bg-primary text-primary-foreground")
                : "border-gray-200 bg-white text-gray-700 hover:bg-muted"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
