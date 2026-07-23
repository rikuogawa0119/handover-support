import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { findUnderstandingTier, type HomeworkStatusKey, type UnderstandingTierKey } from "@/lib/constants";
import type { StudentDetail, StudentSummary } from "@/lib/types";

export type { StudentDetail, StudentSummary } from "@/lib/types";

/** DB stores understanding as a 3-tier enum; the UI works with the legacy 1-5 number scale. */
function understandingToNumber(key: UnderstandingTierKey | null): number {
  if (!key) return 0;
  return findUnderstandingTier(key).value;
}

/** Supabase returns nested relations as either an object or a single-element array depending on the query. */
function firstOf<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

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

function mapHomework(
  homework: Array<{ homework_content: string; submission_status: HomeworkStatusKey }> | null | undefined
): LessonListItem["homework"] {
  const first = homework && homework.length > 0 ? homework[0] : null;
  if (!first) return null;
  return {
    homeworkContent: first.homework_content,
    submissionStatus: first.submission_status
  };
}

export async function getStudents(query?: string): Promise<StudentSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("students")
    .select("student_id, student_name, grade, school_name, note, lessons(lesson_date)")
    .order("student_name", { ascending: true });

  if (error) throw error;

  const normalizedQuery = query?.trim().toLowerCase();

  return (data ?? [])
    .map((student) => {
      const lessonDates = (student.lessons ?? []).map((lesson) => lesson.lesson_date);
      const lastLessonDate = lessonDates.length > 0 ? lessonDates.sort().at(-1)! : null;
      return {
        id: student.student_id,
        name: student.student_name,
        grade: student.grade ?? "",
        schoolName: student.school_name,
        note: student.note,
        lastLessonDate
      };
    })
    .filter((student) => {
      if (!normalizedQuery) return true;
      return [student.name, student.grade, student.schoolName ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
}

export async function getStudentDetail(id: string): Promise<StudentDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("students")
    .select(
      `student_id, student_name, grade, school_name, note,
       lessons (
         lesson_id, lesson_date, lesson_content, understanding, next_plan,
         subject:subjects ( subject_name ),
         teacher:teachers ( teacher_name ),
         homework ( homework_content, submission_status )
       ),
       handover_memos (
         handover_id, memo_content, created_at,
         teacher:teachers ( teacher_name )
       )`
    )
    .eq("student_id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const lessonDates = (data.lessons ?? []).map((lesson) => lesson.lesson_date);
  const lastLessonDate = lessonDates.length > 0 ? [...lessonDates].sort().at(-1)! : null;

  const lessons = (data.lessons ?? [])
    .map((lesson) => {
      const subject = firstOf(lesson.subject);
      const teacher = firstOf(lesson.teacher);
      const homework = mapHomework(lesson.homework);
      return {
        id: lesson.lesson_id,
        lessonDate: lesson.lesson_date,
        lessonContent: lesson.lesson_content,
        understanding: understandingToNumber(lesson.understanding),
        nextPlan: lesson.next_plan,
        teacher: { name: teacher?.teacher_name ?? "不明" },
        subject: { name: subject?.subject_name ?? "" },
        homework
      };
    })
    .sort((a, b) => (a.lessonDate < b.lessonDate ? 1 : -1));

  const handovers = (data.handover_memos ?? [])
    .map((memo) => {
      const teacher = firstOf(memo.teacher);
      return {
        id: memo.handover_id,
        memoContent: memo.memo_content,
        createdAt: memo.created_at,
        teacher: { name: teacher?.teacher_name ?? "不明" }
      };
    })
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return {
    id: data.student_id,
    name: data.student_name,
    grade: data.grade ?? "",
    schoolName: data.school_name,
    note: data.note,
    lastLessonDate,
    lessons,
    handovers
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
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lessons")
    .select(
      `lesson_id, student_id, lesson_date, subject_id, lesson_content, understanding, next_plan,
       homework ( homework_content, submission_status )`
    )
    .eq("lesson_id", lessonId)
    .eq("student_id", studentId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.lesson_id,
    studentId: data.student_id,
    lessonDate: data.lesson_date,
    subjectId: data.subject_id,
    lessonContent: data.lesson_content,
    understanding: understandingToNumber(data.understanding),
    nextPlan: data.next_plan,
    homework: mapHomework(data.homework)
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
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lessons")
    .select(
      `lesson_id, lesson_date, lesson_content, understanding,
       student:students ( student_id, student_name ),
       subject:subjects ( subject_name ),
       teacher:teachers ( teacher_name ),
       homework ( homework_content, submission_status )`
    )
    .order("lesson_date", { ascending: false });

  if (error) throw error;

  const items = (data ?? []).map((lesson) => {
    const student = firstOf(lesson.student);
    const subject = firstOf(lesson.subject);
    const teacher = firstOf(lesson.teacher);
    return {
      id: lesson.lesson_id,
      lessonDate: lesson.lesson_date,
      studentId: student?.student_id ?? "",
      studentName: student?.student_name ?? "",
      subjectName: subject?.subject_name ?? "",
      lessonContent: lesson.lesson_content,
      understanding: understandingToNumber(lesson.understanding),
      teacherName: teacher?.teacher_name ?? "",
      homework: mapHomework(lesson.homework)
    };
  });

  return filterLessons(items, filters);
}

/** Applies list filters to an already-fetched lesson set, so callers that need both the full and a filtered view (e.g. dashboard metrics + a filtered table) can fetch once and filter twice instead of querying twice. */
export function filterLessons(
  lessons: LessonListItem[],
  filters?: LessonListFilters
): LessonListItem[] {
  return lessons.filter((item) => matchesLessonFilters(item, filters));
}

/** Deduped per-request: reference data that multiple components on the same page (or nested layouts) may each ask for. */
export const getTeachers = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("teachers")
    .select("teacher_id, teacher_name")
    .order("teacher_name", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((teacher) => ({ id: teacher.teacher_id, name: teacher.teacher_name }));
});

export const getSubjects = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subjects")
    .select("subject_id, subject_name")
    .order("subject_name", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((subject) => ({ id: subject.subject_id, name: subject.subject_name }));
});

export type RecentHandoverMemo = {
  id: string;
  studentId: string;
  studentName: string;
  memoContent: string;
  createdAt: string;
  teacherName: string;
};

export async function getRecentHandoverMemos(sinceDays = 3): Promise<RecentHandoverMemo[]> {
  const supabase = await createClient();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - sinceDays);

  const { data, error } = await supabase
    .from("handover_memos")
    .select(
      `handover_id, memo_content, created_at,
       student:students ( student_id, student_name ),
       teacher:teachers ( teacher_name )`
    )
    .gte("created_at", cutoff.toISOString())
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((memo) => {
    const student = firstOf(memo.student);
    const teacher = firstOf(memo.teacher);
    return {
      id: memo.handover_id,
      studentId: student?.student_id ?? "",
      studentName: student?.student_name ?? "",
      memoContent: memo.memo_content,
      createdAt: memo.created_at,
      teacherName: teacher?.teacher_name ?? "不明"
    };
  });
}

export type CurrentTeacher = {
  id: string;
  name: string;
  role: "ADMIN";
  email: string;
};

export async function getCurrentTeacher(): Promise<CurrentTeacher | null> {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: teacher } = await supabase
    .from("teachers")
    .select("teacher_id, teacher_name, email")
    .eq("teacher_id", user.id)
    .maybeSingle();

  // Every authenticated teacher currently has full (admin) access; the schema has no role column yet.
  return {
    id: user.id,
    name: teacher?.teacher_name ?? user.email ?? "先生",
    role: "ADMIN",
    email: teacher?.email ?? user.email ?? ""
  };
}
