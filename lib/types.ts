import type { HomeworkStatusKey } from "@/lib/constants";

export type StudentSummary = {
  id: string;
  name: string;
  grade: string;
  schoolName: string | null;
  note: string | null;
  lastLessonDate: string | null;
};

export type StudentDetail = StudentSummary & {
  lessons: Array<{
    id: string;
    lessonDate: string;
    lessonContent: string;
    understanding: number;
    nextPlan: string | null;
    teacher: { name: string };
    subject: { name: string };
    homework: {
      homeworkContent: string;
      submissionStatus: HomeworkStatusKey;
    } | null;
  }>;
  handovers: Array<{
    id: string;
    memoContent: string;
    createdAt: string;
    teacher: { name: string };
  }>;
};
