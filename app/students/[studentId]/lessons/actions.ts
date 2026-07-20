"use server";

import { revalidatePath } from "next/cache";
import { lessonWizardSchema } from "@/lib/validations/lesson";
import type { WizardState } from "@/components/lessons/lesson-wizard";

async function persistLesson(studentId: string, lessonId: string | null, input: WizardState) {
  lessonWizardSchema.parse({
    ...input,
    understanding: input.understanding ?? ""
  });

  // Mock data mode: there is no database to persist to, so this is a no-op.
  revalidatePath(`/students/${studentId}`);
  revalidatePath(`/students/${studentId}/lessons`);
}

export async function createLessonAction(studentId: string, input: WizardState) {
  await persistLesson(studentId, null, input);
}

export async function updateLessonAction(studentId: string, lessonId: string, input: WizardState) {
  await persistLesson(studentId, lessonId, input);
}
