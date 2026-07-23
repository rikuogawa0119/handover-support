import { redirect } from "next/navigation";
import { AdminShell } from "@/components/layout/admin-shell";
import { StudentForm } from "@/components/students/student-form";
import { getCurrentTeacher } from "@/lib/data";

export default async function NewStudentPage() {
  const teacherRecord = await getCurrentTeacher();
  if (teacherRecord?.role !== "ADMIN") {
    redirect("/students");
  }

  return (
    <AdminShell active="students">
      <div className="grid gap-6 p-6">
        <div>
          <h1 className="text-lg font-medium">生徒情報登録</h1>
          <p className="text-xs text-muted-foreground">生徒検索と授業記録に使う基本情報を登録します。</p>
        </div>

        <StudentForm mode="create" />
      </div>
    </AdminShell>
  );
}
