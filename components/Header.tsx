import { Character } from "@/app/types";
import { Dispatch, SetStateAction } from "react";

export function Header({ char, setChar }: { char: Character; setChar: Dispatch<SetStateAction<Character>> }) {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 bg-linear-to-br from-violet-600 to-sky-500 rounded-md flex items-center justify-center text-white font-bold">B</div>
        <div>
          <input aria-label="Character name" className="text-xl font-semibold " defaultValue={char.name} disabled />
        </div>
      </div>

      <div className="grid grid-cols-1 w-full">
        <div className="grid grid-cols-1">
          <label className="text-xs text-zinc-500 w-full">Heritage</label>
          <input className="px-2 py-1 rounded-md border w-full" defaultValue={`${char.community_id.name} ${char.ancestry_id.name}`} disabled />
        </div>

        <div className="grid grid-cols-5 space-x-2">
          <div className="col-span-4 grid grid-cols-1">
            <label className="text-xs text-zinc-500">Subclass</label>
            <input className="px-2 py-1 rounded-md border" disabled defaultValue={char.subclass_id.name} />
          </div>

          <div className="col-span-1 grid grid-cols-1">
            <label className="text-xs text-zinc-500">Level</label>
            <input
              id="characterLevel"
              className="px-2 py-1 rounded-md border"
              type="number"
              value={char.level}
              min={1}
              onChange={(e) =>
                setChar({
                  ...char,
                  level: Number.parseInt(e.target.value),
                })
              }
            />
          </div>
        </div>
      </div>
    </header>
  );
}
