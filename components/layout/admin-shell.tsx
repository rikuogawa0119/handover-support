import { AdminBrand, AdminNavList, type NavKey } from "@/components/layout/admin-nav-items";
import { MobileNav } from "@/components/layout/mobile-nav";

export function AdminShell({ active, children }: { active: NavKey; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <aside className="hidden w-[168px] shrink-0 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 md:flex">
        <AdminBrand />
        <AdminNavList active={active} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav active={active} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
