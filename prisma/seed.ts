import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const teacher = await prisma.teacher.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      authUserId: "00000000-0000-0000-0000-000000000001",
      name: "山田 先生",
      role: "ADMIN",
      email: "demo@example.com"
    }
  });

  const math = await prisma.subject.upsert({
    where: { name: "数学" },
    update: {},
    create: { name: "数学" }
  });

  await prisma.subject.upsert({
    where: { name: "英語" },
    update: {},
    create: { name: "英語" }
  });

  const student = await prisma.student.upsert({
    where: { id: "00000000-0000-0000-0000-000000000101" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000101",
      name: "佐藤 葵",
      grade: "中3",
      schoolName: "桜台中学校",
      note: "計算は速い。文章題は条件整理で止まりやすい。"
    }
  });

  const lesson = await prisma.lesson.create({
    data: {
      studentId: student.id,
      teacherId: teacher.id,
      subjectId: math.id,
      lessonDate: new Date("2026-06-20"),
      lessonContent: "二次関数の最大・最小を解説。平方完成の手順を確認。",
      understanding: 4,
      nextPlan: "応用問題で定義域があるパターンを扱う。"
    }
  });

  await prisma.homework.create({
    data: {
      lessonId: lesson.id,
      homeworkContent: "ワーク p.42-43 の大問3から5",
      submissionStatus: "ASSIGNED"
    }
  });

  await prisma.handover.create({
    data: {
      studentId: student.id,
      teacherId: teacher.id,
      memoContent: "冒頭5分は前回内容の口頭確認から入ると集中しやすい。"
    }
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
