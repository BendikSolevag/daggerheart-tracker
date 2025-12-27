"use client";

import React, { useState } from "react";
import { AttributesPanel } from "@/components/AttributesPanel";
import { Header } from "@/components/Header";
import { HealthHopePanel } from "@/components/HealthHopePanel";
import { WeaponsPanel } from "@/components/Weapons";

/* ----------------------------- Types & Defaults ---------------------------- */

const DEFAULT: Character = {
  name: "Navn Navnesen",
  pronouns: "They/Them",
  heritage: "Heritage",
  subclass: "Subclass",
  level: 1,
  attributes: {
    agility: 10,
    strength: 10,
    finesse: 10,
    instinct: 10,
    presence: 10,
    knowledge: 10,
  },
  evasion: 10,
  armorRating: 0,
  armor: 0,
  maxArmor: 4,
  hp: 10,
  maxHp: 10,
  stress: 0,
  maxStress: 10,
  hope: 3,
  maxHope: 6,
  experienceNotes: "",
  goldHandfuls: 0,
  goldBags: 0,
  primaryWeapon: undefined,
  secondaryWeapon: undefined,
  inventoryWeapons: [],
  activeArmor: undefined,
  inventory: [],
  classFeatureNotes: "Rally — once per session, ...",
};

/* --------------------------------- Home ---------------------------------- */

export default function Home() {
  // Keep state locally — storage removed per your request.
  const [char, setChar] = useState<Character>(DEFAULT);

  const update = <K extends keyof Character>(key: K, value: Character[K]) => setChar((c) => ({ ...c, [key]: value }));

  const updateAttribute = (attr: keyof Character["attributes"], value: number) => setChar((c) => ({ ...c, attributes: { ...c.attributes, [attr]: value } }));

  const addInventoryItem = (text = "") => setChar((c) => ({ ...c, inventory: [...c.inventory, text] }));

  const addInventoryWeapon = () => {
    const w: Weapon = { id: "3", name: "New Weapon" };
    setChar((c) => ({ ...c, inventoryWeapons: [...c.inventoryWeapons, w] }));
  };

  const removeInventoryWeapon = (id: string) => setChar((c) => ({ ...c, inventoryWeapons: c.inventoryWeapons.filter((w) => w.id !== id) }));

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">
      <main className="w-full max-w-3xl space-y-4">
        <Header
          char={char}
          onChangeName={(v) => update("name", v)}
          onChangePronouns={(v) => update("pronouns", v)}
          onChangeHeritage={(v) => update("heritage", v)}
          onChangeSubclass={(v) => update("subclass", v)}
          onChangeLevel={(v) => update("level", Math.max(1, v))}
        />

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 md:gap-x-4">
          <AttributesPanel
            char={char}
            onChangeAttribute={updateAttribute}
            onChangeEvasion={(v) => update("evasion", v)}
            onChangeArmorRating={(v) => update("armorRating", v)}
          />
          <HealthHopePanel
            char={char}
            setChar={setChar}
            onChangeHp={(v) => update("hp", v)}
            onChangeStress={(v) => update("stress", v)}
            onChangeHope={(v) => update("hope", v)}
          />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-x-4">
          <WeaponsPanel
            char={char}
            onChangePrimary={(w) => update("primaryWeapon", w)}
            onChangeSecondary={(w) => update("secondaryWeapon", w)}
            inventoryWeapons={char.inventoryWeapons}
            onChangeInventoryWeapon={(list) => update("inventoryWeapons", list)}
            addInventoryWeapon={addInventoryWeapon}
            removeInventoryWeapon={removeInventoryWeapon}
          />

          <ArmorInventoryPanel
            char={char}
            onChangeArmor={(a) => update("activeArmor", a)}
            inventory={char.inventory}
            onChangeInventory={(list) => update("inventory", list)}
            addInventoryItem={addInventoryItem}
          />
        </section>

        <Footer />
      </main>
    </div>
  );
}

/* Armor + Inventory Panel */
function ArmorInventoryPanel({
  char,
  onChangeArmor,
  inventory,
  onChangeInventory,
  addInventoryItem,
}: {
  char: Character;
  onChangeArmor: (a?: Armor) => void;
  inventory: string[];
  onChangeInventory: (list: string[]) => void;
  addInventoryItem: (text?: string) => void;
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
      <h2 className="font-semibold">Active Armor</h2>
      <div>
        <input
          className="w-full px-2 py-1 border rounded-md"
          value={char.activeArmor?.name || ""}
          onChange={(e) =>
            onChangeArmor({
              id: char.activeArmor?.id || "3",
              name: e.target.value,
              baseThresholds: char.activeArmor?.baseThresholds,
              baseScore: char.activeArmor?.baseScore,
              feature: char.activeArmor?.feature,
            })
          }
          placeholder="Armor name"
        />
        <div className="mt-2 grid grid-cols-2 gap-2">
          <input
            className="px-2 py-1 border rounded-md"
            placeholder="Base thresholds"
            value={char.activeArmor?.baseThresholds || ""}
            onChange={(e) => onChangeArmor({ ...(char.activeArmor || { id: "1", name: "" }), baseThresholds: e.target.value })}
          />
          <input
            className="px-2 py-1 border rounded-md"
            placeholder="Base score"
            value={char.activeArmor?.baseScore || ""}
            onChange={(e) => onChangeArmor({ ...(char.activeArmor || { id: "2", name: "" }), baseScore: e.target.value })}
          />
        </div>
      </div>

      <hr />
      <h3 className="font-medium">Inventory</h3>
      <div className="space-y-2">
        {inventory.map((it, i) => (
          <div key={i} className="flex gap-2">
            <input
              className="flex-1 px-2 py-1 border rounded-md"
              value={it}
              onChange={(e) => onChangeInventory(inventory.map((v, idx) => (idx === i ? e.target.value : v)))}
            />
            <button onClick={() => onChangeInventory(inventory.filter((_, idx) => idx !== i))} className="px-2 py-1 rounded-md border">
              ✕
            </button>
          </div>
        ))}

        <div className="flex gap-2">
          <button onClick={() => addInventoryItem("")} className="px-3 py-1 rounded-md bg-emerald-600 text-white">
            + Add item
          </button>
        </div>
      </div>
    </div>
  );
}

/* Footer */
function Footer() {
  return <footer className="text-center text-sm text-zinc-400">Quick mobile web app starter — no built-in storage (you handle storage).</footer>;
}
