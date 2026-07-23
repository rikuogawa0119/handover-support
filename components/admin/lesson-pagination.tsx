import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <p>
        {start}-{end}件 / 全{totalCount}件
      </p>
      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent className="gap-2">
          <PaginationItem>
            {currentPage <= 1 ? (
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" disabled aria-disabled="true">
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </Button>
            ) : (
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" asChild>
                <Link href={hrefFor(currentPage - 1)} aria-label="前へ">
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            )}
          </PaginationItem>
          <PaginationItem>
            {currentPage >= totalPages ? (
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" disabled aria-disabled="true">
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            ) : (
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" asChild>
                <Link href={hrefFor(currentPage + 1)} aria-label="次へ">
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
