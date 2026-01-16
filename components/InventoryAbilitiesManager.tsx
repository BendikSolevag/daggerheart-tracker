import { Character, InventoryAbilities } from "@/app/types";
import { Dispatch, SetStateAction, useState, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";
import { createClient } from "@/supabase/client";
import { z } from "zod";

export function InventoryAbilitiesManager({
  invAbilities,
  char,
  setChar,
}: {
  invAbilities: InventoryAbilities;
  char: Character;
  setChar: Dispatch<SetStateAction<Character>>;
}) {
  const [open, setOpen] = useState(false);
  const [inventoryAbilities, setInventoryAbilities] = useState(invAbilities);

  function resolve_domain(id: number): string {
    const DOMAINS_MAP: Record<number, string> = {
      1: "Arcana",
      2: "Blade",
      3: "Bone",
      4: "Codex",
      5: "Grace",
      6: "Midnight",
      7: "Sage",
      8: "Splendor",
      9: "Valor",
    };

    return DOMAINS_MAP[id] ?? "couldn't resolve";
  }

  return (
    <>
      <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wide text-zinc-800">Abilities</h2>

          <button type="button" onClick={() => setOpen(true)} className="rounded-md p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition">
            <Plus size={16} />
          </button>
        </div>

        <ul className="space-y-3">
          {inventoryAbilities.map((entry) => {
            const a = entry.ability_id;

            return (
              <li key={entry.id} className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 hover:bg-zinc-100 transition">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-medium text-zinc-900">{a.name}</div>
                      <div className="mt-0.5 flex flex-wrap gap-2 text-xs text-zinc-500">
                        <span>Level {a.level}</span>
                        <span>•</span>
                        <span>{resolve_domain(a.domain_id)}</span>
                      </div>
                    </div>

                    <span className="shrink-0 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px] font-medium text-zinc-700">{a.ability_type}</span>
                  </div>

                  <p className="text-sm leading-snug text-zinc-700">{a.description}</p>

                  <div className="text-xs text-zinc-500">
                    Recall cost: <span className="font-medium text-zinc-700">{a.recall_cost}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {open && <AbilityOverlay setInvAbilities={setInventoryAbilities} char={char} onClose={() => setOpen(false)} />}
    </>
  );
}

type AbilityRow = {
  id: number;
  name: string;
  domain_id: number;
  level: number;
  ability_type: string;
  recall_cost: number;
  description: string;
};

export function AbilityOverlay({
  onClose,
  char,
  setInvAbilities,
}: {
  setInvAbilities: Dispatch<SetStateAction<InventoryAbilities>>;
  char: Character;
  onClose: () => void;
}) {
  const [abilities, setAbilities] = useState<AbilityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const supabase = createClient();

  useEffect(() => {
    const fetchAbilities = async () => {
      const { data, error } = await supabase
        .from("abilities")
        .select(
          `
          id,
          name,
          domain_id,
          level,
          ability_type,
          recall_cost,
          description
        `
        )
        .order("name");

      if (!error && data) {
        setAbilities(data);
      }

      setLoading(false);
    };

    fetchAbilities();
  }, []);

  const filteredAbilities = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return abilities;

    return abilities.filter((a) => a.name.toLowerCase().includes(q));
  }, [abilities, filter]);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg max-h-[90vh] rounded-lg shadow-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-800">Add ability</h3>
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
            placeholder="Filter by ability name…"
            className="w-full text-sm rounded-md border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-sm text-zinc-500">Loading…</div>
          ) : filteredAbilities.length === 0 ? (
            <div className="p-4 text-sm text-zinc-500">No abilities match your filter.</div>
          ) : (
            <ul className="divide-y divide-zinc-200">
              {filteredAbilities.map((a) => (
                <li key={a.id} className="px-4 py-2 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{a.name}</div>
                    <div className="text-xs text-zinc-500">
                      {a.ability_type} · Level {a.level}
                    </div>
                  </div>

                  <button
                    className="text-xs text-violet-600 hover:text-violet-800"
                    onClick={async () => {
                      const { data, error } = await supabase
                        .from("inventoryAbilities")
                        .insert({
                          ability_id: a.id,
                          owner_id: char.id,
                        })
                        .select();

                      if (error) {
                        console.error(error);
                        onClose();
                        return;
                      }

                      const InventoryAbilitiesSchema = z.array(
                        z.object({
                          id: z.number(),
                          ability_id: z.number(),
                        })
                      );

                      const parsed = InventoryAbilitiesSchema.parse(data);
                      const inserted = parsed[0];

                      setInvAbilities((prev) => [
                        ...prev,
                        {
                          id: inserted.id,
                          ability_id: {
                            id: a.id,
                            name: a.name,
                            domain_id: a.domain_id,
                            level: a.level,
                            ability_type: a.ability_type,
                            recall_cost: a.recall_cost,
                            description: a.description,
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
