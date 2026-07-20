"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function HeaderAvatar({
  initials,
  isLoggedIn
}: {
  initials: string;
  isLoggedIn: boolean;
}) {
  const router = useRouter();

  async function handleClick() {
    if (isLoggedIn) {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.refresh();
    }
    router.push("/login");
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="grid h-9 w-9 place-items-center rounded-full bg-gray-100 text-xs font-medium text-gray-700 transition hover:bg-gray-200"
      aria-label={isLoggedIn ? "ログアウト" : "ログイン"}
    >
      {initials}
    </button>
  );
}
