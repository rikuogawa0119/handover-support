import Link from "next/link";
import { AdminShell } from "@/components/layout/admin-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <AdminShell active="home">
      <div className="grid gap-6 p-6">
        <Card>
          <CardContent className="grid gap-4 p-5">
            <h1 className="text-lg font-medium">ページが見つかりません</h1>
            <p className="text-sm leading-6 text-muted-foreground">
              URLを確認するか、トップ画面から操作をやり直してください。
            </p>
            <Button asChild className="w-fit">
              <Link href="/">トップへ戻る</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
