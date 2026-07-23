"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { ADMIN_APP_NAME } from "@/lib/constants";
import { AdminBrand, AdminNavList, type NavKey } from "@/components/layout/admin-nav-items";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function MobileNav({ active }: { active: NavKey }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="flex w-[220px] max-w-[80vw] flex-col p-0">
        <SheetTitle className="sr-only">ナビゲーションメニュー</SheetTitle>
        <AdminBrand />
        <AdminNavList active={active} onItemClick={() => setOpen(false)} />
      </SheetContent>

      <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-900 md:hidden">
        <SheetTrigger asChild>
          <button
            type="button"
            aria-label="メニューを開く"
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </SheetTrigger>
        <Link href="/" className="text-sm font-medium">
          {ADMIN_APP_NAME}
        </Link>
      </div>
    </Sheet>
  );
}
