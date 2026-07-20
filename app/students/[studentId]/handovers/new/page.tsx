import { notFound } from "next/navigation";
import { Save } from "lucide-react";
import { AdminShell } from "@/components/layout/admin-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Textarea } from "@/components/ui/field";
import { getStudentDetail } from "@/lib/data";
import { createHandoverAction } from "@/app/students/[studentId]/handovers/actions";

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

        <Card className="grid gap-4 p-5">
          <form className="grid gap-4" action={createHandoverAction.bind(null, student.id)}>
            <Field label="引継ぎメモ" hint="代講の講師に伝えたいことを記入してください">
              <Textarea name="memoContent" placeholder="例：夏期講習の相談があり、次回面談で日程を確定予定" required />
            </Field>
            <Button type="submit" className="w-fit">
              <Save className="h-5 w-5" aria-hidden="true" />
              登録する
            </Button>
          </form>
        </Card>
      </div>
    </AdminShell>
  );
}
