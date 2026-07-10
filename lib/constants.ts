export const APP_NAME = "授業引継ぎ支援";

export const understandingLabels: Record<number, string> = {
  1: "かなり不安",
  2: "一部不安",
  3: "標準",
  4: "よく理解",
  5: "自力で説明可"
};

export const homeworkStatusLabels = {
  UNSET: "未設定",
  ASSIGNED: "出題済み",
  SUBMITTED: "提出済み",
  NOT_SUBMITTED: "未提出"
} as const;
