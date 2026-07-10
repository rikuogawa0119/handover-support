import { z } from "zod";

export const lessonFormSchema = z.object({
  lessonDate: z.string().min(1, "授業日を入力してください。"),
  subjectId: z.string().min(1, "科目を選択してください。"),
  lessonContent: z
    .string()
    .min(5, "授業内容は5文字以上で入力してください。")
    .max(1000, "授業内容は1000文字以内で入力してください。"),
  understanding: z.coerce
    .number()
    .int()
    .min(1, "理解度を選択してください。")
    .max(5, "理解度は1から5で選択してください。"),
  homeworkContent: z
    .string()
    .max(1000, "宿題内容は1000文字以内で入力してください。")
    .optional()
    .default(""),
  submissionStatus: z.enum(["UNSET", "ASSIGNED", "SUBMITTED", "NOT_SUBMITTED"]),
  nextPlan: z
    .string()
    .max(1000, "次回方針は1000文字以内で入力してください。")
    .optional()
    .default(""),
  memoContent: z
    .string()
    .max(1000, "引継ぎメモは1000文字以内で入力してください。")
    .optional()
    .default("")
});

export type LessonFormInput = z.infer<typeof lessonFormSchema>;
