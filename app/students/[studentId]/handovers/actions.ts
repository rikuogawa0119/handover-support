"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { handoverSchema, type HandoverInput } from "@/lib/validations/handover";

export async function createHandoverAction(studentId: string, input: HandoverInput) {
  const { memoContent } = handoverSchema.parse(input);

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
