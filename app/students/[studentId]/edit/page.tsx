import { notFound, redirect } from "next/navigation";
import { Save } from "lucide-react";
import { AdminShell } from "@/components/layout/admin-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/field";
import { getCurrentTeacher, getStudentDetail } from "@/lib/data";
import { updateStudentAction } from "@/app/students/actions";

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

        <Card className="grid gap-4 p-5">
          <form className="grid gap-4" action={updateStudentAction.bind(null, student.id)}>
            <Field label="生徒名">
              <Input name="name" defaultValue={student.name} required />
            </Field>
            <Field label="学年">
              <Input name="grade" defaultValue={student.grade} />
            </Field>
            <Field label="学校名">
              <Input name="schoolName" defaultValue={student.schoolName ?? ""} />
            </Field>
            <Field label="備考">
              <Textarea name="note" defaultValue={student.note ?? ""} />
            </Field>
            <Button type="submit" className="w-fit">
              <Save className="h-5 w-5" aria-hidden="true" />
              保存する
            </Button>
          </form>
        </Card>
      </div>
    </AdminShell>
  );
}
