"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { homeworkStatusLabels, understandingLabels } from "@/lib/constants";
import { lessonFormSchema, type LessonFormInput } from "@/lib/validations/lesson";

type SubjectOption = {
  id: string;
  name: string;
};

type LessonFormProps = {
  studentId: string;
  studentName: string;
  subjects: SubjectOption[];
};

type FormErrors = Partial<Record<keyof LessonFormInput, string>>;

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

export function LessonForm({ studentId, studentName, subjects }: LessonFormProps) {
  const router = useRouter();
  const [errors, setErrors] = useState<FormErrors>({});
  const storageKey = useMemo(() => `lesson-draft:${studentId}`, [studentId]);

  function handleSubmit(formData: FormData) {
    const raw = {
      lessonDate: String(formData.get("lessonDate") ?? ""),
      subjectId: String(formData.get("subjectId") ?? ""),
      lessonContent: String(formData.get("lessonContent") ?? ""),
      understanding: Number(formData.get("understanding") ?? 0),
      homeworkContent: String(formData.get("homeworkContent") ?? ""),
      submissionStatus: String(formData.get("submissionStatus") ?? "UNSET"),
      nextPlan: String(formData.get("nextPlan") ?? ""),
      memoContent: String(formData.get("memoContent") ?? "")
    };

    const parsed = lessonFormSchema.safeParse(raw);
    if (!parsed.success) {
      const nextErrors: FormErrors = {};
      parsed.error.errors.forEach((issue) => {
        const key = issue.path[0] as keyof LessonFormInput;
        nextErrors[key] = issue.message;
      });
      setErrors(nextErrors);
      return;
    }

    const subject = subjects.find((item) => item.id === parsed.data.subjectId);
    sessionStorage.setItem(
      storageKey,
      JSON.stringify({
        ...parsed.data,
        studentId,
        studentName,
        subjectName: subject?.name ?? "未選択"
      })
    );
    router.push(`/students/${studentId}/lessons/new/confirm`);
  }

  return (
    <form action={handleSubmit} className="grid gap-4">
      <Card className="grid gap-4 p-4">
        <Field label="授業日" error={errors.lessonDate}>
          <Input name="lessonDate" type="date" defaultValue={todayString()} />
        </Field>

        <Field label="科目" error={errors.subjectId}>
          <Select name="subjectId" defaultValue={subjects[0]?.id ?? ""}>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="授業内容"
          hint="今日扱った単元、解説したポイント、演習した問題を書きます。"
          error={errors.lessonContent}
        >
          <Textarea name="lessonContent" placeholder="例：二次関数の最大・最小を解説" />
        </Field>

        <Field label="理解度" error={errors.understanding}>
          <Select name="understanding" defaultValue="3">
            {Object.entries(understandingLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {value}：{label}
              </option>
            ))}
          </Select>
        </Field>
      </Card>

      <Card className="grid gap-4 p-4">
        <Field label="宿題" hint="出していない場合は空欄で構いません。" error={errors.homeworkContent}>
          <Textarea name="homeworkContent" placeholder="例：ワーク p.42-43 大問3から5" />
        </Field>

        <Field label="宿題の提出状況" error={errors.submissionStatus}>
          <Select name="submissionStatus" defaultValue="UNSET">
            {Object.entries(homeworkStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
      </Card>

      <Card className="grid gap-4 p-4">
        <Field
          label="次回方針"
          hint="次の講師が最初に見る内容です。"
          error={errors.nextPlan}
        >
          <Textarea name="nextPlan" placeholder="例：定義域がある最大・最小の問題から再開" />
        </Field>

        <Field
          label="引継ぎメモ"
          hint="集中しやすい進め方、注意点、保護者連絡事項などを書きます。"
          error={errors.memoContent}
        >
          <Textarea name="memoContent" placeholder="例：計算過程を1行ずつ確認するとミスが減る" />
        </Field>
      </Card>

      <Button type="submit" className="sticky bottom-20 w-full shadow-lg">
        <Save className="h-5 w-5" aria-hidden="true" />
        確認へ進む
        <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </Button>
    </form>
  );
}
