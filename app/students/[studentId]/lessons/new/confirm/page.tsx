import { AppShell } from "@/components/layout/app-shell";
import { LessonConfirm } from "@/components/lessons/lesson-confirm";

export default async function LessonConfirmPage({
  params
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;

  return (
    <AppShell>
      <div className="grid gap-5">
        <section className="grid gap-2">
          <h1 className="text-2xl font-bold">入力内容の確認</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            内容に問題がなければ記録を完了してください。
          </p>
        </section>
        <LessonConfirm studentId={studentId} />
      </div>
    </AppShell>
  );
}
