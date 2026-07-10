import Link from "next/link";
import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/card";
import { bucketUnderstanding, homeworkStatusLabels } from "@/lib/constants";
import type { LessonListItem } from "@/lib/data";

function classNames(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(" ");
}

export function LessonTable({ lessons, isAdmin }: { lessons: LessonListItem[]; isAdmin: boolean }) {
  const columnCount = isAdmin ? 7 : 6;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full min-w-[860px] text-sm">
        <thead>
          <tr className="bg-gray-50 text-left text-xs text-gray-500">
            <th className="px-4 py-3 font-medium">日付</th>
            <th className="px-4 py-3 font-medium">生徒名</th>
            <th className="px-4 py-3 font-medium">科目</th>
            <th className="px-4 py-3 font-medium">授業内容</th>
            <th className="px-4 py-3 font-medium">理解度</th>
            <th className="px-4 py-3 font-medium">宿題状況</th>
            {isAdmin ? <th className="px-4 py-3" /> : null}
          </tr>
        </thead>
        <tbody>
          {lessons.length === 0 ? (
            <tr>
              <td colSpan={columnCount} className="px-4 py-8 text-center text-sm text-muted-foreground">
                条件に合う授業記録がありません。
              </td>
            </tr>
          ) : null}
          {lessons.map((lesson) => {
            const isMissing = !lesson.lessonContent.trim();
            const tier = bucketUnderstanding(lesson.understanding);
            return (
              <tr
                key={lesson.id}
                className={classNames("border-b border-gray-100 last:border-b-0", isMissing && "bg-red-50")}
              >
                <td className="whitespace-nowrap px-4 py-3 text-gray-600">{lesson.lessonDate}</td>
                <td className="whitespace-nowrap px-4 py-3 font-medium">
                  <Link href={`/students/${lesson.studentId}`} className="hover:underline">
                    {lesson.studentName}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-600">{lesson.subjectName}</td>
                <td className="max-w-xs truncate px-4 py-3 text-gray-600">{lesson.lessonContent || "—"}</td>
                <td className="px-4 py-3">
                  {isMissing ? (
                    <Badge variant="red">未入力</Badge>
                  ) : (
                    <Badge variant={tier.badgeVariant}>{tier.label}</Badge>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                  {lesson.homework ? homeworkStatusLabels[lesson.homework.submissionStatus] : "未設定"}
                </td>
                {isAdmin ? (
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/students/${lesson.studentId}/lessons/${lesson.id}/edit`}
                      aria-label="記録を編集"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
