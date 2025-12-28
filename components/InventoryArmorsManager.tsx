import { Character, InventoryArmors } from "@/app/types";
import { Dispatch, SetStateAction } from "react";

export function InventoryArmorsManager({
  invArmors,
  setInvArmors,
  char,
  setChar,
}: {
  invArmors: InventoryArmors;
  setInvArmors: Dispatch<SetStateAction<InventoryArmors>>;
  char: Character;
  setChar: Dispatch<SetStateAction<Character>>;
}) {
  return (
    <section className="bg-white p-4 rounded-lg shadow-sm space-y-3">
      <h2 className="text-sm font-semibold text-zinc-700">Armor</h2>

      <ul className="space-y-2">
        {invArmors
          .filter((entry) => entry.id !== char.equipped_armor_id?.id)
          .map((entry, i) => {
            const a = entry.armors;

            return (
              <li key={i} className="flex items-start gap-2 rounded-md border border-zinc-200 p-2">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-800">{a.name}</span>
                    <span className="text-xs text-zinc-500">Tier {a.tier}</span>
                  </div>

                  <div className="text-xs text-zinc-600 flex flex-wrap gap-x-3 gap-y-1">
                    <span>Score {a.base_score}</span>
                    <span>
                      Thresholds {a.base_threshold_low}–{a.base_threshold_high}
                    </span>
                  </div>

                  {a.feature_name && a.feature_description && (
                    <div className="text-xs text-zinc-600">
                      <span className="font-semibold">{a.feature_name}:</span> {a.feature_description}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1 pt-0.5">
                  <button
                    type="button"
                    className="text-xs text-violet-600 hover:text-violet-800"
                    onClick={() => {
                      setChar({ ...char, equipped_armor_id: entry });
                    }}
                  >
                    Equip
                  </button>

                  <button
                    type="button"
                    aria-label="Discard armor"
                    className="text-xs text-red-600 hover:text-red-800"
                    onClick={() => setInvArmors((prev) => prev.filter((it) => it.id !== entry.id))}
                  >
                    Discard
                  </button>
                </div>
              </li>
            );
          })}
      </ul>
    </section>
  );
}
