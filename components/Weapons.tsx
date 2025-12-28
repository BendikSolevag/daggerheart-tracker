import { Character, InventoryWeapons } from "@/app/types";
import { Dispatch, SetStateAction } from "react";

export function Weapons({
  char,
  setInvWeapons,
  setChar,
}: {
  char: Character;
  setInvWeapons: Dispatch<SetStateAction<InventoryWeapons>>;
  setChar: Dispatch<SetStateAction<Character>>;
}) {
  const WeaponCard = ({ title, weapon, slot }: { title: string; weapon: Character["weapon_primary_id"]; slot: "primary" | "secondary" }) => {
    if (!weapon) return null;

    return (
      <section className="bg-white p-4 rounded-lg shadow-sm space-y-2 relative">
        {/* Remove button */}
        <button
          type="button"
          aria-label="Remove weapon"
          className="absolute top-2 right-2 text-zinc-400 hover:text-red-500"
          onClick={() => {
            // add weapon to inventory
            setInvWeapons((prev) => [...prev, weapon]);

            // remove from character
            setChar((prev) => ({
              ...prev,
              ...(slot === "primary" ? { weapon_primary_id: null } : { weapon_secondary_id: null }),
            }));
          }}
        >
          ✕
        </button>

        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold">{title}</h3>
          <span className="text-xs text-zinc-500">Tier {weapon.weapon_id.tier}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-zinc-500">Name</label>
            <input className="px-2 py-1 rounded-md border w-full" disabled value={weapon.weapon_id.name} />
          </div>

          <div>
            <label className="text-xs text-zinc-500">Damage</label>
            <input className="px-2 py-1 rounded-md border w-full" disabled value={`${char.proficiency}${weapon.weapon_id.damage}`} />
          </div>

          <div>
            <label className="text-xs text-zinc-500">Trait</label>
            <input className="px-2 py-1 rounded-md border w-full" disabled value={weapon.weapon_id.trait} />
          </div>

          <div>
            <label className="text-xs text-zinc-500">Range</label>
            <input className="px-2 py-1 rounded-md border w-full" disabled value={weapon.weapon_id.range} />
          </div>

          <div>
            <label className="text-xs text-zinc-500">Burden</label>
            <input className="px-2 py-1 rounded-md border w-full" disabled value={weapon.weapon_id.burden} />
          </div>

          <div>
            <label className="text-xs text-zinc-500">Type</label>
            <input className="px-2 py-1 rounded-md border w-full" disabled value={weapon.weapon_id.weapon_type} />
          </div>
        </div>

        {weapon.weapon_id.feature_name && (
          <div className="pt-2">
            <label className="text-xs text-zinc-500">{weapon.weapon_id.feature_name}</label>
            <p className="text-sm text-zinc-700 whitespace-pre-line">{weapon.weapon_id.feature_description}</p>
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <WeaponCard title="Primary Weapon" weapon={char.weapon_primary_id} slot="primary" />
      <WeaponCard title="Secondary Weapon" weapon={char.weapon_secondary_id} slot="secondary" />
    </div>
  );
}
