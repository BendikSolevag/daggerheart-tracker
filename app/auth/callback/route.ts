import { NextResponse } from "next/server";
import { createClient } from "@/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      const redirectUrl = new URL(`https://daggerhearttracker.vercel.app/${JSON.stringify(error)}`);
      return NextResponse.redirect(redirectUrl);
    }

    const redirectUrl = new URL("https://daggerhearttracker.vercel.app/");
    return NextResponse.redirect(redirectUrl);
  }

  // Error case
  return NextResponse.redirect(new URL("https://daggerhearttracker.vercel.app/error"));
}
