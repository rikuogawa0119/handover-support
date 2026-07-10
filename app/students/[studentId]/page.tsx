import { notFound } from "next/navigation";
import { CalendarDays, ClipboardPlus } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge, Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { getStudentDetail } from "@/lib/data";
import { homeworkStatusLabels, understandingLabels } from "@/lib/constants";

export default async function StudentDetailPage({
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
    <AppShell>
      <div className="grid gap-5">
        <section className="grid gap-3">
          <div>
            <h1 className="text-2xl font-bold">{student.name}</h1>
            <p className="text-sm text-muted-foreground">
              {student.grade} / {student.schoolName ?? "学校未設定"}
            </p>
          </div>
          {student.note ? (
            <Card className="p-4 text-sm leading-6 text-muted-foreground">{student.note}</Card>
          ) : null}
          <ButtonLink href={`/students/${student.id}/lessons/new`} className="w-full">
            <ClipboardPlus className="h-5 w-5" aria-hidden="true" />
            授業記録を入力
          </ButtonLink>
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-bold">過去の授業記録</h2>
          {student.lessons.map((lesson) => (
            <Card key={lesson.id} className="p-4">
              <div className="grid gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>
                    <CalendarDays className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                    {lesson.lessonDate}
                  </Badge>
                  <Badge>{lesson.subject.name}</Badge>
                  <Badge>{understandingLabels[lesson.understanding]}</Badge>
                </div>
                <p className="text-sm leading-6">{lesson.lessonContent}</p>
                <div className="grid gap-1 rounded-md border border-border bg-muted p-3 text-sm">
                  <p className="font-semibold">宿題</p>
                  <p className="text-muted-foreground">
                    {lesson.homework?.homeworkContent || "未設定"} /{" "}
                    {lesson.homework
                      ? homeworkStatusLabels[lesson.homework.submissionStatus]
                      : "未設定"}
                  </p>
                </div>
                {lesson.nextPlan ? (
                  <p className="text-sm leading-6 text-muted-foreground">次回：{lesson.nextPlan}</p>
                ) : null}
                <p className="text-xs font-semibold text-muted-foreground">
                  記録者：{lesson.teacher.name}
                </p>
              </div>
            </Card>
          ))}
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-bold">引継ぎメモ</h2>
          {student.handovers.length === 0 ? (
            <Card className="p-4 text-sm text-muted-foreground">引継ぎメモはまだありません。</Card>
          ) : null}
          {student.handovers.map((handover) => (
            <Card key={handover.id} className="p-4">
              <p className="text-sm leading-6">{handover.memoContent}</p>
              <p className="mt-3 text-xs font-semibold text-muted-foreground">
                {handover.createdAt} / {handover.teacher.name}
              </p>
            </Card>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
