export const APP_NAME = "授業引継ぎ支援";
export const ADMIN_APP_NAME = "handover";

export type UnderstandingTierKey = "GOOD" | "PARTIAL" | "NEEDS_REVIEW";

export const UNDERSTANDING_TIERS: Array<{
  key: UnderstandingTierKey;
  label: string;
  value: number;
  badgeVariant: "green" | "amber" | "red";
  activeClassName: string;
}> = [
  {
    key: "GOOD",
    label: "よく理解",
    value: 5,
    badgeVariant: "green",
    activeClassName: "border-green-600 bg-green-100 text-green-800"
  },
  {
    key: "PARTIAL",
    label: "一部理解",
    value: 3,
    badgeVariant: "amber",
    activeClassName: "border-amber-500 bg-amber-100 text-amber-800"
  },
  {
    key: "NEEDS_REVIEW",
    label: "要復習",
    value: 1,
    badgeVariant: "red",
    activeClassName: "border-red-500 bg-red-100 text-red-800"
  }
];

export function findUnderstandingTier(key: UnderstandingTierKey) {
  return UNDERSTANDING_TIERS.find((tier) => tier.key === key)!;
}

/** Legacy records may still hold the old 1-5 scale; bucket them into the 3-tier model for display. */
export function bucketUnderstanding(value: number) {
  if (value >= 4) return UNDERSTANDING_TIERS[0];
  if (value === 3) return UNDERSTANDING_TIERS[1];
  return UNDERSTANDING_TIERS[2];
}

export type HomeworkStatusKey = "UNSET" | "ASSIGNED" | "SUBMITTED" | "NOT_SUBMITTED";

export const homeworkStatusLabels: Record<HomeworkStatusKey, string> = {
  UNSET: "未設定",
  ASSIGNED: "出題済み",
  SUBMITTED: "提出済み",
  NOT_SUBMITTED: "未提出"
};

export const HOMEWORK_STATUS_OPTIONS: Array<{
  key: Exclude<HomeworkStatusKey, "UNSET">;
  label: string;
  activeClassName: string;
}> = [
  {
    key: "ASSIGNED",
    label: "出題済み",
    activeClassName: "border-gray-400 bg-gray-100 text-gray-700"
  },
  {
    key: "SUBMITTED",
    label: "提出済み",
    activeClassName: "border-green-600 bg-green-100 text-green-800"
  },
  {
    key: "NOT_SUBMITTED",
    label: "未提出",
    activeClassName: "border-red-500 bg-red-100 text-red-800"
  }
];

// Kept for any legacy 1-5 scale display (e.g. seed data not yet migrated to tiers).
export const understandingLabels: Record<number, string> = {
  1: "かなり不安",
  2: "一部不安",
  3: "標準",
  4: "よく理解",
  5: "自力で説明可"
};
