import Link from "next/link";
import { Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { bucketUnderstanding, homeworkStatusLabels } from "@/lib/constants";
import type { LessonListItem } from "@/lib/data";

export function LessonTable({ lessons, isAdmin }: { lessons: LessonListItem[]; isAdmin: boolean }) {
  const columnCount = isAdmin ? 7 : 6;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <Table className="min-w-[860px] text-sm">
        <TableHeader>
          <TableRow className="bg-gray-50 text-left text-xs text-gray-500 hover:bg-gray-50">
            <TableHead className="px-4 py-3 font-medium text-gray-500">日付</TableHead>
            <TableHead className="px-4 py-3 font-medium text-gray-500">生徒名</TableHead>
            <TableHead className="px-4 py-3 font-medium text-gray-500">科目</TableHead>
            <TableHead className="px-4 py-3 font-medium text-gray-500">授業内容</TableHead>
            <TableHead className="px-4 py-3 font-medium text-gray-500">理解度</TableHead>
            <TableHead className="px-4 py-3 font-medium text-gray-500">宿題状況</TableHead>
            {isAdmin ? <TableHead className="px-4 py-3" /> : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {lessons.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columnCount} className="px-4 py-8 text-center text-sm text-muted-foreground">
                条件に合う授業記録がありません。
              </TableCell>
            </TableRow>
          ) : null}
          {lessons.map((lesson) => {
            const isMissing = !lesson.lessonContent.trim();
            const tier = bucketUnderstanding(lesson.understanding);
            return (
              <TableRow
                key={lesson.id}
                className={cn("border-b border-gray-100 last:border-b-0", isMissing && "bg-red-50")}
              >
                <TableCell className="whitespace-nowrap px-4 py-3 text-gray-600">{lesson.lessonDate}</TableCell>
                <TableCell className="whitespace-nowrap px-4 py-3 font-medium">
                  <Link href={`/students/${lesson.studentId}`} className="hover:underline">
                    {lesson.studentName}
                  </Link>
                </TableCell>
                <TableCell className="whitespace-nowrap px-4 py-3 text-gray-600">{lesson.subjectName}</TableCell>
                <TableCell className="max-w-xs truncate px-4 py-3 text-gray-600">
                  {lesson.lessonContent || "—"}
                </TableCell>
                <TableCell className="px-4 py-3">
                  {isMissing ? (
                    <Badge variant="red">未入力</Badge>
                  ) : (
                    <Badge variant={tier.badgeVariant}>{tier.label}</Badge>
                  )}
                </TableCell>
                <TableCell className="whitespace-nowrap px-4 py-3 text-gray-600">
                  {lesson.homework ? homeworkStatusLabels[lesson.homework.submissionStatus] : "未設定"}
                </TableCell>
                {isAdmin ? (
                  <TableCell className="px-4 py-3 text-right">
                    <Link
                      href={`/students/${lesson.studentId}/lessons/${lesson.id}/edit`}
                      aria-label="記録を編集"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </TableCell>
                ) : null}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
