"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ADMIN_APP_NAME } from "@/lib/constants";
import { AdminBrand, AdminNavList, classNames, type NavKey } from "@/components/layout/admin-nav-items";

export function MobileNav({ active }: { active: NavKey }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={classNames(
          "fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      />
      <aside
        id="admin-mobile-nav"
        className={classNames(
          "fixed inset-y-0 left-0 z-50 flex w-[220px] max-w-[80vw] flex-col border-r border-gray-200 bg-white",
          "transition-transform duration-200 ease-in-out md:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between pr-2">
          <AdminBrand />
          <button
            type="button"
            aria-label="メニューを閉じる"
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <AdminNavList active={active} onItemClick={() => setOpen(false)} />
      </aside>

      <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-3 py-2 md:hidden">
        <button
          type="button"
          aria-label="メニューを開く"
          aria-expanded={open}
          aria-controls="admin-mobile-nav"
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
        <span className="text-sm font-medium">{ADMIN_APP_NAME}</span>
      </div>
    </>
  );
}
