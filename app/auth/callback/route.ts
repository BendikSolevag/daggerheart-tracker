import { NextResponse } from "next/server";
import { createClient } from "@/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  // 1. clean "next" param
  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) next = "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 2. FORCE the redirect base
      // If the env var is missing, this will throw an error rather than
      // silently redirecting to localhost. This is good for debugging.
      const baseUrl = process.env.NEXT_PUBLIC_URL;

      if (!baseUrl) {
        console.error("Missing NEXT_PUBLIC_SITE_URL env variable!");
        // Fallback ONLY for actual local development
        if (process.env.NODE_ENV === "development") {
          return NextResponse.redirect(new URL(next, request.url));
        }
        // In production, don't fallback to request.url (localhost),
        // it's better to fail than redirect to localhost.
        return NextResponse.redirect(new URL("/auth/auth-code-error", request.url));
      }

      // 3. Construct the absolute URL manually
      // We do not use `origin` here. We use the trusted Env Variable.
      const redirectUrl = new URL(next, baseUrl);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Error case
  const errorBase = process.env.NEXT_PUBLIC_SITE_URL || request.url;
  return NextResponse.redirect(new URL("/auth/auth-code-error", errorBase));
}
