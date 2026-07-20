"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function readStudentValues(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const grade = String(formData.get("grade") ?? "").trim();
  const schoolName = String(formData.get("schoolName") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  return {
    student_name: name,
    grade: grade || null,
    school_name: schoolName || null,
    note: note || null
  };
}

export async function createStudentAction(formData: FormData) {
  const values = readStudentValues(formData);
  if (!values.student_name) throw new Error("生徒名を入力してください。");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("students")
    .insert(values)
    .select("student_id")
    .single();
  if (error) throw error;

  revalidatePath("/students");
  redirect(`/students/${data.student_id}`);
}

export async function updateStudentAction(studentId: string, formData: FormData) {
  const values = readStudentValues(formData);
  if (!values.student_name) throw new Error("生徒名を入力してください。");

  const supabase = await createClient();
  const { error } = await supabase.from("students").update(values).eq("student_id", studentId);
  if (error) throw error;

  revalidatePath("/students");
  revalidatePath(`/students/${studentId}`);
  redirect(`/students/${studentId}`);
}
