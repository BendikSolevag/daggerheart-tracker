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
    <div className="relative overflow-hidden rounded-xl border border-amber-300 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 p-5 shadow-md">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-800">Wealth</h3>

        <div className="flex gap-1">
          <GoldButton onClick={() => adjustGold(-1)}>−</GoldButton>
          <GoldButton onClick={() => adjustGold(1)}>+</GoldButton>
        </div>
      </div>

      {/* Wealth display */}
      <div className="flex items-center justify-center gap-6">
        <WealthItem label="Coins" icon="🪙" value={coins} />
        <WealthItem label="Bags" icon="🎒" value={bags} />
        <WealthItem label="Chests" icon="🧰" value={chests} />
      </div>

      {/* Total */}
      <div className="mt-4 text-center text-xs text-amber-700">
        Total gold <span className="font-semibold text-amber-900">{gold}</span>
      </div>
    </div>
  );
}

function WealthItem({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <div className="flex w-20 flex-col items-center gap-1">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-yellow-400 text-xl shadow-inner">{icon}</div>

      <span className="text-xs font-medium text-amber-700">{label}</span>
      <span className="text-xl font-bold text-amber-900 tabular-nums">{value}</span>
    </div>
  );
}

function GoldButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-md border border-amber-400 bg-white text-lg font-semibold text-amber-800 shadow-sm transition hover:bg-amber-100 active:scale-95"
    >
      {children}
    </button>
  );
}
