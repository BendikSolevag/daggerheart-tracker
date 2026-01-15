import { NextResponse } from "next/server";
import { createClient } from "@/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  console.log("searchParams", searchParams);
  const code = searchParams.get("code");
  console.log("code", code);

  const redirect_url = process.env.NEXT_PUBLIC_URL;

  console.log("redirectUrl", searchParams);
  if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    console.error(error);

    if (error) {
      const redirectUrl = new URL(`${redirect_url}/${JSON.stringify(error)}`);
      console.error("in error", redirectUrl);
      return NextResponse.redirect(redirectUrl);
    }

    const redirectUrl = new URL(`${redirect_url}`);
    console.log("in no error", redirectUrl);
    return NextResponse.redirect(redirectUrl);
  }

  // Error case
  return NextResponse.redirect(new URL(`${redirect_url}/error`));
}
