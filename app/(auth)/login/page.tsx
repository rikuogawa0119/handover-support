"use client";

import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/field";
import { APP_NAME } from "@/lib/constants";

import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://your-project-id.supabase.co', 'sb_publishable_...')

// ---cut---
async function signUpNewUser() {
  await supabase.auth.signUp({
    email: 'valid.email@supabase.io',
    password: 'example-password',
    options: {
      emailRedirectTo: 'https://example.com/welcome',
    },
  })
}

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
            <Button type="button" className="w-full">
              <LogIn className="h-5 w-5" aria-hidden="true" />
              ログイン
            </Button>
            <p className="text-sm text-muted-foreground">
              アカウントをお持ちでない場合は、下のボタンから新規登録してください。
            </p>
            <Button type="button" className="w-full" onClick={signUpNewUser}>
              <LogIn className="h-5 w-5" aria-hidden="true" />
              新規登録
            </Button>
            <p className="text-sm text-muted-foreground">
              すでにアカウントをお持ちの場合は、下のボタンからログインしてください。
            </p>
        </form>
      </Card>
    </main>
  );
}
