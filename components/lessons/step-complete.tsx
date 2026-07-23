"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function StepComplete({
  studentId,
  mode = "create"
}: {
  studentId: string;
  mode?: "create" | "edit";
}) {
  return (
    <div className="grid justify-items-center gap-6 py-10 text-center">
      <div className="grid h-20 w-20 place-items-center rounded-full bg-green-100 text-green-700">
        <CheckCircle2 className="h-10 w-10" aria-hidden="true" />
      </div>
      <p className="text-base font-medium">
        {mode === "edit" ? "授業記録を更新しました" : "授業記録を登録しました"}
      </p>
      <div className="grid w-full gap-3">
        <Button asChild className="w-full">
          <Link href={`/students/${studentId}`}>同じ生徒の詳細へ戻る</Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link href="/">トップへ戻る</Link>
        </Button>
      </div>
    </div>
  );
}
