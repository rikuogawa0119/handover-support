"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { unstable_rethrow } from "next/navigation";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { studentSchema, type StudentInput } from "@/lib/validations/student";
import { createStudentAction, updateStudentAction } from "@/app/students/actions";

export function StudentForm({
  mode,
  studentId,
  defaultValues
}: {
  mode: "create" | "edit";
  studentId?: string;
  defaultValues?: Partial<StudentInput>;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<StudentInput>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      grade: defaultValues?.grade ?? "",
      schoolName: defaultValues?.schoolName ?? "",
      note: defaultValues?.note ?? ""
    }
  });

  async function onSubmit(values: StudentInput) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      if (mode === "edit" && studentId) {
        await updateStudentAction(studentId, values);
      } else {
        await createStudentAction(values);
      }
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>生徒名</FormLabel>
                  <FormControl>
                    <Input placeholder="例：佐藤 葵" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>学年</FormLabel>
                  <FormControl>
                    <Input placeholder="例：中3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="schoolName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>学校名</FormLabel>
                  <FormControl>
                    <Input placeholder="例：桜台中学校" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>備考</FormLabel>
                  <FormControl>
                    <Textarea placeholder="例：文章題は条件整理から始めると進めやすい" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}
            <Button type="submit" className="w-fit" disabled={submitting}>
              <Save className="h-5 w-5" aria-hidden="true" />
              {submitting ? "保存中…" : mode === "edit" ? "保存する" : "登録する"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
