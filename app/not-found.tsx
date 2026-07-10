import { AdminShell } from "@/components/layout/admin-shell";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <AdminShell active="home">
      <div className="grid gap-6 p-6">
        <Card className="grid gap-4 p-5">
          <h1 className="text-lg font-medium">ページが見つかりません</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            URLを確認するか、トップ画面から操作をやり直してください。
          </p>
          <ButtonLink href="/" className="w-fit">
            トップへ戻る
          </ButtonLink>
        </Card>
      </div>
    </AdminShell>
  );
}
