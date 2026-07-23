import type { LessonListItem } from "@/lib/data";

export type MissingContentTask = {
  lessonId: string;
  studentId: string;
  studentName: string;
  subjectName: string;
  lessonDate: string;
};

export function getMissingContentTasks(lessons: LessonListItem[]): MissingContentTask[] {
  return lessons
    .filter((l) => !l.lessonContent.trim())
    .sort((a, b) => (a.lessonDate < b.lessonDate ? 1 : -1))
    .map((l) => ({
      lessonId: l.id,
      studentId: l.studentId,
      studentName: l.studentName,
      subjectName: l.subjectName,
      lessonDate: l.lessonDate
    }));
}
