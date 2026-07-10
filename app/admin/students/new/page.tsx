import { Save } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/field";

export default function NewStudentPage() {
  return (
    <AppShell>
      <div className="grid gap-5">
        <section className="grid gap-2">
          <p className="text-sm font-semibold text-primary">管理者画面</p>
          <h1 className="text-2xl font-bold">生徒情報登録</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            生徒検索と授業記録に使う基本情報を登録します。
          </p>
        </section>

        <Card className="p-4">
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
            <Button type="button" className="w-full">
              <Save className="h-5 w-5" aria-hidden="true" />
              登録する
            </Button>
          </form>
        </Card>
      </div>
    </AppShell>
  );
}
