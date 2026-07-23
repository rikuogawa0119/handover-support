"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export function HeaderAvatar({
  initials,
  isLoggedIn
}: {
  initials: string;
  isLoggedIn: boolean;
}) {
  const router = useRouter();

  async function handleSelect() {
    if (isLoggedIn) {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.refresh();
    }
    router.push("/login");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-full transition focus-visible:outline-none"
          aria-label={isLoggedIn ? "ログアウト" : "ログイン"}
        >
          <Avatar className="h-9 w-9 bg-gray-100 dark:bg-gray-800">
            <AvatarFallback className="bg-transparent text-xs font-medium text-gray-700 dark:text-gray-300">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={handleSelect}>
          {isLoggedIn ? "ログアウト" : "ログイン"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
