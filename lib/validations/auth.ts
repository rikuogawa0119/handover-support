import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "メールアドレスを入力してください。").email("メールアドレスの形式が正しくありません。"),
  password: z.string().min(1, "パスワードを入力してください。")
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  email: z.string().min(1, "メールアドレスを入力してください。").email("メールアドレスの形式が正しくありません。"),
  password: z.string().min(6, "パスワードは6文字以上で入力してください。")
});

export type SignupInput = z.infer<typeof signupSchema>;
