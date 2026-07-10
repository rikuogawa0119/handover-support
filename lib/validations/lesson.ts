import { z } from "zod";

export const lessonWizardSchema = z.object({
  lessonDate: z.string().min(1, "授業日を入力してください。"),
  subjectId: z.string().min(1, "科目を選択してください。"),
  lessonContent: z
    .string()
    .min(1, "授業内容を入力してください。")
    .max(1000, "授業内容は1000文字以内で入力してください。"),
  understanding: z.enum(["GOOD", "PARTIAL", "NEEDS_REVIEW"], {
    errorMap: () => ({ message: "理解度を選択してください。" })
  }),
  homeworkContent: z
    .string()
    .max(1000, "宿題内容は1000文字以内で入力してください。")
    .optional()
    .default(""),
  submissionStatus: z
    .enum(["UNSET", "ASSIGNED", "SUBMITTED", "NOT_SUBMITTED"])
    .optional()
    .default("UNSET"),
  nextPlan: z
    .string()
    .min(1, "次回実施予定を入力してください。")
    .max(1000, "次回実施予定は1000文字以内で入力してください。"),
  memoContent: z
    .string()
    .max(1000, "引継ぎメモは1000文字以内で入力してください。")
    .optional()
    .default("")
});

export type LessonWizardInput = z.infer<typeof lessonWizardSchema>;
export type LessonWizardErrors = Partial<Record<keyof LessonWizardInput, string>>;
