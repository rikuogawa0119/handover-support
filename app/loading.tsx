import { AdminShell } from "@/components/layout/admin-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <AdminShell active="home">
      <div className="grid gap-6 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>

        <Skeleton className="h-12 w-40 rounded-lg" />

        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-20 rounded-lg" />
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    </AdminShell>
  );
}
