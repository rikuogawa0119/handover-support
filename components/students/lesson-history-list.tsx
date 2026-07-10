"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { Badge, Card } from "@/components/ui/card";
import { bucketUnderstanding, homeworkStatusLabels } from "@/lib/constants";
import type { StudentDetail } from "@/lib/mock-data";

type Lesson = StudentDetail["lessons"][number];

const INITIAL_COUNT = 4;

export function LessonHistoryList({ lessons }: { lessons: Lesson[] }) {
  const [expanded, setExpanded] = useState(false);

  if (lessons.length === 0) {
    return <p className="text-sm text-muted-foreground">授業記録はまだありません。</p>;
  }

  const visible = expanded ? lessons : lessons.slice(0, INITIAL_COUNT);

  return (
    <div className="grid gap-3">
      {visible.map((lesson) => {
        const tier = bucketUnderstanding(lesson.understanding);
        return (
          <Card key={lesson.id} className="p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">
                {lesson.lessonDate} ・ {lesson.subject.name}
              </p>
              <Badge variant={tier.badgeVariant}>{tier.label}</Badge>
            </div>
            <p className="mt-2 truncate text-sm leading-6">
              {lesson.lessonContent || "（内容未入力）"}
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <ClipboardList className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">
                {lesson.homework?.homeworkContent || "宿題なし"}
                {lesson.homework ? ` ・ ${homeworkStatusLabels[lesson.homework.submissionStatus]}` : ""}
              </span>
            </div>
          </Card>
        );
      })}
      {lessons.length > INITIAL_COUNT ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="justify-self-center text-xs font-medium text-gray-500 underline underline-offset-2 hover:text-gray-700"
        >
          {expanded ? "閉じる" : "もっと見る"}
        </button>
      ) : null}
    </div>
  );
}
