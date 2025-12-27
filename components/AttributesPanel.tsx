import { Character } from "@/app/types";
import { Dispatch, SetStateAction } from "react";

/* Attributes Panel */
export function AttributesPanel({ char, setChar }: { char: Character; setChar: Dispatch<SetStateAction<Character>> }) {
  return (
    <div className="col-span-2 bg-white p-4 rounded-lg shadow-sm">
      <h2 className="font-semibold mb-2">Attributes</h2>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        <div className="flex flex-col items-start">
          <label className="text-xs text-zinc-500">Finesse</label>
          <input
            className="w-full px-2 py-1 rounded-md border"
            type="number"
            value={char.finesse}
            onChange={(e) => setChar({ ...char, finesse: Number.parseInt(e.target.value) })}
          />
        </div>
        <div className="flex flex-col items-start">
          <label className="text-xs text-zinc-500">Finesse</label>
          <input
            className="w-full px-2 py-1 rounded-md border"
            type="number"
            value={char.finesse}
            onChange={(e) => setChar({ ...char, finesse: Number.parseInt(e.target.value) })}
          />
        </div>
        <div className="flex flex-col items-start">
          <label className="text-xs text-zinc-500">Finesse</label>
          <input
            className="w-full px-2 py-1 rounded-md border"
            type="number"
            value={char.finesse}
            onChange={(e) => setChar({ ...char, finesse: Number.parseInt(e.target.value) })}
          />
        </div>
        <div className="flex flex-col items-start">
          <label className="text-xs text-zinc-500">Finesse</label>
          <input
            className="w-full px-2 py-1 rounded-md border"
            type="number"
            value={char.finesse}
            onChange={(e) => setChar({ ...char, finesse: Number.parseInt(e.target.value) })}
          />
        </div>
        <div className="flex flex-col items-start">
          <label className="text-xs text-zinc-500">Finesse</label>
          <input
            className="w-full px-2 py-1 rounded-md border"
            type="number"
            value={char.finesse}
            onChange={(e) => setChar({ ...char, finesse: Number.parseInt(e.target.value) })}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col w-32">
        <label className="text-xs text-zinc-500">Evasion</label>
        <input
          className="px-2 py-1 rounded-md border"
          type="number"
          value={char.finesse}
          onChange={(e) => setChar({ ...char, finesse: Number.parseInt(e.target.value) })}
        />
      </div>
    </div>
  );
}
