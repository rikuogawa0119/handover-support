import { notFound, redirect } from "next/navigation";
import { LessonWizard } from "@/components/lessons/lesson-wizard";
import { getCurrentTeacher, getLessonDetail, getStudentDetail, getSubjects } from "@/lib/data";
import { bucketUnderstanding } from "@/lib/constants";

export default async function EditLessonPage({
  params
}: {
  params: Promise<{ studentId: string; lessonId: string }>;
}) {
  const { studentId, lessonId } = await params;
  const teacherRecord = await getCurrentTeacher();

  if (teacherRecord?.role !== "ADMIN") {
    redirect(`/students/${studentId}`);
  }

  const [student, subjects, lesson] = await Promise.all([
    getStudentDetail(studentId),
    getSubjects(),
    getLessonDetail(studentId, lessonId)
  ]);

  if (!student || !lesson) {
    notFound();
  }

  return (
    <LessonWizard
      studentId={student.id}
      studentName={student.name}
      subjects={subjects}
      mode="edit"
      lessonId={lesson.id}
      initialState={{
        lessonDate: lesson.lessonDate,
        subjectId: lesson.subjectId,
        lessonContent: lesson.lessonContent,
        understanding: bucketUnderstanding(lesson.understanding).key,
        homeworkContent: lesson.homework?.homeworkContent ?? "",
        submissionStatus: lesson.homework?.submissionStatus ?? "UNSET",
        nextPlan: lesson.nextPlan ?? ""
      }}
    />
  );
}
