import { Character } from "@/app/types";

export function Armor({ char }: { char: Character }) {
  const armor = char.armor_id;

  return (
    <section className="bg-white p-4 rounded-lg shadow-sm space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold">Armor</h3>
        <span className="text-xs text-zinc-500">Tier {armor.tier}</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-zinc-500">Name</label>
          <input className="px-2 py-1 rounded-md border w-full" disabled value={armor.name} />
        </div>

        <div>
          <label className="text-xs text-zinc-500">Base Score</label>
          <input className="px-2 py-1 rounded-md border w-full" disabled value={armor.base_score} />
        </div>

        <div>
          <label className="text-xs text-zinc-500">Threshold (Low)</label>
          <input className="px-2 py-1 rounded-md border w-full" disabled value={armor.base_threshold_low} />
        </div>

        <div>
          <label className="text-xs text-zinc-500">Threshold (High)</label>
          <input className="px-2 py-1 rounded-md border w-full" disabled value={armor.base_threshold_high} />
        </div>
      </div>

      {armor.feature_name && (
        <div className="pt-2">
          <label className="text-xs text-zinc-500">{armor.feature_name}</label>
          <p className="text-sm text-zinc-700">{armor.feature_description}</p>
        </div>
      )}
    </section>
  );
}
