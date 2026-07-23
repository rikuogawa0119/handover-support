import { UserPlus } from "lucide-react";
import Link from "next/link";
import { AdminShell } from "@/components/layout/admin-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getCurrentTeacher, getLessons, getStudents } from "@/lib/data";

export default async function StudentsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [teacherRecord, allStudents, lessons] = await Promise.all([
    getCurrentTeacher(),
    getStudents(q),
    getLessons()
  ]);

  const isAdmin = teacherRecord?.role === "ADMIN";
  const assignedStudentIds = new Set(
    lessons.filter((lesson) => lesson.teacherName === teacherRecord?.name).map((lesson) => lesson.studentId)
  );
  const students = isAdmin ? allStudents : allStudents.filter((student) => assignedStudentIds.has(student.id));

  return (
    <AdminShell active="students">
      <div className="grid gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-medium">生徒管理</h1>
            <p className="text-xs text-muted-foreground">全{students.length}名</p>
          </div>
          {isAdmin ? (
            <Button asChild size="sm">
              <Link href="/students/new">
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                生徒を登録
              </Link>
            </Button>
          ) : null}
        </div>

        <form className="flex gap-2">
          <Input name="q" defaultValue={q ?? ""} placeholder="生徒名・学年・学校名で検索" />
        </form>

        <div className="grid gap-3">
          {students.length === 0 ? (
            <Card>
              <CardContent className="p-4 text-sm text-muted-foreground">条件に合う生徒が見つかりませんでした。</CardContent>
            </Card>
          ) : null}
          {students.map((student) => (
            <Link key={student.id} href={`/students/${student.id}`}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardContent className="p-4">
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {student.grade} ・ {student.schoolName ?? "学校未設定"} ・ 最終授業日：
                      {student.lastLessonDate ?? "未記録"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
