"use client";

import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/field";
import { APP_NAME } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
      return;
    }

    setStatus("sent");
  }

  return (
    <main className="mx-auto grid min-h-screen max-w-md place-items-center px-4 py-8">
      <Card className="w-full p-5">
        <div className="mb-6 grid gap-2">
          <p className="text-sm font-semibold text-primary">{APP_NAME}</p>
          <h1 className="text-2xl font-bold">ログイン</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            メールアドレスを入力すると、ログイン用のリンクを送信します。パスワードは不要です。
          </p>
        </div>

        {status === "sent" ? (
          <p className="text-sm leading-6 text-foreground">
            {email} 宛にログインリンクを送信しました。メール内のリンクからログインしてください。
          </p>
        ) : (
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <Field label="メールアドレス">
              <Input
                type="email"
                placeholder="例：teacher@example.com"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Field>
            {status === "error" ? (
              <p className="text-sm font-medium text-destructive">{errorMessage}</p>
            ) : null}
            <Button type="submit" className="w-full" disabled={status === "sending"}>
              <Mail className="h-5 w-5" aria-hidden="true" />
              {status === "sending" ? "送信中..." : "ログインリンクを送信"}
            </Button>
          </form>
        )}
      </Card>
    </main>
  );
}
