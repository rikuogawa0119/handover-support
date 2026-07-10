"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Home, UserRound } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { LessonFormInput } from "@/lib/validations/lesson";

type Draft = LessonFormInput & {
  studentId: string;
  studentName: string;
  subjectName: string;
};

export function LessonComplete({ studentId }: { studentId: string }) {
  const storageKey = useMemo(() => `lesson-complete:${studentId}`, [studentId]);
  const [draft, setDraft] = useState<Draft | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(storageKey);
    if (!raw) return;
    setDraft(JSON.parse(raw) as Draft);
  }, [storageKey]);

  return (
    <Card className="grid gap-5 p-5 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
        <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
      </div>
      <div className="grid gap-2">
        <h1 className="text-2xl font-bold">記録が完了しました</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          {draft?.studentName ?? "生徒"}の授業記録を確認しました。
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ButtonLink href="/" variant="secondary" className="w-full">
          <Home className="h-5 w-5" aria-hidden="true" />
          トップへ戻る
        </ButtonLink>
        <ButtonLink href={`/students/${studentId}`} className="w-full">
          <UserRound className="h-5 w-5" aria-hidden="true" />
          生徒詳細へ戻る
        </ButtonLink>
      </div>
    </Card>
  );
}
