import { createClient } from "@/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      {process.env.NEXT_PUBLIC_URL}
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">welcome, {user?.email}</div>;
    </>
  );
}
