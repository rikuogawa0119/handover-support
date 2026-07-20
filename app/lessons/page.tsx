import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/layout/admin-shell";
import { MetricCard } from "@/components/admin/metric-card";
import { LessonFilterBar } from "@/components/admin/lesson-filter-bar";
import { LessonTable } from "@/components/admin/lesson-table";
import { LessonPagination } from "@/components/admin/lesson-pagination";
import { filterLessons, getCurrentTeacher, getLessons, getSubjects, getTeachers } from "@/lib/data";
import { getInitials } from "@/lib/utils";

const PAGE_SIZE = 10;

export default async function LessonsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; subject?: string; teacher?: string; page?: string }>;
}) {
  const { q, subject, teacher, page } = await searchParams;

  const [teacherRecord, subjects, teachers, allLessons] = await Promise.all([
    getCurrentTeacher(),
    getSubjects(),
    getTeachers(),
    getLessons()
  ]);
  const filteredLessons = filterLessons(allLessons, { query: q, subjectName: subject, teacherName: teacher });

  const isAdmin = teacherRecord?.role === "ADMIN";
  if (!isAdmin) {
    redirect("/");
  }

  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().slice(0, 10);

  const thisWeekCount = allLessons.filter((lesson) => lesson.lessonDate >= weekAgoStr).length;
  const missingContentCount = allLessons.filter((lesson) => !lesson.lessonContent.trim()).length;
  const notSubmittedCount = allLessons.filter(
    (lesson) => lesson.homework?.submissionStatus === "NOT_SUBMITTED"
  ).length;

  const totalCount = filteredLessons.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const pageItems = filteredLessons.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const monthLabel = `${now.getFullYear()}年${now.getMonth() + 1}月`;

  return (
    <AdminShell active="lessons">
      <div className="grid gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-medium">授業記録</h1>
            <p className="text-xs text-muted-foreground">
              {monthLabel} ・ 全{allLessons.length}件
            </p>
          </div>
          <div className="grid h-9 w-9 place-items-center rounded-full bg-gray-100 text-xs font-medium text-gray-700">
            {getInitials(teacherRecord?.name ?? "先生")}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <MetricCard label="今週の記録数" value={thisWeekCount} />
          <MetricCard label="未入力" value={missingContentCount} valueClassName="text-red-600" />
          <MetricCard label="宿題 未提出" value={notSubmittedCount} valueClassName="text-amber-600" />
        </div>

        <Suspense>
          <LessonFilterBar
            subjectNames={subjects.map((subjectItem) => subjectItem.name)}
            teacherNames={teachers.map((teacherItem) => teacherItem.name)}
          />
        </Suspense>

        <LessonTable lessons={pageItems} isAdmin={isAdmin} />

        <LessonPagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={PAGE_SIZE}
          totalCount={totalCount}
          baseParams={{ q, subject, teacher }}
        />
      </div>
    </AdminShell>
  );
}
