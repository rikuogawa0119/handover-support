"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { APP_NAME } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { signupSchema, type SignupInput } from "@/lib/validations/auth";

export default function SignupPage() {
  const router = useRouter();
  const [authError, setAuthError] = useState("");
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "" }
  });

  async function onSubmit(values: SignupInput) {
    setAuthError("");

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp(values);

    if (error) {
      setAuthError(error.message);
      return;
    }

    if (!data.session) {
      // Supabase project still requires email confirmation before a session is issued.
      setSentEmail(values.email);
      setSent(true);
      return;
    }

    const { error: upsertError } = await supabase
      .from("teachers")
      .upsert(
        { teacher_id: data.user!.id, teacher_name: values.email, email: values.email },
        { onConflict: "teacher_id" }
      );

    if (upsertError) {
      setAuthError(upsertError.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="mx-auto grid min-h-screen max-w-md place-items-center px-4 py-8">
      <Card className="w-full">
        <CardContent className="p-5">
          <div className="mb-6 grid gap-2">
            <p className="text-sm font-semibold text-primary">{APP_NAME}</p>
            <h1 className="text-2xl font-bold">新規登録</h1>
            <p className="text-sm leading-6 text-muted-foreground">
              メールアドレスとパスワードを入力してアカウントを作成してください。
            </p>
          </div>

          {sent ? (
            <p className="text-sm leading-6 text-foreground">
              {sentEmail} 宛に確認メールを送信しました。メール内のリンクから登録を完了してください。
            </p>
          ) : (
            <Form {...form}>
              <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>メールアドレス</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="例：teacher@example.com"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>パスワード</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="8文字以上のパスワード"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {authError ? (
                  <p className="text-sm font-medium text-destructive">{authError}</p>
                ) : null}
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  <UserPlus className="h-5 w-5" aria-hidden="true" />
                  {form.formState.isSubmitting ? "登録中..." : "登録する"}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  既にアカウントをお持ちの方は{" "}
                  <Link href="/login" className="font-medium text-primary hover:underline">
                    ログイン
                  </Link>
                </p>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
