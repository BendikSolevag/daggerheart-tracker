import { Lexend } from "next/font/google";
import LoginButton from "@/components/auth/LoginButton";

const lexend = Lexend({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default async function Home() {
  return (
    <main className={`min-h-screen flex ${lexend.className} font-bold`}>
      <aside className="bg-lightblue w-0 md:w-1/2 flex justify-center items-center">
        <div>
          <div className={`text-[40px] text-center`}>
            Welcome back,
            <br />
            book lover!
          </div>
        </div>
      </aside>
      <section className="bg-green-100 w-full md:w-1/2 flex flex-col items-center justify-center">
        <div className="text-[20px] mt-2 mb-4 text-center">
          Dive back into your literary adventure
          <br />
          or start a new chapter by joining our community.
        </div>

        <LoginButton />
      </section>
    </main>
  );
}
