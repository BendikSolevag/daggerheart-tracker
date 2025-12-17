/* Attributes Panel */
export function AttributesPanel({
  char,
  onChangeAttribute,
  onChangeEvasion,
  onChangeArmorRating,
}: {
  char: Character;
  onChangeAttribute: (attr: keyof Character["attributes"], value: number) => void;
  onChangeEvasion: (v: number) => void;
  onChangeArmorRating: (v: number) => void;
}) {
  const entries: Array<[keyof Character["attributes"], string]> = [
    ["agility", "Agility"],
    ["strength", "Strength"],
    ["finesse", "Finesse"],
    ["instinct", "Instinct"],
    ["presence", "Presence"],
    ["knowledge", "Knowledge"],
  ];

  return (
    <div className="col-span-2 bg-white p-4 rounded-lg shadow-sm">
      <h2 className="font-semibold mb-2">Attributes</h2>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {entries.map(([key, label]) => (
          <div key={key} className="flex flex-col items-start">
            <label className="text-xs text-zinc-500">{label}</label>
            <input
              className="w-full px-2 py-1 rounded-md border"
              type="number"
              value={char.attributes[key]}
              onChange={(e) => onChangeAttribute(key, Number(e.target.value || 0))}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col w-32">
        <label className="text-xs text-zinc-500">Evasion</label>
        <input className="px-2 py-1 rounded-md border" type="number" value={char.evasion} onChange={(e) => onChangeEvasion(Number(e.target.value || 0))} />
      </div>
    </div>
  );
}
