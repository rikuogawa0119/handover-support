"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createHandoverAction(studentId: string, formData: FormData) {
  const memoContent = String(formData.get("memoContent") ?? "").trim();
  if (!memoContent) throw new Error("引継ぎメモを入力してください。");

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) throw new Error("ログインが必要です。");

  const { error } = await supabase.from("handover_memos").insert({
    student_id: studentId,
    teacher_id: user.id,
    memo_content: memoContent
  });
  if (error) throw error;

  revalidatePath(`/students/${studentId}`);
  redirect(`/students/${studentId}`);
}
