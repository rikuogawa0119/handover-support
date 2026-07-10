import { notFound } from "next/navigation";
import { FilePenLine, StickyNote } from "lucide-react";
import { AdminShell } from "@/components/layout/admin-shell";
import { ButtonLink } from "@/components/ui/button";
import { HandoverMemoCard } from "@/components/students/handover-memo-card";
import { LessonHistoryList } from "@/components/students/lesson-history-list";
import { getCurrentTeacher, getStudentDetail } from "@/lib/data";
import { getInitials } from "@/lib/utils";

export default async function StudentDetailPage({
  params
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const [teacherRecord, student] = await Promise.all([getCurrentTeacher(), getStudentDetail(studentId)]);

  if (!student) {
    notFound();
  }

  const isAdmin = teacherRecord?.role === "ADMIN";
  const subjectNames = Array.from(new Set(student.lessons.map((lesson) => lesson.subject.name)));

  return (
    <AdminShell active="students">
      <div className="grid gap-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gray-100 text-sm font-medium text-gray-700">
              {getInitials(student.name)}
            </div>
            <div>
              <p className="text-[15px] font-medium">{student.name}</p>
              <p className="text-xs text-muted-foreground">
                {student.grade}
                {subjectNames.length ? ` ・ ${subjectNames.join("、")}` : ""}
              </p>
            </div>
          </div>
          {isAdmin ? (
            <ButtonLink href={`/students/${student.id}/edit`} variant="secondary" size="sm">
              <FilePenLine className="h-4 w-4" aria-hidden="true" />
              編集
            </ButtonLink>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3">
          <ButtonLink href={`/students/${student.id}/lessons/new`} size="sm">
            授業記録を登録
          </ButtonLink>
          <ButtonLink href={`/students/${student.id}/lessons`} variant="secondary" size="sm">
            授業記録一覧
          </ButtonLink>
          <ButtonLink href={`/students/${student.id}/handovers/new`} variant="secondary" size="sm">
            <StickyNote className="h-4 w-4" aria-hidden="true" />
            引継ぎメモを追加
          </ButtonLink>
        </div>

        {student.handovers.length > 0 ? <HandoverMemoCard handovers={student.handovers} /> : null}

        <div className="grid gap-3">
          <p className="text-xs font-medium text-gray-500">直近の授業記録</p>
          <LessonHistoryList lessons={student.lessons} />
        </div>
      </div>
    </AdminShell>
  );
}
