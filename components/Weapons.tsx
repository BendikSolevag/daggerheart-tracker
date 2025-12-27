import { Character } from "@/app/types";

export function Weapons({ char }: { char: Character }) {
  const WeaponCard = ({ title, weapon }: { title: string; weapon: Character["weapon_primary_id"] }) => (
    <section className="bg-white p-4 rounded-lg shadow-sm space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="text-xs text-zinc-500">Tier {weapon.tier}</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-zinc-500">Name</label>
          <input className="px-2 py-1 rounded-md border w-full" disabled value={weapon.name} />
        </div>

        <div>
          <label className="text-xs text-zinc-500">Damage</label>
          <input className="px-2 py-1 rounded-md border w-full" disabled value={`${char.proficiency}${weapon.damage}`} />
        </div>

        <div>
          <label className="text-xs text-zinc-500">Trait</label>
          <input className="px-2 py-1 rounded-md border w-full" disabled value={weapon.trait} />
        </div>

        <div>
          <label className="text-xs text-zinc-500">Range</label>
          <input className="px-2 py-1 rounded-md border w-full" disabled value={weapon.range} />
        </div>

        <div>
          <label className="text-xs text-zinc-500">Burden</label>
          <input className="px-2 py-1 rounded-md border w-full" disabled value={weapon.burden} />
        </div>

        <div>
          <label className="text-xs text-zinc-500">Type</label>
          <input className="px-2 py-1 rounded-md border w-full" disabled value={weapon.weapon_type} />
        </div>
      </div>

      {weapon.feature_name && (
        <div className="pt-2">
          <label className="text-xs text-zinc-500">{weapon.feature_name}</label>
          <p className="text-sm text-zinc-700">{weapon.feature_description}</p>
        </div>
      )}
    </section>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <WeaponCard title="Primary Weapon" weapon={char.weapon_primary_id} />
      <WeaponCard title="Secondary Weapon" weapon={char.weapon_secondary_id} />
    </div>
  );
}
