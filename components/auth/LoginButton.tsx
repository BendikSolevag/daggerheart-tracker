"use client";

import { createClient } from "@/supabase/client";
import { useState } from "react";

function LoginButton() {
  const supabase = createClient();

  const [email, setEmail] = useState("");

  async function signInWithEmail() {
    console.log("hamana hamana", email);
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        // set this to false if you do not want the user to be automatically signed up
        shouldCreateUser: true,
        emailRedirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/confirm`,
      },
    });
    console.log(data, error);
  }
  return (
    <>
      <input className="border-2 border-lightblue px-2 py-1" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button
        onClick={() => {
          signInWithEmail();
        }}
        className="block border-2 border-lightblue hover:bg-lightblue px-2 py-1 rounded-lg"
      >
        Sign in
      </button>
    </>
  );
}

export default LoginButton;
