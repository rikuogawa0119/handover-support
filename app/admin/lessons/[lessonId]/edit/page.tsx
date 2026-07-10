import { AppShell } from "@/components/layout/app-shell";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function EditLessonPage({
  params
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;

  return (
    <AppShell>
      <div className="grid gap-5">
        <section className="grid gap-2">
          <p className="text-sm font-semibold text-primary">管理者画面</p>
          <h1 className="text-2xl font-bold">授業記録修正</h1>
        </section>

        <Card className="grid gap-4 p-5">
          <p className="text-sm leading-6 text-muted-foreground">
            記録ID：{lessonId}
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            Prisma 保存処理を接続したあと、この画面で既存記録の修正フォームを表示します。
          </p>
          <ButtonLink href="/admin" variant="secondary">
            管理者画面へ戻る
          </ButtonLink>
        </Card>
      </div>
    </AppShell>
  );
}
