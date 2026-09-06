import { Character } from "@/app/types";
import { DerivedStats, traitValueFor } from "@/lib/stats";
import { Dispatch, SetStateAction } from "react";

function signed(n: number) {
  return n >= 0 ? `+${n}` : `−${Math.abs(n)}`;
}

export function Weapons({ char, setChar, stats }: { char: Character; setChar: Dispatch<SetStateAction<Character>>; stats: DerivedStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <WeaponCard title="Primary Weapon" weapon={char.weapon_primary_id} proficiency={char.proficiency} stats={stats} onRemove={() => setChar((prev) => ({ ...prev, weapon_primary_id: null }))} />
      <WeaponCard
        title="Secondary Weapon"
        weapon={char.weapon_secondary_id}
        proficiency={char.proficiency}
        stats={stats}
        onRemove={() => setChar((prev) => ({ ...prev, weapon_secondary_id: null }))}
      />
    </div>
  );
}

function WeaponCard({
  title,
  weapon,
  proficiency,
  stats,
  onRemove,
}: {
  title: string;
  weapon: Character["weapon_primary_id"];
  proficiency: number;
  stats: DerivedStats;
  onRemove: () => void;
}) {
  if (!weapon) return null;

  const w = weapon.weapon_id;
  // Effective value of the trait this weapon rolls with (after armor/weapon penalties).
  const traitValue = traitValueFor(stats, w.trait);

  return (
    <section className="bg-white p-4 rounded-lg shadow-sm space-y-2 relative">
      {/* Remove button */}
      <button type="button" aria-label="Remove weapon" className="absolute top-2 right-2 text-zinc-400 hover:text-red-500" onClick={onRemove}>
        ✕
      </button>

      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="text-xs text-zinc-500">Tier {w.tier}</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-zinc-500">Name</label>
          <input className="px-2 py-1 rounded-md border w-full" disabled value={w.name} />
        </div>

        <div>
          <label className="text-xs text-zinc-500">Damage</label>
          <input className="px-2 py-1 rounded-md border w-full" disabled value={`${proficiency}${w.damage}`} />
        </div>

        <div>
          <label className="text-xs text-zinc-500">Trait</label>
          <input className="px-2 py-1 rounded-md border w-full" disabled value={traitValue === null ? w.trait : `${w.trait} (${signed(traitValue)})`} />
        </div>

        <div>
          <label className="text-xs text-zinc-500">Range</label>
          <input className="px-2 py-1 rounded-md border w-full" disabled value={w.range} />
        </div>

        <div>
          <label className="text-xs text-zinc-500">Burden</label>
          <input className="px-2 py-1 rounded-md border w-full" disabled value={w.burden} />
        </div>

        <div>
          <label className="text-xs text-zinc-500">Type</label>
          <input className="px-2 py-1 rounded-md border w-full" disabled value={w.weapon_type} />
        </div>
      </div>

      {w.feature_name && (
        <div className="pt-2">
          <label className="text-xs text-zinc-500">{w.feature_name}</label>
          <p className="text-sm text-zinc-700 whitespace-pre-line">{w.feature_description}</p>
        </div>
      )}
    </section>
  );
}
