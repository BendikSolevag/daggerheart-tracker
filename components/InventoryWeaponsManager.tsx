import { Character, InventoryWeapons } from "@/app/types";
import { Dispatch, SetStateAction } from "react";

export function InventoryWeaponsManager({
  invWeapons,
  setInvWeapons,
  char,
  setChar,
}: {
  invWeapons: InventoryWeapons;
  setInvWeapons: Dispatch<SetStateAction<InventoryWeapons>>;
  char: Character;
  setChar: Dispatch<SetStateAction<Character>>;
}) {
  return (
    <section className="bg-white p-4 rounded-lg shadow-sm space-y-3">
      <h2 className="text-sm font-semibold text-zinc-700">Weapons</h2>

      <ul className="space-y-2">
        {invWeapons
          .filter((entry) => entry.id != char.weapon_primary_id?.id && entry.id != char.weapon_secondary_id?.id)
          .map((entry, i) => {
            const w = entry.weapon_id;

            return (
              <li key={i} className="flex items-start gap-2 rounded-md border border-zinc-200 p-2">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-800">{w.name}</span>
                    <span className="text-xs text-zinc-500">Tier {w.tier}</span>
                  </div>

                  <div className="text-xs text-zinc-600 flex flex-wrap gap-x-3 gap-y-1">
                    <span>{w.weapon_type}</span>
                    <span>{w.trait}</span>
                    <span>{w.range}</span>
                    <span>{w.burden}</span>
                    <span className="font-mono">{w.damage}</span>
                  </div>

                  {w.feature_name && w.feature_description && (
                    <div className="text-xs text-zinc-600">
                      <span className="font-semibold">{w.feature_name}:</span> {w.feature_description}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1 pt-0.5">
                  <button
                    type="button"
                    className="text-xs text-violet-600 hover:text-violet-800"
                    onClick={() => {
                      if (entry.weapon_id.weapon_type == "Primary") {
                        setChar({ ...char, weapon_primary_id: entry });
                      }
                      if (entry.weapon_id.weapon_type == "Secondary") {
                        setChar({ ...char, weapon_secondary_id: entry });
                      }
                    }}
                  >
                    Equip
                  </button>

                  <button
                    type="button"
                    aria-label="Discard weapon"
                    className="text-xs text-red-600 hover:text-red-800"
                    onClick={() => setInvWeapons((prev) => prev.filter((it) => it.id !== entry.id))}
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
