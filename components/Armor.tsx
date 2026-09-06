import { Character } from "@/app/types";
import { DerivedStats } from "@/lib/stats";
import { StatBreakdown } from "./StatBreakdown";

export function Armor({ char, stats }: { char: Character; stats: DerivedStats }) {
  const armor = char.equipped_armor_id?.armors;

  if (!armor) {
    return <></>;
  }

  const { armorScore, thresholdMajor, thresholdSevere } = stats.stats;

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

        <DerivedField label="Armor Score" stat={armorScore} />
        <DerivedField label="Major Threshold" stat={thresholdMajor} baseLabel="Armor base" />
        <DerivedField label="Severe Threshold" stat={thresholdSevere} baseLabel="Armor base" />
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

/** Read-only field showing the effective value, with the raw armor value as a caption when they differ. */
function DerivedField({ label, stat, baseLabel }: { label: string; stat: DerivedStats["stats"]["armorScore"]; baseLabel?: string }) {
  const modified = stat.modifiers.length > 0;

  return (
    <div>
      <div className="flex items-center gap-1">
        <label className="text-xs text-zinc-500">{label}</label>
        <StatBreakdown label={label} stat={stat} baseLabel={baseLabel} />
      </div>
      <input className="px-2 py-1 rounded-md border w-full" disabled value={stat.total} />
      {modified && <div className="mt-0.5 text-[10px] text-zinc-400">base {stat.base}</div>}
    </div>
  );
}
