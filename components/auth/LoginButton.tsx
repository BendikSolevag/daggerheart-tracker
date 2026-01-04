"use client";

import { createClient } from "@/supabase/client";

function LoginButton() {
  const supabase = createClient();
  async function Login() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "https://www.googleapis.com/auth/userinfo.email,https://www.googleapis.com/auth/userinfo.profile",
        redirectTo: `https://daggerhearttracker.vercel.app/auth/callback`,
      },
    });
  }
  return (
    <button onClick={Login} className="border-2 border-lightblue hover:bg-lightblue px-2 py-1 rounded-lg">
      Register / Sign in
    </button>
  );
}

export default LoginButton;
