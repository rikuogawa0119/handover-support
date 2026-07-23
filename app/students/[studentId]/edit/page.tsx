import { notFound, redirect } from "next/navigation";
import { AdminShell } from "@/components/layout/admin-shell";
import { StudentForm } from "@/components/students/student-form";
import { getCurrentTeacher, getStudentDetail } from "@/lib/data";

export default async function EditStudentPage({
  params
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const [teacherRecord, student] = await Promise.all([getCurrentTeacher(), getStudentDetail(studentId)]);

  if (!student) {
    notFound();
  }
  if (teacherRecord?.role !== "ADMIN") {
    redirect(`/students/${studentId}`);
  }

  return (
    <AdminShell active="students">
      <div className="grid gap-6 p-6">
        <div>
          <h1 className="text-lg font-medium">生徒情報編集</h1>
          <p className="text-xs text-muted-foreground">{student.name}の基本情報を編集します。</p>
        </div>

        <StudentForm
          mode="edit"
          studentId={student.id}
          defaultValues={{
            name: student.name,
            grade: student.grade,
            schoolName: student.schoolName ?? "",
            note: student.note ?? ""
          }}
        />
      </div>
    </AdminShell>
  );
}
