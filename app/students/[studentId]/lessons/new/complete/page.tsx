import { AppShell } from "@/components/layout/app-shell";
import { LessonComplete } from "@/components/lessons/lesson-complete";

export default async function LessonCompletePage({
  params
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;

  return (
    <AppShell>
      <LessonComplete studentId={studentId} />
    </AppShell>
  );
}
