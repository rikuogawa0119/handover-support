"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { lessonWizardSchema } from "@/lib/validations/lesson";
import type { WizardState } from "@/components/lessons/lesson-wizard";

async function persistLesson(studentId: string, lessonId: string | null, input: WizardState) {
  const parsed = lessonWizardSchema.parse({
    ...input,
    understanding: input.understanding ?? ""
  });

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) throw new Error("ログインが必要です。");

  const lessonValues = {
    student_id: studentId,
    teacher_id: user.id,
    subject_id: parsed.subjectId,
    lesson_date: parsed.lessonDate,
    lesson_content: parsed.lessonContent,
    understanding: parsed.understanding,
    next_plan: parsed.nextPlan
  };

  let savedLessonId = lessonId;

  if (lessonId) {
    const { error } = await supabase.from("lessons").update(lessonValues).eq("lesson_id", lessonId);
    if (error) throw error;
  } else {
    const { data, error } = await supabase
      .from("lessons")
      .insert(lessonValues)
      .select("lesson_id")
      .single();
    if (error) throw error;
    savedLessonId = data.lesson_id;
  }

  if (!savedLessonId) throw new Error("授業記録の保存に失敗しました。");

  // Homework is modeled 1-to-many but the wizard captures a single entry; replace the existing row.
  await supabase.from("homework").delete().eq("lesson_id", savedLessonId);

  const hasHomework = parsed.homeworkContent.trim().length > 0 || parsed.submissionStatus !== "UNSET";
  if (hasHomework) {
    const { error } = await supabase.from("homework").insert({
      lesson_id: savedLessonId,
      homework_content: parsed.homeworkContent,
      submission_status: parsed.submissionStatus
    });
    if (error) throw error;
  }

  // The handover memo captured alongside the lesson is optional.
  if (parsed.memoContent.trim().length > 0) {
    const { error } = await supabase.from("handover_memos").insert({
      student_id: studentId,
      teacher_id: user.id,
      memo_content: parsed.memoContent
    });
    if (error) throw error;
  }

  revalidatePath(`/students/${studentId}`);
  revalidatePath(`/students/${studentId}/lessons`);
  revalidatePath("/lessons");
  revalidatePath("/");
}

export async function createLessonAction(studentId: string, input: WizardState) {
  await persistLesson(studentId, null, input);
}

export async function updateLessonAction(studentId: string, lessonId: string, input: WizardState) {
  await persistLesson(studentId, lessonId, input);
}
