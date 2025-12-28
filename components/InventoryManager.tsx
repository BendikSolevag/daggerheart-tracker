import { Inventory } from "@/app/types";
import { Dispatch, SetStateAction } from "react";

export function InventoryManager({ inv, setInv }: { inv: Inventory; setInv: Dispatch<SetStateAction<Inventory>> }) {
  return (
    <section className="bg-white p-4 rounded-lg shadow-sm space-y-3">
      <h2 className="text-sm font-semibold text-zinc-700">Inventory</h2>

      <ul className="space-y-2">
        {inv.map((entry) => (
          <li key={entry.id} className="flex items-start gap-2">
            <textarea
              rows={1}
              className="
                flex-1 resize-none overflow-hidden
                rounded-md border border-zinc-200
                px-2 py-1 text-sm
                focus:outline-none focus:ring-2 focus:ring-violet-500
                wrap-break-word
              "
              placeholder="Item name"
              value={entry.item}
              onChange={(e) => {
                // auto-grow
                e.currentTarget.style.height = "auto";
                e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;

                setInv((prev) => prev.map((it) => (it.id === entry.id ? { ...it, item: e.target.value } : it)));
              }}
            />

            <button
              type="button"
              aria-label="Remove item"
              className="mt-1 text-xs text-red-600 hover:text-red-800"
              onClick={() => setInv((prev) => prev.filter((it) => it.id !== entry.id))}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="text-sm text-violet-600 hover:text-violet-800"
        onClick={() =>
          setInv((prev) => [
            ...prev,
            {
              id: Math.max(0, ...prev.map((i) => i.id)) + 1,
              item: "",
            },
          ])
        }
      >
        + Add item
      </button>
    </section>
  );
}
