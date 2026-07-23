"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

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
            <Button variant="ghost" size="icon" aria-label="戻る" asChild>
              <Link href={backHref}>
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="icon" aria-label="戻る" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
          <h1 className="text-lg font-medium">{title}</h1>
        </div>
        <div className="text-xs text-muted-foreground">
          {step} / {totalSteps}
        </div>
      </div>
      <Progress value={progress} className="h-[3px]" />
    </div>
  );
}
