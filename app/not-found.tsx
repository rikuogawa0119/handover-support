import { AppShell } from "@/components/layout/app-shell";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <AppShell>
      <Card className="grid gap-4 p-5">
        <h1 className="text-xl font-bold">ページが見つかりません</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          URLを確認するか、トップ画面から操作をやり直してください。
        </p>
        <ButtonLink href="/">トップへ戻る</ButtonLink>
      </Card>
    </AppShell>
  );
}
