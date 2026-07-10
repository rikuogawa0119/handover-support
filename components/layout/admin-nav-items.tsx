import Link from "next/link";
import {
  BookOpenCheck,
  ClipboardCheck,
  Home,
  Settings,
  UsersRound,
  type LucideIcon
} from "lucide-react";
import { ADMIN_APP_NAME } from "@/lib/constants";

export type NavKey = "home" | "lessons" | "students" | "settings";

export const NAV_ITEMS: Array<{ key: NavKey; href: string; label: string; icon: LucideIcon; disabled?: boolean }> = [
  { key: "home", href: "/", label: "ホーム", icon: Home },
  { key: "lessons", href: "/lessons", label: "授業記録", icon: BookOpenCheck },
  { key: "students", href: "/students", label: "生徒管理", icon: UsersRound },
  { key: "settings", href: "#", label: "設定", icon: Settings, disabled: true }
];

export function classNames(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(" ");
}

export function AdminBrand() {
  return (
    <div className="flex items-center gap-2 px-4 py-4">
      <ClipboardCheck className="h-5 w-5 text-gray-900" aria-hidden="true" />
      <span className="font-medium">{ADMIN_APP_NAME}</span>
    </div>
  );
}

export function AdminNavList({ active, onItemClick }: { active: NavKey; onItemClick?: () => void }) {
  return (
    <nav className="grid gap-1 px-2 py-2">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        if (item.disabled) {
          return (
            <span
              key={item.key}
              className="flex cursor-not-allowed items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </span>
          );
        }
        const isActive = item.key === active;
        return (
          <Link
            key={item.key}
            href={item.href}
            onClick={onItemClick}
            className={classNames(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
              isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
