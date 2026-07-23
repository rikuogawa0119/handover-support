import { redirect } from "next/navigation";
import { AdminShell } from "@/components/layout/admin-shell";
import { HeaderAvatar } from "@/components/layout/header-avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/settings/theme-toggle";
import { getCurrentTeacher } from "@/lib/data";
import { getInitials } from "@/lib/utils";

export default async function SettingsPage() {
  const teacherRecord = await getCurrentTeacher();
  if (!teacherRecord) {
    redirect("/login");
  }

  return (
    <AdminShell active="settings">
      <div className="grid gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-medium">設定</h1>
          </div>
          <HeaderAvatar initials={getInitials(teacherRecord.name)} isLoggedIn />
        </div>

        <Card>
          <CardContent className="grid gap-3 p-5">
            <div>
              <h2 className="text-sm font-medium">外観</h2>
              <p className="text-xs text-muted-foreground">画面の配色を選択します。「システム」はOSの設定に従います。</p>
            </div>
            <ThemeToggle />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="grid gap-3 p-5">
            <div>
              <h2 className="text-sm font-medium">アカウント</h2>
              <p className="text-xs text-muted-foreground">ログイン中のメールアドレスです。</p>
            </div>
            <p className="text-sm">{teacherRecord.email}</p>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
