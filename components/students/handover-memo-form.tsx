"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { unstable_rethrow } from "next/navigation";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { handoverSchema, type HandoverInput } from "@/lib/validations/handover";
import { createHandoverAction } from "@/app/students/[studentId]/handovers/actions";

export function HandoverMemoForm({ studentId }: { studentId: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<HandoverInput>({
    resolver: zodResolver(handoverSchema),
    defaultValues: { memoContent: "" }
  });

  async function onSubmit(values: HandoverInput) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await createHandoverAction(studentId, values);
    } catch (error) {
      unstable_rethrow(error);
      setSubmitError("保存に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardContent className="grid gap-4 p-5">
        <Form {...form}>
          <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="memoContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>引継ぎメモ</FormLabel>
                  <FormControl>
                    <Textarea placeholder="例：夏期講習の相談があり、次回面談で日程を確定予定" {...field} />
                  </FormControl>
                  <p className="text-xs leading-5 text-muted-foreground">代講の講師に伝えたいことを記入してください</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}
            <Button type="submit" className="w-fit" disabled={submitting}>
              <Save className="h-5 w-5" aria-hidden="true" />
              {submitting ? "保存中…" : "登録する"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
