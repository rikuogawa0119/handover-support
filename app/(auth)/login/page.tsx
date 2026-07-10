import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/field";
import { APP_NAME } from "@/lib/constants";

export default function LoginPage() {
  return (
    <main className="mx-auto grid min-h-screen max-w-md place-items-center px-4 py-8">
      <Card className="w-full p-5">
        <div className="mb-6 grid gap-2">
          <p className="text-sm font-semibold text-primary">{APP_NAME}</p>
          <h1 className="text-2xl font-bold">ログイン</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Supabase Auth 接続後は、講師アカウントでログインして記録を管理します。
          </p>
        </div>
        <form className="grid gap-4">
          <Field label="メールアドレス">
            <Input type="email" placeholder="例：teacher@example.com" autoComplete="email" />
          </Field>
          <Field label="パスワード">
            <Input type="password" placeholder="8文字以上" autoComplete="current-password" />
          </Field>
          <Button type="button" className="mt-2 w-full">
            <LogIn className="h-5 w-5" aria-hidden="true" />
            ログイン
          </Button>
        </form>
      </Card>
    </main>
  );
}
