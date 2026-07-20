import { AdminShell } from "@/components/layout/admin-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentsLoading() {
  return (
    <AdminShell active="students">
      <div className="grid gap-6 p-6">
        <div className="flex items-center justify-between">
          <div className="grid gap-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>

        <Skeleton className="h-12 w-full rounded-lg" />

        <div className="grid gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-[68px] rounded-xl" />
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
