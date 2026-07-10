import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function LessonPagination({
  currentPage,
  totalPages,
  pageSize,
  totalCount,
  baseParams
}: {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  baseParams: { q?: string; subject?: string; teacher?: string };
}) {
  const start = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalCount);

  function hrefFor(page: number) {
    const params = new URLSearchParams();
    if (baseParams.q) params.set("q", baseParams.q);
    if (baseParams.subject) params.set("subject", baseParams.subject);
    if (baseParams.teacher) params.set("teacher", baseParams.teacher);
    params.set("page", String(page));
    return `/lessons?${params.toString()}`;
  }

  const arrowClass = "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200";

  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <p>
        {start}-{end}件 / 全{totalCount}件
      </p>
      <div className="flex items-center gap-2">
        {currentPage <= 1 ? (
          <span className={`${arrowClass} text-gray-300`}>
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </span>
        ) : (
          <Link href={hrefFor(currentPage - 1)} aria-label="前へ" className={`${arrowClass} text-gray-600 hover:bg-gray-50`}>
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
        {currentPage >= totalPages ? (
          <span className={`${arrowClass} text-gray-300`}>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </span>
        ) : (
          <Link href={hrefFor(currentPage + 1)} aria-label="次へ" className={`${arrowClass} text-gray-600 hover:bg-gray-50`}>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>
  );
}
