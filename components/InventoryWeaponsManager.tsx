import { Character, InventoryWeapons } from "@/app/types";
import { Dispatch, SetStateAction, useState, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";
import { createClient } from "@/supabase/client";
import { z } from "zod";
import { SupabaseClient } from "@supabase/supabase-js";

export function InventoryWeaponsManager({
  invWeapons,
  char,
  setChar,
}: {
  invWeapons: InventoryWeapons;
  char: Character;
  setChar: Dispatch<SetStateAction<Character>>;
}) {
  const [open, setOpen] = useState(false);
  const [inventoryWeapons, setInventoryWeapons] = useState(invWeapons);
  const supabase = createClient();

  return (
    <>
      <section className="bg-white p-4 rounded-lg shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-700">Weapons</h2>

          <button type="button" onClick={() => setOpen(true)} className="text-zinc-500 hover:text-zinc-800">
            <Plus size={16} />
          </button>
        </div>

        <ul className="space-y-2">
          {inventoryWeapons
            .filter((entry) => entry.id !== char.weapon_primary_id?.id && entry.id !== char.weapon_secondary_id?.id)
            .map((entry, i) => {
              const w = entry.weapon_id;

              return (
                <li key={i} className="flex items-start gap-2 rounded-md border border-zinc-200 p-2">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-zinc-800 mr-2">{w.name}</span>
                      <span className="text-xs text-zinc-500">Tier {w.tier}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="text-xs text-violet-600 hover:text-violet-800 mr-2 hover:cursor-pointer"
                      onClick={() => {
                        if (w.weapon_type === "Primary") {
                          setChar({ ...char, weapon_primary_id: entry });
                        }
                        if (w.weapon_type === "Secondary") {
                          setChar({ ...char, weapon_secondary_id: entry });
                        }
                      }}
                    >
                      Equip
                    </button>

                    <button
                      type="button"
                      className="text-xs text-violet-600 hover:text-violet-800 hover:cursor-pointer"
                      onClick={async () => {
                        const { error } = await supabase
                          .from("inventoryWeapons")
                          .insert({
                            weapon_id: w.id,
                            owner_id: char.id,
                          })
                          .select();
                        console.log("hai hai");
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
        </ul>
      </section>

      {open && <WeaponOverlay setInvWeapons={setInventoryWeapons} char={char} onClose={() => setOpen(false)} supabase={supabase} />}
    </>
  );
}

type WeaponRow = {
  id: number;
  name: string;
  tier: number;
  weapon_type: string;
  range: string;
  trait: string;
  burden: string;
  damage: string;
  feature_name: string;
  feature_description: string;
};

export function WeaponOverlay({
  onClose,
  char,
  setInvWeapons,
  supabase,
}: {
  setInvWeapons: Dispatch<SetStateAction<InventoryWeapons>>;
  char: Character;
  onClose: () => void;
  supabase: SupabaseClient<any, "public", "public", any, any>;
}) {
  const [weapons, setWeapons] = useState<WeaponRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchWeapons = async () => {
      const { data, error } = await supabase
        .from("weapons")
        .select(
          `
          id,
          name,
          tier,
          range,
          trait,
          burden,
          damage,
          weapon_type,
          feature_name,
          feature_description
        `
        )
        .order("name");

      if (!error && data) {
        setWeapons(data);
      }

      setLoading(false);
    };

    fetchWeapons();
  }, []);

  const filteredWeapons = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return weapons;

    return weapons.filter((w) => w.name.toLowerCase().includes(q));
  }, [weapons, filter]);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg max-h-[90vh] rounded-lg shadow-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-800">Add weapon</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-800 text-sm">
            ✕
          </button>
        </div>

        {/* Filter */}
        <div className="p-4 border-b border-zinc-200">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by weapon name…"
            className="w-full text-sm rounded-md border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-sm text-zinc-500">Loading…</div>
          ) : filteredWeapons.length === 0 ? (
            <div className="p-4 text-sm text-zinc-500">No weapons match your filter.</div>
          ) : (
            <ul className="divide-y divide-zinc-200">
              {filteredWeapons.map((w) => (
                <li key={w.id} className="px-4 py-2 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{w.name}</div>
                    <div className="text-xs text-zinc-500">
                      {w.weapon_type} · Tier {w.tier}
                    </div>
                  </div>

                  <button
                    className="text-xs text-violet-600 hover:text-violet-800"
                    onClick={async () => {
                      const { data, error } = await supabase
                        .from("inventoryWeapons")
                        .insert({
                          weapon_id: w.id,
                          owner_id: char.id,
                        })
                        .select();

                      if (error) {
                        console.error(error);
                        onClose();
                        return;
                      }

                      const InventoryWeaponsSchema = z.array(
                        z.object({
                          id: z.number(),
                          weapon_id: z.number(),
                        })
                      );

                      const inventoryWeapons = InventoryWeaponsSchema.parse(data);
                      const inserted = inventoryWeapons[0];

                      setInvWeapons((prev) => [
                        ...prev,
                        {
                          id: inserted.id,
                          weapon_id: {
                            id: w.id,
                            name: w.name,
                            tier: w.tier,
                            range: w.range,
                            trait: w.trait,
                            burden: w.burden,
                            damage: w.damage,
                            weapon_type: w.weapon_type,
                            feature_name: w.feature_name,
                            feature_description: w.feature_description,
                          },
                        },
                      ]);

                      onClose();
                    }}
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
