import { Character } from "@/app/types";
import { Dispatch, SetStateAction } from "react";

const CORE_STATS = [
  { key: "agility", label: "AGI" },
  { key: "strength", label: "STR" },
  { key: "finesse", label: "FIN" },
  { key: "instinct", label: "INS" },
  { key: "presence", label: "PRE" },
  { key: "knowledge", label: "KNO" },
] as const;

type StatKey = (typeof CORE_STATS)[number]["key"];

export function AttributesPanel({ char, setChar }: { char: Character; setChar: Dispatch<SetStateAction<Character>> }) {
  return (
    <section className="col-span-2 bg-white p-4 rounded-lg shadow-sm">
      <h2 className="font-semibold mb-3">Attributes</h2>

      {/* Core attributes */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {CORE_STATS.map(({ key, label }) => (
          <div key={key} className="flex flex-col items-center justify-between rounded-md border bg-zinc-50 px-2 py-2">
            <span className="text-[10px] font-medium tracking-wide text-zinc-500">{label}</span>
            <input
              type="number"
              value={char[key]}
              onChange={(e) => setChar({ ...char, [key]: Number.parseInt(e.target.value) })}
              className="w-full text-center text-lg font-semibold bg-transparent focus:outline-none"
            />
          </div>
        ))}
      </div>

      {/* Evasion – visually distinct */}
      <div className="mt-4 flex justify-center">
        <div className="flex items-center gap-3 rounded-lg border border-sky-300 bg-sky-50 px-4 py-3 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-white font-bold">🛡</div>
          <div className="flex flex-col">
            <span className="text-xs font-medium uppercase tracking-wide text-sky-700">Evasion</span>
            <input
              type="number"
              value={char.evasion}
              onChange={(e) => setChar({ ...char, evasion: Number.parseInt(e.target.value) })}
              className="w-16 bg-transparent text-lg font-semibold text-sky-900 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
