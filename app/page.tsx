import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">welcome, </div>;
}
