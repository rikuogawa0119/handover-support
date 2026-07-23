"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { studentSchema, type StudentInput } from "@/lib/validations/student";

function toStudentValues(input: StudentInput) {
  const parsed = studentSchema.parse(input);
  return {
    student_name: parsed.name.trim(),
    grade: parsed.grade.trim() || null,
    school_name: parsed.schoolName.trim() || null,
    note: parsed.note.trim() || null
  };
}

export async function createStudentAction(input: StudentInput) {
  const values = toStudentValues(input);

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

export async function updateStudentAction(studentId: string, input: StudentInput) {
  const values = toStudentValues(input);

  const supabase = await createClient();
  const { error } = await supabase.from("students").update(values).eq("student_id", studentId);
  if (error) throw error;

  revalidatePath("/students");
  revalidatePath(`/students/${studentId}`);
  redirect(`/students/${studentId}`);
}
