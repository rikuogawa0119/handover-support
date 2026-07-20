import { AdminShell } from "@/components/layout/admin-shell";
import { MetricCard } from "@/components/admin/metric-card";
import { LessonTable } from "@/components/admin/lesson-table";
import { ButtonLink } from "@/components/ui/button";
import { getCurrentTeacher, getLessons } from "@/lib/data";
import { getInitials } from "@/lib/utils";

export default async function HomePage() {
  const [teacherRecord, lessons] = await Promise.all([
    getCurrentTeacher(),
    getLessons()
  ]);

  const avatar = (
    <div className="grid h-9 w-9 place-items-center rounded-full bg-gray-100 text-xs font-medium text-gray-700">
      {getInitials(teacherRecord?.name ?? "先生")}
    </div>
  );

  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().slice(0, 10);

  const thisWeekCount = lessons.filter((lesson) => lesson.lessonDate >= weekAgoStr).length;
  const missingContentCount = lessons.filter((lesson) => !lesson.lessonContent.trim()).length;
  const notSubmittedCount = lessons.filter(
    (lesson) => lesson.homework?.submissionStatus === "NOT_SUBMITTED"
  ).length;
  const recentLessons = lessons.slice(0, 5);

  return (
    <AdminShell active="home">
      <div className="grid gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">トップ</h1>
          </div>
          {avatar}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <MetricCard label="今週の記録数" value={thisWeekCount} />
          <MetricCard label="未入力" value={missingContentCount} valueClassName="text-red-600" />
          <MetricCard label="宿題 未提出" value={notSubmittedCount} valueClassName="text-amber-600" />
        </div>

        <ButtonLink href="/students" className="w-fit">
          生徒を検索する
        </ButtonLink>

        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold">直近の授業記録</p>
            <ButtonLink href="/lessons" variant="secondary" size="sm">
              すべて見る
            </ButtonLink>
          </div>
          <LessonTable lessons={recentLessons} isAdmin={false} />
        </div>
      </div>
    </AdminShell>
  );
}
