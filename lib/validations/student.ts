import { z } from "zod";

export const studentSchema = z.object({
  name: z.string().min(1, "生徒名を入力してください。"),
  grade: z.string(),
  schoolName: z.string(),
  note: z.string()
});

export type StudentInput = z.infer<typeof studentSchema>;
