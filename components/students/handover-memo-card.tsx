import { Bookmark } from "lucide-react";
import { Card } from "@/components/ui/card";
import { HandoverMemoList } from "@/components/students/handover-memo-list";
import type { StudentDetail } from "@/lib/types";

type Handover = StudentDetail["handovers"][number];

export function HandoverMemoCard({ handovers }: { handovers: Handover[] }) {
  return (
    <Card className="border-amber-100 bg-amber-50 p-4">
      <div className="flex items-center gap-2 text-amber-800">
        <Bookmark className="h-4 w-4" aria-hidden="true" />
        <p className="text-xs font-medium">引継ぎメモ</p>
      </div>
      <HandoverMemoList handovers={handovers} />
    </Card>
  );
}
