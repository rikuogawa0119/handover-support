import { notFound } from "next/navigation";
import { LessonWizard } from "@/components/lessons/lesson-wizard";
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

  return <LessonWizard studentId={student.id} studentName={student.name} subjects={subjects} />;
}
