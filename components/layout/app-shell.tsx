import { ClipboardCheck, Home, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-10 border-b border-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <ClipboardCheck className="h-5 w-5 text-primary" aria-hidden="true" />
            <span>{APP_NAME}</span>
          </Link>
          <Link
            href="/admin"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-white"
            aria-label="管理者画面"
            title="管理者画面"
          >
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-5">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-white">
        <div className="mx-auto grid h-16 max-w-3xl grid-cols-2">
          <Link href="/" className="flex flex-col items-center justify-center gap-1 text-xs font-semibold">
            <Home className="h-5 w-5" aria-hidden="true" />
            トップ
          </Link>
          <Link
            href="/students"
            className="flex flex-col items-center justify-center gap-1 text-xs font-semibold"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
            生徒検索
          </Link>
        </div>
      </nav>
    </div>
  );
}
