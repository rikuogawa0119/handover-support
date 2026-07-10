import { BookOpenCheck, Clock3, Search, UsersRound } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getStudents } from "@/lib/data";

export default async function HomePage() {
  const students = await getStudents();
  const recentStudents = students.slice(0, 3);

  return (
    <AppShell>
      <div className="grid gap-5">
        <section className="grid gap-3">
          <p className="text-sm font-semibold text-primary">今日の授業後に、迷わず3分で記録</p>
          <h1 className="text-2xl font-bold leading-9">生徒の進度・理解度・宿題・引継ぎを一元管理します。</h1>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ButtonLink href="/students" className="w-full">
              <Search className="h-5 w-5" aria-hidden="true" />
              生徒を検索する
            </ButtonLink>
            <ButtonLink href="/admin" variant="secondary" className="w-full">
              <UsersRound className="h-5 w-5" aria-hidden="true" />
              管理者画面
            </ButtonLink>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <Clock3 className="mb-3 h-6 w-6 text-primary" aria-hidden="true" />
            <p className="text-2xl font-bold">{students.length}</p>
            <p className="text-sm text-muted-foreground">登録生徒</p>
          </Card>
          <Card className="p-4">
            <BookOpenCheck className="mb-3 h-6 w-6 text-primary" aria-hidden="true" />
            <p className="text-2xl font-bold">5段階</p>
            <p className="text-sm text-muted-foreground">理解度記録</p>
          </Card>
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-bold">最近確認した生徒</h2>
          {recentStudents.map((student) => (
            <Card key={student.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold">{student.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {student.grade} / {student.schoolName ?? "学校未設定"}
                  </p>
                </div>
                <ButtonLink href={`/students/${student.id}`} size="sm" variant="secondary">
                  詳細
                </ButtonLink>
              </div>
            </Card>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
