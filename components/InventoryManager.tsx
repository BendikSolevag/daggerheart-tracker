import { Inventory } from "@/app/types";
import { Dispatch, SetStateAction } from "react";

export function InventoryManager({ inv, setInv }: { inv: Inventory; setInv: Dispatch<SetStateAction<Inventory>> }) {
  const updateItem = (id: number, value: string) => {
    setInv((prev) => prev.map((entry) => (entry.id === id ? { ...entry, item: value } : entry)));
  };

  const removeItem = (id: number) => {
    setInv((prev) => prev.filter((entry) => entry.id !== id));
  };

  return (
    <section className="bg-white p-4 rounded-lg shadow-sm space-y-3">
      <h2 className="text-sm font-semibold text-zinc-700">Inventory</h2>

      <ul className="space-y-2">
        {inv.map((entry) => (
          <li key={entry.id} className="flex items-center gap-2">
            <input
              className="flex-1 rounded-md border border-zinc-200 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={entry.item}
              placeholder="Item name"
              onChange={(e) => updateItem(entry.id, e.target.value)}
            />

            <button type="button" onClick={() => removeItem(entry.id)} className="text-xs text-red-600 hover:text-red-800" aria-label="Remove item">
              ✕
            </button>
          </li>
        ))}
      </ul>

      <button type="button" className="text-sm text-violet-600 hover:text-violet-800">
        + Add item
      </button>
    </section>
  );
}
