"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ALL_VALUE = "all";

export function LessonFilterBar({
  subjectNames,
  teacherNames
}: {
  subjectNames: string[];
  teacherNames: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [, startTransition] = useTransition();

  function applyParams(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    params.delete("page");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-nowrap items-center gap-3">
      <div className="relative min-w-0 flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          aria-hidden="true"
        />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onBlur={() => applyParams({ q: query })}
          onKeyDown={(event) => {
            if (event.key === "Enter") applyParams({ q: query });
          }}
          placeholder="生徒名・科目で検索"
          className="pl-9"
        />
      </div>
      <Select
        defaultValue={searchParams.get("subject") || ALL_VALUE}
        onValueChange={(value) => applyParams({ subject: value === ALL_VALUE ? "" : value })}
      >
        <SelectTrigger className="w-36 shrink-0 sm:w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>科目すべて</SelectItem>
          {subjectNames.map((name) => (
            <SelectItem key={name} value={name}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        defaultValue={searchParams.get("teacher") || ALL_VALUE}
        onValueChange={(value) => applyParams({ teacher: value === ALL_VALUE ? "" : value })}
      >
        <SelectTrigger className="w-36 shrink-0 sm:w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>講師すべて</SelectItem>
          {teacherNames.map((name) => (
            <SelectItem key={name} value={name}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
