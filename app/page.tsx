import Link from "next/link";
import { FileEdit, MessageSquareWarning } from "lucide-react";
import { AdminShell } from "@/components/layout/admin-shell";
import { HeaderAvatar } from "@/components/layout/header-avatar";
import { LessonTable } from "@/components/admin/lesson-table";
import { TaskSection } from "@/components/home/task-section";
import { TaskListItem } from "@/components/home/task-list-item";
import { Button } from "@/components/ui/button";
import { getCurrentTeacher, getLessons, getRecentHandoverMemos } from "@/lib/data";
import { getMissingContentTasks } from "@/lib/home-tasks";
import { getInitials } from "@/lib/utils";

const MAX_ITEMS = 5;

export default async function HomePage() {
  const [teacherRecord, lessons, recentHandoverMemos] = await Promise.all([
    getCurrentTeacher(),
    getLessons(),
    getRecentHandoverMemos(3)
  ]);

  const avatar = (
    <HeaderAvatar initials={getInitials(teacherRecord?.name ?? "先生")} isLoggedIn={Boolean(teacherRecord)} />
  );

  const recentLessons = lessons.slice(0, 5);

  const missingContentTasks = getMissingContentTasks(lessons);

  return (
    <AdminShell active="home">
      <div className="grid gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">トップ</h1>
          </div>
          {avatar}
        </div>

        <div className="grid gap-4">
          <TaskSection
            icon={<FileEdit className="h-5 w-5 text-red-600" />}
            title="未入力の授業記録"
            count={missingContentTasks.length}
            emptyMessage="未入力の授業記録はありません。"
          >
            {missingContentTasks.slice(0, MAX_ITEMS).map((task) => (
              <TaskListItem
                key={task.lessonId}
                title={`${task.studentName}(${task.subjectName})`}
                description={`${task.lessonDate} の授業記録が未入力です`}
                href={`/students/${task.studentId}/lessons/${task.lessonId}/edit`}
                actionLabel="記録を書く"
              />
            ))}
          </TaskSection>

          <TaskSection
            icon={<MessageSquareWarning className="h-5 w-5 text-amber-600" />}
            title="新着の引継ぎメモ"
            count={recentHandoverMemos.length}
            emptyMessage="直近3日以内の新着メモはありません。"
          >
            {recentHandoverMemos.slice(0, MAX_ITEMS).map((memo) => (
              <TaskListItem
                key={memo.id}
                title={memo.studentName}
                description={memo.memoContent}
                href={`/students/${memo.studentId}`}
                actionLabel="確認する"
              />
            ))}
          </TaskSection>
        </div>
      </div>
    </AdminShell>
  );
}
