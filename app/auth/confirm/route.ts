import { NextResponse } from "next/server";
import { createClient } from "@/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const redirect_url = process.env.NEXT_PUBLIC_URL;

  console.log("searchParams", searchParams);
  const token_hash = searchParams.get("token_hash") ?? "";
  if (!token_hash) {
    console.log("no token hash");
    // Error case
    return NextResponse.redirect(new URL(`${redirect_url}/error`));
  }

  console.log("token_hash", token_hash);
  const supabase = await createClient();

  console.log("supabase", supabase);

  const { error } = await supabase.auth.verifyOtp({
    token_hash: token_hash,
    type: "email",
  });

  console.log("error", error);

  if (error) {
    console.error(error);
    return NextResponse.redirect(new URL(`${redirect_url}/error`));
  }

  return NextResponse.redirect(new URL(`${redirect_url}`));
}
