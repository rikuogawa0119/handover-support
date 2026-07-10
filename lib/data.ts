import { hasDatabaseUrl, prisma } from "@/lib/prisma";
import type { HomeworkStatusKey } from "@/lib/constants";
import {
  currentTeacher,
  findStudent,
  students,
  subjects,
  type StudentDetail,
  type StudentSummary
} from "@/lib/mock-data";

export type LessonListItem = {
  id: string;
  lessonDate: string;
  studentId: string;
  studentName: string;
  subjectName: string;
  lessonContent: string;
  understanding: number;
  teacherName: string;
  homework: {
    homeworkContent: string;
    submissionStatus: HomeworkStatusKey;
  } | null;
};

export type LessonListFilters = {
  query?: string;
  subjectName?: string;
  teacherName?: string;
};

function toIsoDate(value: Date | string | null) {
  if (!value) return null;
  return new Date(value).toISOString().slice(0, 10);
}

export async function getStudents(query?: string): Promise<StudentSummary[]> {
  if (!hasDatabaseUrl()) {
    const normalizedQuery = query?.trim().toLowerCase();
    return students
      .filter((student) => {
        if (!normalizedQuery) return true;
        return [student.name, student.grade, student.schoolName ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .map((student) => ({
        id: student.id,
        name: student.name,
        grade: student.grade,
        schoolName: student.schoolName,
        note: student.note,
        lastLessonDate: student.lastLessonDate
      }));
  }

  const records = await prisma.student.findMany({
    where: query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { grade: { contains: query, mode: "insensitive" } },
            { schoolName: { contains: query, mode: "insensitive" } }
          ]
        }
      : undefined,
    include: {
      lessons: {
        orderBy: { lessonDate: "desc" },
        take: 1,
        select: { lessonDate: true }
      }
    },
    orderBy: { name: "asc" }
  });

  return records.map((student) => ({
    id: student.id,
    name: student.name,
    grade: student.grade,
    schoolName: student.schoolName,
    note: student.note,
    lastLessonDate: toIsoDate(student.lessons[0]?.lessonDate ?? null)
  }));
}

export async function getStudentDetail(id: string): Promise<StudentDetail | null> {
  if (!hasDatabaseUrl()) {
    return findStudent(id);
  }

  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      lessons: {
        orderBy: { lessonDate: "desc" },
        include: {
          teacher: { select: { name: true } },
          subject: { select: { name: true } },
          homework: true
        }
      },
      handovers: {
        orderBy: { createdAt: "desc" },
        include: {
          teacher: { select: { name: true } }
        }
      }
    }
  });

  if (!student) return null;

  return {
    id: student.id,
    name: student.name,
    grade: student.grade,
    schoolName: student.schoolName,
    note: student.note,
    lastLessonDate: toIsoDate(student.lessons[0]?.lessonDate ?? null),
    lessons: student.lessons.map((lesson) => ({
      id: lesson.id,
      lessonDate: toIsoDate(lesson.lessonDate) ?? "",
      lessonContent: lesson.lessonContent,
      understanding: lesson.understanding,
      nextPlan: lesson.nextPlan,
      teacher: lesson.teacher,
      subject: lesson.subject,
      homework: lesson.homework
        ? {
            homeworkContent: lesson.homework.homeworkContent,
            submissionStatus: lesson.homework.submissionStatus
          }
        : null
    })),
    handovers: student.handovers.map((handover) => ({
      id: handover.id,
      memoContent: handover.memoContent,
      createdAt: toIsoDate(handover.createdAt) ?? "",
      teacher: handover.teacher
    }))
  };
}

export type LessonDetail = {
  id: string;
  studentId: string;
  lessonDate: string;
  subjectId: string;
  lessonContent: string;
  understanding: number;
  nextPlan: string | null;
  homework: {
    homeworkContent: string;
    submissionStatus: HomeworkStatusKey;
  } | null;
};

export async function getLessonDetail(
  studentId: string,
  lessonId: string
): Promise<LessonDetail | null> {
  if (!hasDatabaseUrl()) {
    const student = findStudent(studentId);
    const lesson = student?.lessons.find((item) => item.id === lessonId);
    if (!student || !lesson) return null;
    const subject = subjects.find((item) => item.name === lesson.subject.name);
    return {
      id: lesson.id,
      studentId: student.id,
      lessonDate: lesson.lessonDate,
      subjectId: subject?.id ?? "",
      lessonContent: lesson.lessonContent,
      understanding: lesson.understanding,
      nextPlan: lesson.nextPlan,
      homework: lesson.homework
    };
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { homework: true }
  });

  if (!lesson || lesson.studentId !== studentId) return null;

  return {
    id: lesson.id,
    studentId: lesson.studentId,
    lessonDate: toIsoDate(lesson.lessonDate) ?? "",
    subjectId: lesson.subjectId,
    lessonContent: lesson.lessonContent,
    understanding: lesson.understanding,
    nextPlan: lesson.nextPlan,
    homework: lesson.homework
      ? {
          homeworkContent: lesson.homework.homeworkContent,
          submissionStatus: lesson.homework.submissionStatus
        }
      : null
  };
}

function matchesLessonFilters(
  lesson: Pick<LessonListItem, "studentName" | "subjectName" | "teacherName">,
  filters?: LessonListFilters
) {
  const query = filters?.query?.trim().toLowerCase();
  if (query) {
    const haystack = `${lesson.studentName} ${lesson.subjectName}`.toLowerCase();
    if (!haystack.includes(query)) return false;
  }
  if (filters?.subjectName && lesson.subjectName !== filters.subjectName) return false;
  if (filters?.teacherName && lesson.teacherName !== filters.teacherName) return false;
  return true;
}

export async function getLessons(filters?: LessonListFilters): Promise<LessonListItem[]> {
  if (!hasDatabaseUrl()) {
    const items = students.flatMap((student) =>
      student.lessons.map((lesson) => ({
        id: lesson.id,
        lessonDate: lesson.lessonDate,
        studentId: student.id,
        studentName: student.name,
        subjectName: lesson.subject.name,
        lessonContent: lesson.lessonContent,
        understanding: lesson.understanding,
        teacherName: lesson.teacher.name,
        homework: lesson.homework
      }))
    );
    return items
      .filter((item) => matchesLessonFilters(item, filters))
      .sort((a, b) => (a.lessonDate < b.lessonDate ? 1 : -1));
  }

  const records = await prisma.lesson.findMany({
    orderBy: { lessonDate: "desc" },
    include: {
      student: { select: { name: true } },
      teacher: { select: { name: true } },
      subject: { select: { name: true } },
      homework: true
    }
  });

  const items = records.map((lesson) => ({
    id: lesson.id,
    lessonDate: toIsoDate(lesson.lessonDate) ?? "",
    studentId: lesson.studentId,
    studentName: lesson.student.name,
    subjectName: lesson.subject.name,
    lessonContent: lesson.lessonContent,
    understanding: lesson.understanding,
    teacherName: lesson.teacher.name,
    homework: lesson.homework
      ? {
          homeworkContent: lesson.homework.homeworkContent,
          submissionStatus: lesson.homework.submissionStatus
        }
      : null
  }));

  return items.filter((item) => matchesLessonFilters(item, filters));
}

export async function getTeachers() {
  if (!hasDatabaseUrl()) {
    const names = Array.from(new Set(students.flatMap((student) => student.lessons.map((lesson) => lesson.teacher.name))));
    return names.map((name) => ({ id: name, name }));
  }

  return prisma.teacher.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true }
  });
}

export async function getSubjects() {
  if (!hasDatabaseUrl()) {
    return subjects;
  }

  return prisma.subject.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true }
  });
}

export async function getCurrentTeacher() {
  if (!hasDatabaseUrl()) {
    return currentTeacher;
  }

  return prisma.teacher.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, role: true, email: true }
  });
}
