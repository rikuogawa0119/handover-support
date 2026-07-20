import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);

    // Ensure a matching teachers row exists so lesson/handover records can reference this user.
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("teachers").upsert(
        {
          teacher_id: user.id,
          teacher_name: user.email ?? "先生",
          email: user.email ?? ""
        },
        { onConflict: "teacher_id" }
      );
    }
  }

  return NextResponse.redirect(new URL("/", request.url));
}
