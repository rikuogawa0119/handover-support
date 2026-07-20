import { AdminShell } from "@/components/layout/admin-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function LessonsLoading() {
  return (
    <AdminShell active="lessons">
      <div className="grid gap-6 p-6">
        <div className="flex items-center justify-between">
          <div className="grid gap-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>

        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-96 rounded-xl" />

        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
