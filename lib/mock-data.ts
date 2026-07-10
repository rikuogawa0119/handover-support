import { homeworkStatusLabels } from "@/lib/constants";

export type StudentSummary = {
  id: string;
  name: string;
  grade: string;
  schoolName: string | null;
  note: string | null;
  lastLessonDate: string | null;
};

export type StudentDetail = StudentSummary & {
  lessons: Array<{
    id: string;
    lessonDate: string;
    lessonContent: string;
    understanding: number;
    nextPlan: string | null;
    teacher: { name: string };
    subject: { name: string };
    homework: {
      homeworkContent: string;
      submissionStatus: keyof typeof homeworkStatusLabels;
    } | null;
  }>;
  handovers: Array<{
    id: string;
    memoContent: string;
    createdAt: string;
    teacher: { name: string };
  }>;
};

export const subjects = [
  { id: "subject-math", name: "数学" },
  { id: "subject-english", name: "英語" },
  { id: "subject-japanese", name: "国語" },
  { id: "subject-science", name: "理科" },
  { id: "subject-social", name: "社会" }
];

export const currentTeacher = {
  id: "teacher-demo",
  name: "山田 先生",
  role: "ADMIN",
  email: "demo@example.com"
};

export const students: StudentDetail[] = [
  {
    id: "student-aoi",
    name: "佐藤 葵",
    grade: "中3",
    schoolName: "桜台中学校",
    note: "計算は速い。文章題は条件整理で止まりやすい。",
    lastLessonDate: "2026-06-20",
    lessons: [
      {
        id: "lesson-1",
        lessonDate: "2026-06-20",
        lessonContent: "二次関数の最大・最小を解説。平方完成の手順を確認。",
        understanding: 4,
        nextPlan: "応用問題で定義域があるパターンを扱う。",
        teacher: { name: "山田 先生" },
        subject: { name: "数学" },
        homework: {
          homeworkContent: "ワーク p.42-43 の大問3から5",
          submissionStatus: "ASSIGNED"
        }
      },
      {
        id: "lesson-2",
        lessonDate: "2026-06-13",
        lessonContent: "因数分解の復習。置き換えを使う問題まで演習。",
        understanding: 3,
        nextPlan: "符号ミスの見直しルールを定着させる。",
        teacher: { name: "田中 先生" },
        subject: { name: "数学" },
        homework: {
          homeworkContent: "確認テスト直し",
          submissionStatus: "SUBMITTED"
        }
      }
    ],
    handovers: [
      {
        id: "handover-1",
        memoContent: "部活動後は疲れが出るため、冒頭5分は前回内容の口頭確認から入ると集中しやすい。",
        createdAt: "2026-06-20",
        teacher: { name: "山田 先生" }
      }
    ]
  },
  {
    id: "student-ren",
    name: "鈴木 蓮",
    grade: "高1",
    schoolName: "青葉高校",
    note: "英文法は得意。長文は設問根拠を本文に戻して探す練習中。",
    lastLessonDate: "2026-06-19",
    lessons: [
      {
        id: "lesson-3",
        lessonDate: "2026-06-19",
        lessonContent: "関係代名詞 what と that の違いを整理。",
        understanding: 5,
        nextPlan: "長文内で文法知識を使って構造を取る。",
        teacher: { name: "山田 先生" },
        subject: { name: "英語" },
        homework: {
          homeworkContent: "NextStage 関係詞 10問",
          submissionStatus: "ASSIGNED"
        }
      }
    ],
    handovers: []
  }
];

export function findStudent(id: string) {
  return students.find((student) => student.id === id) ?? null;
}
