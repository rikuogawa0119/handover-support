"use client";

import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { findUnderstandingTier, homeworkStatusLabels } from "@/lib/constants";
import type { WizardState } from "@/components/lessons/lesson-wizard";

export function StepConfirm({
  state,
  studentName,
  subjectName,
  onEdit
}: {
  state: WizardState;
  studentName: string;
  subjectName: string;
  onEdit: (group: "A" | "B" | "C") => void;
}) {
  const tier = state.understanding ? findUnderstandingTier(state.understanding) : null;

  return (
    <div className="grid gap-4">
      <ConfirmGroup title="授業内容" onEdit={() => onEdit("A")}>
        <ConfirmRow label="生徒" value={studentName} />
        <ConfirmRow label="授業日" value={state.lessonDate} />
        <ConfirmRow label="科目" value={subjectName} />
        <ConfirmRow label="授業内容" value={state.lessonContent} />
        <ConfirmRow label="理解度" value={tier?.label ?? "未選択"} />
      </ConfirmGroup>

      <ConfirmGroup title="宿題" onEdit={() => onEdit("B")}>
        <ConfirmRow label="宿題内容" value={state.homeworkContent || "未設定"} />
        <ConfirmRow label="提出状況" value={homeworkStatusLabels[state.submissionStatus]} />
      </ConfirmGroup>

      <ConfirmGroup title="次回内容" onEdit={() => onEdit("C")}>
        <ConfirmRow label="次回実施予定" value={state.nextPlan} />
        <ConfirmRow label="引継ぎメモ" value={state.memoContent || "未設定"} />
      </ConfirmGroup>
    </div>
  );
}

function ConfirmGroup({
  title,
  onEdit,
  children
}: {
  title: string;
  onEdit: () => void;
  children: ReactNode;
}) {
  return (
    <Card className="grid gap-3 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-500">{title}</p>
        <button
          type="button"
          onClick={onEdit}
          className="text-xs font-medium text-gray-500 underline underline-offset-2 hover:text-gray-700"
        >
          編集
        </button>
      </div>
      <div className="grid gap-3">{children}</div>
    </Card>
  );
}

function ConfirmRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="whitespace-pre-wrap text-sm leading-6">{value}</p>
    </div>
  );
}
