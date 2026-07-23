import Link from "next/link";
import { AdminShell } from "@/components/layout/admin-shell";
import { HeaderAvatar } from "@/components/layout/header-avatar";
import { MetricCard } from "@/components/admin/metric-card";
import { LessonTable } from "@/components/admin/lesson-table";
import { Button } from "@/components/ui/button";
import { getCurrentTeacher, getLessons } from "@/lib/data";
import { getInitials } from "@/lib/utils";

export default async function HomePage() {
  const [teacherRecord, lessons] = await Promise.all([
    getCurrentTeacher(),
    getLessons()
  ]);

  const avatar = (
    <HeaderAvatar initials={getInitials(teacherRecord?.name ?? "先生")} isLoggedIn={Boolean(teacherRecord)} />
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

        <Button asChild className="w-fit">
          <Link href="/students">生徒を検索する</Link>
        </Button>

        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold">直近の授業記録</p>
            <Button asChild variant="outline" size="sm">
              <Link href="/lessons">すべて見る</Link>
            </Button>
          </div>
          <LessonTable lessons={recentLessons} isAdmin={false} />
        </div>
      </div>
    </AdminShell>
  );
}
