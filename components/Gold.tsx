import { Character } from "@/app/types";
import { Dispatch, SetStateAction } from "react";

export function GoldCounter({ char, setChar }: { char: Character; setChar: Dispatch<SetStateAction<Character>> }) {
  const gold = Math.max(0, char.gold);

  const chests = Math.floor(gold / 100);
  const bags = Math.floor((gold % 100) / 10);
  const coins = gold % 10;

  const adjustGold = (delta: number) => {
    setChar({ ...char, gold: Math.max(0, gold + delta) });
  };

  return (
    <div className="bg-amber-50 border border-amber-300 rounded-lg px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Wealth display */}
        <div className="flex items-center gap-4">
          <WealthItem label="Coins" icon="🪙" value={coins} />
          <WealthItem label="Bags" icon="🎒" value={bags} />
          <WealthItem label="Chests" icon="🧰" value={chests} />
        </div>

        {/* Controls */}
        <div className="flex gap-1">
          <button onClick={() => adjustGold(-1)} className="h-8 w-8 rounded-md border border-amber-300 bg-white text-amber-800 font-semibold active:scale-95">
            −
          </button>
          <button onClick={() => adjustGold(1)} className="h-8 w-8 rounded-md border border-amber-300 bg-white text-amber-800 font-semibold active:scale-95">
            +
          </button>
        </div>
      </div>

      {/* Optional total */}
      <div className="mt-2 text-xs text-amber-700 text-right">
        Total gold: <span className="font-medium">{gold}</span>
      </div>
    </div>
  );
}

function WealthItem({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-amber-900">{icon}</div>
      <div className="flex flex-col leading-tight">
        <span className="text-xs font-medium text-amber-700">{label}</span>
        <span className="text-lg font-semibold text-amber-900">{value}</span>
      </div>
    </div>
  );
}
