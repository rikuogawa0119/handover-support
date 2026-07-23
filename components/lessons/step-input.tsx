"use client";

import type { RefObject } from "react";
import type { Control } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { HOMEWORK_STATUS_OPTIONS, UNDERSTANDING_TIERS } from "@/lib/constants";
import type { SubjectOption, WizardState } from "@/components/lessons/lesson-wizard";

export function StepInput({
  control,
  subjects,
  groupARef,
  groupBRef,
  groupCRef
}: {
  control: Control<WizardState>;
  subjects: SubjectOption[];
  groupARef: RefObject<HTMLDivElement | null>;
  groupBRef: RefObject<HTMLDivElement | null>;
  groupCRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="grid gap-4">
      <div ref={groupARef}>
        <Card>
          <CardContent className="grid gap-4 p-5">
            <p className="text-xs font-medium text-gray-500">授業内容</p>
            <FormField
              control={control}
              name="lessonDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    授業日<span className="ml-1 text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="subjectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    科目<span className="ml-1 text-destructive">*</span>
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="lessonContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    授業内容<span className="ml-1 text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="例：二次関数の最大・最小を解説" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="understanding"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    理解度<span className="ml-1 text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="single"
                      aria-label="理解度"
                      className="grid grid-flow-col auto-cols-fr gap-2"
                      value={field.value ?? undefined}
                      onValueChange={(value) => {
                        if (value) field.onChange(value);
                      }}
                    >
                      {UNDERSTANDING_TIERS.map((tier) => (
                        <ToggleGroupItem
                          key={tier.key}
                          value={tier.key}
                          className={cn(
                            "h-11 rounded-lg border text-sm font-medium",
                            field.value === tier.key && tier.activeClassName
                          )}
                        >
                          {tier.label}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </div>

      <div ref={groupBRef}>
        <Card>
          <CardContent className="grid gap-4 p-5">
            <p className="text-xs font-medium text-gray-500">宿題</p>
            <FormField
              control={control}
              name="homeworkContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>宿題内容</FormLabel>
                  <FormControl>
                    <Input placeholder="例：問題集 p.32〜34" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="submissionStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>提出状況</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="single"
                      aria-label="提出状況"
                      className="grid grid-flow-col auto-cols-fr gap-2"
                      value={field.value === "UNSET" ? undefined : field.value}
                      onValueChange={(value) => {
                        if (value) field.onChange(value);
                      }}
                    >
                      {HOMEWORK_STATUS_OPTIONS.map((option) => (
                        <ToggleGroupItem
                          key={option.key}
                          value={option.key}
                          className={cn(
                            "h-11 rounded-lg border text-sm font-medium",
                            field.value === option.key && option.activeClassName
                          )}
                        >
                          {option.label}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </div>

      <div ref={groupCRef}>
        <Card>
          <CardContent className="grid gap-4 p-5">
            <p className="text-xs font-medium text-gray-500">次回内容</p>
            <FormField
              control={control}
              name="nextPlan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    次回実施予定<span className="ml-1 text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="例：定義域がある最大・最小の問題から再開" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="memoContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>引継ぎメモ</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <p className="text-xs leading-5 text-muted-foreground">代講の講師に伝えたいことがあれば</p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
