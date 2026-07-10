"use client";

import { useEffect, useRef, useState } from "react";
import { AdminShell } from "@/components/layout/admin-shell";
import { Button, ButtonLink } from "@/components/ui/button";
import { WizardHeader } from "@/components/lessons/wizard-header";
import { StepInput } from "@/components/lessons/step-input";
import { StepConfirm } from "@/components/lessons/step-confirm";
import { StepComplete } from "@/components/lessons/step-complete";
import type { HomeworkStatusKey, UnderstandingTierKey } from "@/lib/constants";
import { lessonWizardSchema, type LessonWizardErrors } from "@/lib/validations/lesson";
import { createLessonAction, updateLessonAction } from "@/app/students/[studentId]/lessons/actions";

export type SubjectOption = { id: string; name: string };

export type WizardState = {
  lessonDate: string;
  subjectId: string;
  lessonContent: string;
  understanding: UnderstandingTierKey | null;
  homeworkContent: string;
  submissionStatus: HomeworkStatusKey;
  nextPlan: string;
  memoContent: string;
};

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

export function LessonWizard({
  studentId,
  studentName,
  subjects,
  mode = "create",
  lessonId,
  initialState
}: {
  studentId: string;
  studentName: string;
  subjects: SubjectOption[];
  mode?: "create" | "edit";
  lessonId?: string;
  initialState?: Partial<WizardState>;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [state, setState] = useState<WizardState>({
    lessonDate: initialState?.lessonDate ?? todayString(),
    subjectId: initialState?.subjectId ?? subjects[0]?.id ?? "",
    lessonContent: initialState?.lessonContent ?? "",
    understanding: initialState?.understanding ?? null,
    homeworkContent: initialState?.homeworkContent ?? "",
    submissionStatus: initialState?.submissionStatus ?? "UNSET",
    nextPlan: initialState?.nextPlan ?? "",
    memoContent: initialState?.memoContent ?? ""
  });
  const [errors, setErrors] = useState<LessonWizardErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const groupARef = useRef<HTMLDivElement>(null);
  const groupBRef = useRef<HTMLDivElement>(null);
  const groupCRef = useRef<HTMLDivElement>(null);
  const focusGroup = useRef<"A" | "B" | "C" | null>(null);

  useEffect(() => {
    if (step !== 1 || !focusGroup.current) return;
    const target =
      focusGroup.current === "A"
        ? groupARef.current
        : focusGroup.current === "B"
          ? groupBRef.current
          : groupCRef.current;
    focusGroup.current = null;
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    target.querySelector<HTMLElement>("input, select, textarea, button")?.focus();
  }, [step]);

  function update<K extends keyof WizardState>(key: K, value: WizardState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function goToConfirm() {
    const parsed = lessonWizardSchema.safeParse({
      ...state,
      understanding: state.understanding ?? ""
    });
    if (!parsed.success) {
      const nextErrors: LessonWizardErrors = {};
      parsed.error.errors.forEach((issue) => {
        const key = issue.path[0] as keyof WizardState;
        nextErrors[key] = issue.message;
      });
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setStep(2);
  }

  function editGroup(group: "A" | "B" | "C") {
    focusGroup.current = group;
    setStep(1);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      if (mode === "edit" && lessonId) {
        await updateLessonAction(studentId, lessonId, state);
      } else {
        await createLessonAction(studentId, state);
      }
      setStep(3);
    } catch {
      setSubmitError("保存に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setSubmitting(false);
    }
  }

  const subjectName = subjects.find((subject) => subject.id === state.subjectId)?.name ?? "未選択";

  return (
    <AdminShell active="students">
      <div className="grid gap-6 p-6">
        <WizardHeader
          title={mode === "edit" ? "授業記録の修正" : "授業記録の入力"}
          step={step}
          backHref={step === 1 ? `/students/${studentId}` : undefined}
          onBack={step === 2 ? () => setStep(1) : undefined}
          disableBack={step === 3}
        />

        {step === 1 ? (
          <StepInput
            state={state}
            update={update}
            errors={errors}
            subjects={subjects}
            groupARef={groupARef}
            groupBRef={groupBRef}
            groupCRef={groupCRef}
          />
        ) : null}
        {step === 2 ? (
          <StepConfirm
            state={state}
            studentName={studentName}
            subjectName={subjectName}
            onEdit={editGroup}
          />
        ) : null}
        {step === 3 ? <StepComplete studentId={studentId} mode={mode} /> : null}

        {step === 2 && submitError ? (
          <p className="text-sm text-destructive">{submitError}</p>
        ) : null}

        {step !== 3 ? (
          <div className="flex gap-3">
            {step === 1 ? (
              <>
                <ButtonLink href={`/students/${studentId}`} variant="secondary">
                  戻る
                </ButtonLink>
                <Button type="button" onClick={goToConfirm}>
                  確認へ進む
                </Button>
              </>
            ) : (
              <>
                <Button type="button" variant="secondary" onClick={() => setStep(1)} disabled={submitting}>
                  戻る
                </Button>
                <Button type="button" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? "保存中…" : mode === "edit" ? "更新する" : "登録する"}
                </Button>
              </>
            )}
          </div>
        ) : null}
      </div>
    </AdminShell>
  );
}
