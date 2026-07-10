import { hasDatabaseUrl, prisma } from "@/lib/prisma";
import {
  currentTeacher,
  findStudent,
  students,
  subjects,
  type StudentDetail,
  type StudentSummary
} from "@/lib/mock-data";

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
