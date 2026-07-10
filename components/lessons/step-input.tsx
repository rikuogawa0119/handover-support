"use client";

import type { RefObject } from "react";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { HOMEWORK_STATUS_OPTIONS, UNDERSTANDING_TIERS } from "@/lib/constants";
import type { LessonWizardErrors } from "@/lib/validations/lesson";
import type { SubjectOption, WizardState } from "@/components/lessons/lesson-wizard";

export function StepInput({
  state,
  update,
  errors,
  subjects,
  groupARef,
  groupBRef,
  groupCRef
}: {
  state: WizardState;
  update: <K extends keyof WizardState>(key: K, value: WizardState[K]) => void;
  errors: LessonWizardErrors;
  subjects: SubjectOption[];
  groupARef: RefObject<HTMLDivElement | null>;
  groupBRef: RefObject<HTMLDivElement | null>;
  groupCRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="grid gap-4">
      <div ref={groupARef}>
        <Card className="grid gap-4 p-5">
          <p className="text-xs font-medium text-gray-500">授業内容</p>
          <Field label="授業日" required error={errors.lessonDate}>
            <Input
              type="date"
              value={state.lessonDate}
              onChange={(event) => update("lessonDate", event.target.value)}
            />
          </Field>
          <Field label="科目" required error={errors.subjectId}>
            <Select value={state.subjectId} onChange={(event) => update("subjectId", event.target.value)}>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="授業内容" required error={errors.lessonContent}>
            <Textarea
              rows={3}
              placeholder="例：二次関数の最大・最小を解説"
              value={state.lessonContent}
              onChange={(event) => update("lessonContent", event.target.value)}
            />
          </Field>
          <Field label="理解度" required error={errors.understanding}>
            <SegmentedControl
              ariaLabel="理解度"
              value={state.understanding}
              onChange={(value) => update("understanding", value)}
              options={UNDERSTANDING_TIERS.map((tier) => ({
                value: tier.key,
                label: tier.label,
                activeClassName: tier.activeClassName
              }))}
            />
          </Field>
        </Card>
      </div>

      <div ref={groupBRef}>
        <Card className="grid gap-4 p-5">
          <p className="text-xs font-medium text-gray-500">宿題</p>
          <Field label="宿題内容" error={errors.homeworkContent}>
            <Input
              placeholder="例：問題集 p.32〜34"
              value={state.homeworkContent}
              onChange={(event) => update("homeworkContent", event.target.value)}
            />
          </Field>
          <Field label="提出状況" error={errors.submissionStatus}>
            <SegmentedControl
              ariaLabel="提出状況"
              value={state.submissionStatus === "UNSET" ? null : state.submissionStatus}
              onChange={(value) => update("submissionStatus", value)}
              options={HOMEWORK_STATUS_OPTIONS.map((option) => ({
                value: option.key,
                label: option.label,
                activeClassName: option.activeClassName
              }))}
            />
          </Field>
        </Card>
      </div>

      <div ref={groupCRef}>
        <Card className="grid gap-4 p-5">
          <p className="text-xs font-medium text-gray-500">次回内容</p>
          <Field label="次回実施予定" required error={errors.nextPlan}>
            <Textarea
              placeholder="例：定義域がある最大・最小の問題から再開"
              value={state.nextPlan}
              onChange={(event) => update("nextPlan", event.target.value)}
            />
          </Field>
          <Field label="引継ぎメモ" hint="代講の講師に伝えたいことがあれば" error={errors.memoContent}>
            <Textarea
              value={state.memoContent}
              onChange={(event) => update("memoContent", event.target.value)}
            />
          </Field>
        </Card>
      </div>
    </div>
  );
}
