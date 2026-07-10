"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function WizardHeader({
  step,
  totalSteps = 3,
  onBack,
  backHref,
  disableBack,
  title = "授業記録の入力"
}: {
  step: number;
  totalSteps?: number;
  onBack?: () => void;
  backHref?: string;
  disableBack?: boolean;
  title?: string;
}) {
  const progress = (step / totalSteps) * 100;

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {disableBack ? null : backHref ? (
            <Link
              href={backHref}
              aria-label="戻る"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={onBack}
              aria-label="戻る"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
          <h1 className="text-lg font-medium">{title}</h1>
        </div>
        <div className="text-xs text-muted-foreground">
          {step} / {totalSteps}
        </div>
      </div>
      <div className="h-[3px] w-full rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-primary transition-[width]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
