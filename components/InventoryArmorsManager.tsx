import { Character, InventoryArmors } from "@/app/types";
import { Plus } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { createClient } from "@/supabase/client";
import { z } from "zod";
import { SupabaseClient } from "@supabase/supabase-js";

export function InventoryArmorsManager({
  invArmors,
  char,
  setChar,
}: {
  invArmors: InventoryArmors;
  char: Character;
  setChar: Dispatch<SetStateAction<Character>>;
}) {
  const [open, setOpen] = useState(false);
  const [inventoryArmors, setInventoryArmors] = useState(invArmors);
  const supabase = createClient();

  return (
    <>
      <section className="bg-white p-4 rounded-lg shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-700">Armor</h2>

          <button type="button" onClick={() => setOpen(true)} className="text-zinc-500 hover:text-zinc-800">
            <Plus size={16} />
          </button>
        </div>

        <ul className="space-y-2">
          {inventoryArmors
            .filter((entry) => entry.id !== char.equipped_armor_id?.id)
            .map((entry) => {
              const a = entry.armors;

              return (
                <li key={entry.id} className="flex items-start gap-2 rounded-md border border-zinc-200 p-2">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-zinc-800">{a.name}</span>
                      <span className="text-xs text-zinc-500">Tier {a.tier}</span>
                    </div>

                    <div className="text-xs text-zinc-600">
                      Score {a.base_score} · Thresholds {a.base_threshold_low}–{a.base_threshold_high}
                    </div>

                    {a.feature_name && a.feature_description && (
                      <div className="text-xs text-zinc-600">
                        <span className="font-semibold">{a.feature_name}:</span> {a.feature_description}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="text-xs text-violet-600 hover:text-violet-800 hover:cursor-pointer"
                    onClick={() => setChar({ ...char, equipped_armor_id: entry })}
                  >
                    Equip
                  </button>
                  <button
                    type="button"
                    className="text-xs text-violet-600 hover:text-violet-800 hover:cursor-pointer"
                    onClick={async () => {
                      const { error } = await supabase.from("inventoryArmors").delete().eq("id", entry.id);

                      if (error) {
                        console.error(error);
                        return;
                      }

                      setInventoryArmors((prev) => prev.filter((elem) => elem.id !== entry.id));
                    }}
                  >
                    Remove
                  </button>
                </li>
              );
            })}
        </ul>
      </section>

      {open && <ArmorOverlay char={char} setInvArmors={setInventoryArmors} onClose={() => setOpen(false)} supabase={supabase} />}
    </>
  );
}

type ArmorRow = {
  id: number;
  name: string;
  tier: number;
  base_score: number;
  base_threshold_low: number;
  base_threshold_high: number;
  feature_name: string | null;
  feature_description: string | null;
};

export function ArmorOverlay({
  char,
  setInvArmors,
  onClose,
  supabase,
}: {
  char: Character;
  setInvArmors: Dispatch<SetStateAction<InventoryArmors>>;
  onClose: () => void;
  supabase: SupabaseClient<any, "public", "public", any, any>;
}) {
  const [armors, setArmors] = useState<ArmorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchArmors = async () => {
      const { data, error } = await supabase
        .from("armors")
        .select(
          `
          id,
          name,
          tier,
          base_score,
          base_threshold_low,
          base_threshold_high,
          feature_name,
          feature_description
        `
        )
        .order("name");

      if (!error && data) {
        setArmors(data);
      }

      setLoading(false);
    };

    fetchArmors();
  }, []);

  const filteredArmors = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return armors;
    return armors.filter((a) => a.name.toLowerCase().includes(q));
  }, [armors, filter]);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg max-h-[90vh] rounded-lg shadow-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-800">Add armor</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-800">
            ✕
          </button>
        </div>

        {/* Filter */}
        <div className="p-4 border-b border-zinc-200">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by armor name…"
            className="w-full text-sm rounded-md border border-zinc-300 px-3 py-2 focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-sm text-zinc-500">Loading…</div>
          ) : filteredArmors.length === 0 ? (
            <div className="p-4 text-sm text-zinc-500">No armors match your filter.</div>
          ) : (
            <ul className="divide-y divide-zinc-200">
              {filteredArmors.map((a) => (
                <li key={a.id} className="px-4 py-2 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{a.name}</div>
                    <div className="text-xs text-zinc-500">
                      Tier {a.tier} · Score {a.base_score}
                    </div>
                  </div>

                  <button
                    className="text-xs text-violet-600 hover:text-violet-800"
                    onClick={async () => {
                      const { data, error } = await supabase
                        .from("inventoryArmors")
                        .insert({
                          armor_id: a.id,
                          owner_id: char.id,
                        })
                        .select();

                      if (error) {
                        console.error(error);
                        onClose();
                        return;
                      }

                      const Schema = z.array(
                        z.object({
                          id: z.number(),
                          armor_id: z.number(),
                        })
                      );

                      const inserted = Schema.parse(data)[0];

                      setInvArmors((prev) => [
                        ...prev,
                        {
                          id: inserted.id,
                          armors: a,
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
