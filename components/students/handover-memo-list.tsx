"use client";

import { useState } from "react";
import type { StudentDetail } from "@/lib/types";

type Handover = StudentDetail["handovers"][number];

export function HandoverMemoList({ handovers }: { handovers: Handover[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? handovers : handovers.slice(0, 1);

  return (
    <>
      <div className="mt-2 grid gap-3">
        {visible.map((handover) => (
          <div key={handover.id}>
            <p className="text-sm leading-6 text-amber-900">{handover.memoContent}</p>
            <p className="mt-1 text-xs text-amber-700">
              {handover.createdAt} ・ {handover.teacher.name}
            </p>
          </div>
        ))}
      </div>
      {handovers.length > 1 ? (
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={() => setShowAll((value) => !value)}
            className="text-xs font-medium text-amber-800 underline underline-offset-2 hover:text-amber-900"
          >
            {showAll ? "閉じる" : "すべて見る"}
          </button>
        </div>
      ) : null}
    </>
  );
}
