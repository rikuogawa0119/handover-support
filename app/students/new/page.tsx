import { redirect } from "next/navigation";
import { Save } from "lucide-react";
import { AdminShell } from "@/components/layout/admin-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/field";
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

        <Card className="grid gap-4 p-5">
          <form className="grid gap-4">
            <Field label="生徒名">
              <Input name="name" placeholder="例：佐藤 葵" />
            </Field>
            <Field label="学年">
              <Input name="grade" placeholder="例：中3" />
            </Field>
            <Field label="学校名">
              <Input name="schoolName" placeholder="例：桜台中学校" />
            </Field>
            <Field label="備考">
              <Textarea name="note" placeholder="例：文章題は条件整理から始めると進めやすい" />
            </Field>
            <Button type="button" className="w-fit">
              <Save className="h-5 w-5" aria-hidden="true" />
              登録する
            </Button>
          </form>
        </Card>
      </div>
    </AdminShell>
  );
}
