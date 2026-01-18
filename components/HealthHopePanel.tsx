import { Character } from "@/app/types";
import { Dispatch, SetStateAction } from "react";

export function HealthHopePanel({ char, setChar }: { char: Character; setChar: Dispatch<SetStateAction<Character>> }) {
  const threshold_low = char.level + (char.equipped_armor_id?.armors.base_threshold_low ?? 0);

  const threshold_high = char.level + (char.equipped_armor_id?.armors.base_threshold_high ?? 0);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm space-y-5">
      <h2 className="font-semibold text-lg">Condition</h2>
      <ThresholdDisplay low={threshold_low} high={threshold_high} />
      <StatProgress label="Health" value={char.hp} max={char.maxHp} color="bg-red-500" onChange={(v) => setChar({ ...char, hp: v })} />
      <StatProgress label="Stress" value={char.stress} max={char.maxStress} color="bg-amber-400" onChange={(v) => setChar({ ...char, stress: v })} />
      <StatProgress label="Hope" value={char.hope} max={char.maxHope} color="bg-cyan-400" onChange={(v) => setChar({ ...char, hope: v })} />
      <StatProgress
        label="Armor"
        value={char.armor}
        max={char.equipped_armor_id?.armors.base_score || 0}
        color="bg-fuchsia-500"
        onChange={(v) => setChar({ ...char, armor: v })}
      />
    </div>
  );
}

type StatProgressProps = {
  label: string;
  value: number;
  max: number;
  color: string;
  onChange: (v: number) => void;
};

export function StatProgress({ label, value, max, color, onChange }: StatProgressProps) {
  const percent = Math.round((value / max) * 100);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-zinc-500">
        <span>{label}</span>
        <span>
          {value}/{max}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Decrease */}
        <button onClick={() => onChange(Math.max(0, value - 1))} className="w-10 h-10 rounded-full bg-zinc-100 active:scale-95 text-xl font-semibold">
          –
        </button>

        {/* Progress */}
        <div className="flex-1 h-3 rounded-full bg-zinc-200 overflow-hidden">
          <div className={`h-full ${color} transition-all`} style={{ width: `${percent}%` }} />
        </div>

        {/* Increase */}
        <button onClick={() => onChange(Math.min(max, value + 1))} className="w-10 h-10 rounded-full bg-zinc-100 active:scale-95 text-xl font-semibold">
          +
        </button>
      </div>
    </div>
  );
}

function ThresholdDisplay({ low, high }: { low: number; high: number }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-zinc-100/60 px-4 py-2 text-sm">
      <span className="text-zinc-500 font-medium">Thresholds</span>
      <div className="flex items-center gap-6">
        <span className="text-zinc-500 text-xs">Minor</span>
        <span className="font-semibold text-zinc-900">{low}</span>
        <span className="text-zinc-500 text-xs">Major</span>
        <span className="font-semibold text-zinc-900">{high}</span>
        <span className="text-zinc-500 text-xs">Severe</span>
      </div>
    </div>
  );
}
