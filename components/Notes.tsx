import { Character, Inventory } from "@/app/types";
import { Dispatch, SetStateAction } from "react";

export function Notes({ char, setChar }: { char: Character; setChar: Dispatch<SetStateAction<Character>> }) {
  return (
    <section className="bg-white p-4 rounded-lg shadow-sm space-y-3">
      <h2 className="text-sm font-semibold text-zinc-700">This is your notepad. Write whatever you want.</h2>

      <textarea
        rows={1}
        className="
                flex-1 resize-none w-full min-h-[40vh]
                rounded-md border border-zinc-200
                px-2 py-1 text-sm
                focus:outline-none focus:ring-2 focus:ring-violet-500
                wrap-break-word
              "
        placeholder=""
        value={char.notes}
        onChange={(e) => {
          // auto-grow
          e.currentTarget.style.height = "auto";
          e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;

          setChar((prev) => {
            return {
              ...prev,
              notes: e.target.value,
            };
          });
        }}
      />
    </section>
  );
}
