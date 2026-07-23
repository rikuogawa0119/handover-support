"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn } from "lucide-react";
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
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

export default function LoginPage() {
  const router = useRouter();
  const [authError, setAuthError] = useState("");

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  async function onSubmit(values: LoginInput) {
    setAuthError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword(values);

    if (error) {
      setAuthError(
        error.message === "Invalid login credentials"
          ? "メールアドレスまたはパスワードが正しくありません。"
          : error.message
      );
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
            <h1 className="text-2xl font-bold">ログイン</h1>
            <p className="text-sm leading-6 text-muted-foreground">
              メールアドレスとパスワードを入力してください。
            </p>
          </div>

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
                        placeholder="パスワード"
                        autoComplete="current-password"
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
                <LogIn className="h-5 w-5" aria-hidden="true" />
                {form.formState.isSubmitting ? "ログイン中..." : "ログイン"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                アカウントをお持ちでない方は{" "}
                <Link href="/signup" className="font-medium text-primary hover:underline">
                  新規登録
                </Link>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
