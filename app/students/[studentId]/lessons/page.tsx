import { notFound } from "next/navigation";
import { AdminShell } from "@/components/layout/admin-shell";
import { ButtonLink } from "@/components/ui/button";
import { LessonHistoryList } from "@/components/students/lesson-history-list";
import { getStudentDetail } from "@/lib/data";

export default async function StudentLessonsPage({
  params
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const student = await getStudentDetail(studentId);

  if (!student) {
    notFound();
  }

  return (
    <AdminShell active="students">
      <div className="grid gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-medium">{student.name}の授業記録</h1>
            <p className="text-xs text-muted-foreground">全{student.lessons.length}件</p>
          </div>
          <ButtonLink href={`/students/${student.id}/lessons/new`} size="sm">
            記録を登録
          </ButtonLink>
        </div>

        <LessonHistoryList lessons={student.lessons} />
      </div>
    </AdminShell>
  );
}
