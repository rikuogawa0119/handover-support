"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const OPTIONS = [
  { value: "light", label: "ライト" },
  { value: "dark", label: "ダーク" },
  { value: "system", label: "システム" }
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <ToggleGroup
      type="single"
      aria-label="外観設定"
      className="grid grid-flow-col auto-cols-fr gap-2"
      value={mounted ? (theme ?? "system") : undefined}
      onValueChange={(value) => {
        if (value) setTheme(value);
      }}
    >
      {OPTIONS.map((option) => (
        <ToggleGroupItem key={option.value} value={option.value} className="h-11 rounded-lg border text-sm font-medium">
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
