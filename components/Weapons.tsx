/* Weapons Panel */
export function WeaponsPanel({
  char,
  onChangePrimary,
  onChangeSecondary,
  inventoryWeapons,
  onChangeInventoryWeapon,
  addInventoryWeapon,
  removeInventoryWeapon,
}: {
  char: Character;
  onChangePrimary: (w?: Weapon) => void;
  onChangeSecondary: (w?: Weapon) => void;
  inventoryWeapons: Weapon[];
  onChangeInventoryWeapon: (list: Weapon[]) => void;
  addInventoryWeapon: () => void;
  removeInventoryWeapon: (id: string) => void;
}) {
  const updateWeaponListItem = (id: string, patch: Partial<Weapon>) =>
    onChangeInventoryWeapon(inventoryWeapons.map((w) => (w.id === id ? { ...w, ...patch } : w)));

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
      <h2 className="font-semibold">Active Weapons</h2>

      <div className="space-y-2">
        <WeaponEditor label="Primary" weapon={char.primaryWeapon} onChange={onChangePrimary} onRemove={() => onChangePrimary(undefined)} />
        <WeaponEditor label="Secondary" weapon={char.secondaryWeapon} onChange={onChangeSecondary} onRemove={() => onChangeSecondary(undefined)} />
      </div>

      <hr />

      <h3 className="font-medium">Inventory Weapons</h3>
      <div className="space-y-2">
        {inventoryWeapons.map((w) => (
          <div key={w.id} className="flex gap-2 items-start">
            <input className="flex-1 px-2 py-1 border rounded-md" value={w.name} onChange={(e) => updateWeaponListItem(w.id, { name: e.target.value })} />
            <button
              onClick={() => updateWeaponListItem(w.id, { primary: !w.primary })}
              className={`px-2 py-1 rounded-md border text-sm ${w.primary ? "bg-sky-100" : ""}`}
              title="Toggle primary"
            >
              P
            </button>
            <button
              onClick={() => updateWeaponListItem(w.id, { secondary: !w.secondary })}
              className={`px-2 py-1 rounded-md border text-sm ${w.secondary ? "bg-sky-100" : ""}`}
              title="Toggle secondary"
            >
              S
            </button>
            <button onClick={() => removeInventoryWeapon(w.id)} className="px-2 py-1 rounded-md border text-sm">
              ✕
            </button>
          </div>
        ))}

        <div className="flex gap-2">
          <button onClick={addInventoryWeapon} className="px-3 py-1 rounded-md bg-sky-600 text-white">
            + Weapon
          </button>
        </div>
      </div>
    </div>
  );
}

/* Weapon Editor (used for primary/secondary) */
function WeaponEditor({ label, weapon, onChange, onRemove }: { label: string; weapon?: Weapon; onChange: (w?: Weapon) => void; onRemove: () => void }) {
  return (
    <div className="border rounded-md p-2">
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium">{label}</div>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => onChange(weapon ? { ...weapon, primary: !weapon.primary } : { id: "3", name: "New", primary: true })}
            className={`px-2 py-1 rounded-md border text-sm ${weapon?.primary ? "bg-sky-100" : ""}`}
            title="Toggle primary"
          >
            P
          </button>
          <button
            onClick={() => onChange(weapon ? { ...weapon, secondary: !weapon.secondary } : { id: "4", name: "New", secondary: true })}
            className={`px-2 py-1 rounded-md border text-sm ${weapon?.secondary ? "bg-sky-100" : ""}`}
            title="Toggle secondary"
          >
            S
          </button>
          <button onClick={onRemove} className="px-2 py-1 rounded-md border text-sm">
            Clear
          </button>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-1 gap-2">
        <input
          className="px-2 py-1 border rounded-md"
          value={weapon?.name || ""}
          onChange={(e) => onChange({ ...(weapon || { id: "5", name: "" }), name: e.target.value })}
          placeholder="Name"
        />
        <input
          className="px-2 py-1 border rounded-md"
          value={weapon?.traitRange || ""}
          onChange={(e) => onChange({ ...(weapon || { id: "7", name: "" }), traitRange: e.target.value })}
          placeholder="Trait & Range"
        />
        <input
          className="px-2 py-1 border rounded-md"
          value={weapon?.damage || ""}
          onChange={(e) => onChange({ ...(weapon || { id: "6", name: "" }), damage: e.target.value })}
          placeholder="Damage dice & type"
        />
        <input
          className="px-2 py-1 border rounded-md"
          value={weapon?.feature || ""}
          onChange={(e) => onChange({ ...(weapon || { id: "8", name: "" }), feature: e.target.value })}
          placeholder="Feature"
        />
      </div>
    </div>
  );
}
