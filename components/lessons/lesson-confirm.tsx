"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { homeworkStatusLabels, understandingLabels } from "@/lib/constants";
import type { LessonFormInput } from "@/lib/validations/lesson";

type Draft = LessonFormInput & {
  studentId: string;
  studentName: string;
  subjectName: string;
};

export function LessonConfirm({ studentId }: { studentId: string }) {
  const router = useRouter();
  const storageKey = useMemo(() => `lesson-draft:${studentId}`, [studentId]);
  const [draft, setDraft] = useState<Draft | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(storageKey);
    if (!raw) return;
    setDraft(JSON.parse(raw) as Draft);
  }, [storageKey]);

  if (!draft) {
    return (
      <Card className="grid gap-4 p-5">
        <p className="text-sm leading-6 text-muted-foreground">
          入力内容が見つかりません。授業記録入力画面からやり直してください。
        </p>
        <ButtonLink href={`/students/${studentId}/lessons/new`} variant="secondary">
          入力へ戻る
        </ButtonLink>
      </Card>
    );
  }

  function complete() {
    sessionStorage.setItem(`lesson-complete:${studentId}`, JSON.stringify(draft));
    sessionStorage.removeItem(storageKey);
    router.push(`/students/${studentId}/lessons/new/complete`);
  }

  return (
    <div className="grid gap-4">
      <Card className="grid gap-4 p-4">
        <ConfirmRow label="生徒" value={draft.studentName} />
        <ConfirmRow label="授業日" value={draft.lessonDate} />
        <ConfirmRow label="科目" value={draft.subjectName} />
        <ConfirmRow label="理解度" value={`${draft.understanding}：${understandingLabels[draft.understanding]}`} />
        <ConfirmRow label="授業内容" value={draft.lessonContent} />
        <ConfirmRow label="宿題" value={draft.homeworkContent || "未設定"} />
        <ConfirmRow label="提出状況" value={homeworkStatusLabels[draft.submissionStatus]} />
        <ConfirmRow label="次回方針" value={draft.nextPlan || "未設定"} />
        <ConfirmRow label="引継ぎメモ" value={draft.memoContent || "未設定"} />
      </Card>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ButtonLink href={`/students/${studentId}/lessons/new`} variant="secondary" className="w-full">
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          修正する
        </ButtonLink>
        <Button type="button" onClick={complete} className="w-full">
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          記録を完了
        </Button>
      </div>
    </div>
  );
}

function ConfirmRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-border pb-3 last:border-b-0 last:pb-0">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="whitespace-pre-wrap text-sm leading-6">{value}</p>
    </div>
  );
}
