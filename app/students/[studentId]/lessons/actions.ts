"use server";

import { revalidatePath } from "next/cache";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";
import { getCurrentTeacher } from "@/lib/data";
import { findUnderstandingTier } from "@/lib/constants";
import { lessonWizardSchema } from "@/lib/validations/lesson";
import type { WizardState } from "@/components/lessons/lesson-wizard";

async function persistLesson(studentId: string, lessonId: string | null, input: WizardState) {
  const parsed = lessonWizardSchema.parse({
    ...input,
    understanding: input.understanding ?? ""
  });

  if (!hasDatabaseUrl()) {
    return;
  }

  const teacher = await getCurrentTeacher();
  if (!teacher) {
    throw new Error("教師情報が見つかりませんでした。");
  }

  const tier = findUnderstandingTier(parsed.understanding);

  const lessonData = {
    subjectId: parsed.subjectId,
    lessonDate: new Date(parsed.lessonDate),
    lessonContent: parsed.lessonContent,
    understanding: tier.value,
    nextPlan: parsed.nextPlan
  };

  const lesson = lessonId
    ? await prisma.lesson.update({ where: { id: lessonId }, data: lessonData })
    : await prisma.lesson.create({
        data: { ...lessonData, studentId, teacherId: teacher.id }
      });

  if (parsed.homeworkContent) {
    await prisma.homework.upsert({
      where: { lessonId: lesson.id },
      update: {
        homeworkContent: parsed.homeworkContent,
        submissionStatus: parsed.submissionStatus
      },
      create: {
        lessonId: lesson.id,
        homeworkContent: parsed.homeworkContent,
        submissionStatus: parsed.submissionStatus
      }
    });
  } else {
    await prisma.homework.deleteMany({ where: { lessonId: lesson.id } });
  }

  if (parsed.memoContent) {
    await prisma.handover.create({
      data: { studentId, teacherId: teacher.id, memoContent: parsed.memoContent }
    });
  }

  revalidatePath(`/students/${studentId}`);
  revalidatePath(`/students/${studentId}/lessons`);
}

export async function createLessonAction(studentId: string, input: WizardState) {
  await persistLesson(studentId, null, input);
}

export async function updateLessonAction(studentId: string, lessonId: string, input: WizardState) {
  await persistLesson(studentId, lessonId, input);
}
