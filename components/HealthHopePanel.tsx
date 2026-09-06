import { Character } from "@/app/types";
import { DerivedStats, StatValue } from "@/lib/stats";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { Settings } from "lucide-react";
import { StatBreakdown } from "./StatBreakdown";

export function HealthHopePanel({ char, setChar, stats }: { char: Character; setChar: Dispatch<SetStateAction<Character>>; stats: DerivedStats }) {
  const { thresholdMajor, thresholdSevere, armorScore, maxHp, maxStress } = stats.stats;
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm space-y-5">
      <div className="relative flex items-center justify-between">
        <h2 className="font-semibold text-lg">Condition</h2>

        <button type="button" onClick={() => setSettingsOpen((prev) => !prev)} className="text-zinc-500 hover:text-zinc-800">
          <Settings size={18} />
        </button>

        {settingsOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 rounded-md border bg-white shadow-md z-10">
            <ul className="py-1 text-sm text-zinc-700">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setChar((prev) => {
                      return {
                        ...prev,
                        maxHp: prev.maxHp + 1,
                      };
                    });
                    setSettingsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-zinc-100"
                >
                  Increase max health
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setChar((prev) => {
                      return {
                        ...prev,
                        maxHp: prev.maxHp - 1,
                      };
                    });
                    setSettingsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-zinc-100"
                >
                  Decrease max health
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setChar((prev) => {
                      return {
                        ...prev,
                        maxStress: prev.maxStress + 1,
                      };
                    });
                    setSettingsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-zinc-100"
                >
                  Increase max stress
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setChar((prev) => {
                      return {
                        ...prev,
                        maxStress: prev.maxStress - 1,
                      };
                    });
                    setSettingsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-zinc-100"
                >
                  Decrease max stress
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      <ThresholdDisplay major={thresholdMajor} severe={thresholdSevere} />

      <StatProgress
        label="Health"
        value={char.hp}
        max={maxHp.total}
        color="bg-red-500"
        onChange={(v) => setChar({ ...char, hp: v })}
        breakdown={<StatBreakdown label="Max Health" stat={maxHp} />}
      />
      <StatProgress
        label="Stress"
        value={char.stress}
        max={maxStress.total}
        color="bg-amber-400"
        onChange={(v) => setChar({ ...char, stress: v })}
        breakdown={<StatBreakdown label="Max Stress" stat={maxStress} />}
      />
      <StatProgress label="Hope" value={char.hope} max={char.maxHope} color="bg-cyan-400" onChange={(v) => setChar({ ...char, hope: v })} />
      <StatProgress
        label="Armor"
        value={char.armor}
        max={armorScore.total}
        color="bg-fuchsia-500"
        onChange={(v) => setChar({ ...char, armor: v })}
        breakdown={<StatBreakdown label="Armor Score" stat={armorScore} />}
      />

      {stats.notes.length > 0 && (
        <ul className="space-y-1 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          {stats.notes.map((note, i) => (
            <li key={i}>{note}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

type StatProgressProps = {
  label: string;
  value: number;
  max: number;
  color: string;
  onChange: (v: number) => void;
  breakdown?: ReactNode;
};

export function StatProgress({ label, value, max, color, onChange, breakdown }: StatProgressProps) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-zinc-500">
        <span className="flex items-center gap-1">
          {label}
          {breakdown}
        </span>
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

function ThresholdDisplay({ major, severe }: { major: StatValue; severe: StatValue }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-zinc-100/60 px-4 py-2 text-sm">
      <span className="text-zinc-500 font-medium">Thresholds</span>
      <div className="flex items-center gap-6">
        <span className="text-zinc-500 text-xs">Minor</span>
        <span className="flex items-center gap-1 font-semibold text-zinc-900">
          {major.total}
          <StatBreakdown label="Major Threshold" stat={major} baseLabel="Armor base" />
        </span>
        <span className="text-zinc-500 text-xs">Major</span>
        <span className="flex items-center gap-1 font-semibold text-zinc-900">
          {severe.total}
          <StatBreakdown label="Severe Threshold" stat={severe} baseLabel="Armor base" />
        </span>
        <span className="text-zinc-500 text-xs">Severe</span>
      </div>
    </div>
  );
}
