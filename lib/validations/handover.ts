import { z } from "zod";

export const handoverSchema = z.object({
  memoContent: z
    .string()
    .min(1, "引継ぎメモを入力してください。")
    .max(1000, "引継ぎメモは1000文字以内で入力してください。")
});

export type HandoverInput = z.infer<typeof handoverSchema>;
