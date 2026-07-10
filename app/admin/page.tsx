import { FilePenLine, UserPlus, UsersRound } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getStudents } from "@/lib/data";

export default async function AdminPage() {
  const students = await getStudents();

  return (
    <AppShell>
      <div className="grid gap-5">
        <section className="grid gap-2">
          <p className="text-sm font-semibold text-primary">管理者画面</p>
          <h1 className="text-2xl font-bold">生徒情報と授業記録の管理</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            副責任者・教室長が生徒登録や記録修正を行う画面です。
          </p>
        </section>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ButtonLink href="/admin/students/new" className="w-full">
            <UserPlus className="h-5 w-5" aria-hidden="true" />
            生徒を登録
          </ButtonLink>
          <ButtonLink href="/students" variant="secondary" className="w-full">
            <UsersRound className="h-5 w-5" aria-hidden="true" />
            生徒一覧を見る
          </ButtonLink>
        </div>

        <section className="grid gap-3">
          <h2 className="text-lg font-bold">記録修正</h2>
          {students.map((student) => (
            <Card key={student.id} className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold">{student.name}</p>
                  <p className="text-sm text-muted-foreground">
                    最終授業日：{student.lastLessonDate ?? "未記録"}
                  </p>
                </div>
                <ButtonLink href={`/students/${student.id}`} variant="secondary" size="sm">
                  <FilePenLine className="h-4 w-4" aria-hidden="true" />
                  確認
                </ButtonLink>
              </div>
            </Card>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
