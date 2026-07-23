import { notFound } from "next/navigation";
import { AdminShell } from "@/components/layout/admin-shell";
import { HandoverMemoForm } from "@/components/students/handover-memo-form";
import { getStudentDetail } from "@/lib/data";

export default async function NewHandoverPage({
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
    <AdminShell active="students">
      <div className="grid gap-6 p-6">
        <div>
          <h1 className="text-lg font-medium">引継ぎメモを追加</h1>
          <p className="text-xs text-muted-foreground">{student.name}への引継ぎメモを登録します。</p>
        </div>

        <HandoverMemoForm studentId={student.id} />
      </div>
    </AdminShell>
  );
}
