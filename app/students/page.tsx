import { Search } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/field";
import { getStudents } from "@/lib/data";

export default async function StudentsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const students = await getStudents(q);

  return (
    <AppShell>
      <div className="grid gap-5">
        <section className="grid gap-2">
          <h1 className="text-2xl font-bold">生徒検索</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            名前、学年、学校名で検索できます。
          </p>
        </section>

        <form className="flex gap-2">
          <Input name="q" defaultValue={q ?? ""} placeholder="例：佐藤 / 中3 / 桜台" />
          <button
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-primary bg-primary text-primary-foreground"
            type="submit"
            aria-label="検索"
            title="検索"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </button>
        </form>

        <section className="grid gap-3">
          {students.length === 0 ? (
            <Card className="p-5 text-sm text-muted-foreground">
              条件に合う生徒が見つかりませんでした。
            </Card>
          ) : null}
          {students.map((student) => (
            <Card key={student.id} className="p-4">
              <div className="grid gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-bold">{student.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {student.grade} / {student.schoolName ?? "学校未設定"}
                    </p>
                  </div>
                  <ButtonLink href={`/students/${student.id}`} size="sm">
                    詳細
                  </ButtonLink>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  最終授業日：{student.lastLessonDate ?? "未記録"}
                </p>
              </div>
            </Card>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
