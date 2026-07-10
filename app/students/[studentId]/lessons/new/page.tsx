import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { LessonForm } from "@/components/lessons/lesson-form";
import { getStudentDetail, getSubjects } from "@/lib/data";

export default async function NewLessonPage({
  params
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const [student, subjects] = await Promise.all([getStudentDetail(studentId), getSubjects()]);

  if (!student) {
    notFound();
  }

  return (
    <AppShell>
      <div className="grid gap-5">
        <section className="grid gap-2">
          <p className="text-sm font-semibold text-primary">{student.name}</p>
          <h1 className="text-2xl font-bold">授業記録入力</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            上から順に入力して、最後に確認へ進んでください。
          </p>
        </section>
        <LessonForm studentId={student.id} studentName={student.name} subjects={subjects} />
      </div>
    </AppShell>
  );
}
