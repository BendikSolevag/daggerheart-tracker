import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    const r = await supabase.from("profiles").update({
      name: data.user?.user_metadata.full_name,
      email: data.user?.email,
    }).eq("id", data?.user?.id).select();

    if (!error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_URL as string}${next}`,
      );
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
