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

export async function getStudents(query?: string): Promise<StudentSummary[]> {
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

export async function getStudentDetail(id: string): Promise<StudentDetail | null> {
  return findStudent(id);
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

export async function getTeachers() {
  const names = Array.from(new Set(students.flatMap((student) => student.lessons.map((lesson) => lesson.teacher.name))));
  return names.map((name) => ({ id: name, name }));
}

export async function getSubjects() {
  return subjects;
}

export async function getCurrentTeacher() {
  return currentTeacher;
}
