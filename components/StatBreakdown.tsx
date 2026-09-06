"use client";

import { StatValue } from "@/lib/stats";
import { Info } from "lucide-react";
import { useState } from "react";

function signed(n: number) {
  return n >= 0 ? `+${n}` : `−${Math.abs(n)}`;
}

/**
 * Small info button that opens a popover listing how a derived stat was
 * calculated: the stored base value followed by every modifier and its source.
 * Renders nothing when the stat has no modifiers.
 */
export function StatBreakdown({ label, stat, baseLabel = "Base" }: { label: string; stat: StatValue; baseLabel?: string }) {
  const [open, setOpen] = useState(false);

  if (stat.modifiers.length === 0) return null;

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-label={`${label} breakdown`}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setOpen(false)}
        className="text-zinc-400 hover:text-zinc-700"
      >
        <Info size={12} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-60 rounded-md border border-zinc-200 bg-white p-2 text-xs shadow-md">
          <div className="mb-1 font-semibold text-zinc-800">{label}</div>
          <ul className="space-y-0.5">
            <li className="flex justify-between gap-2">
              <span className="text-zinc-500">{baseLabel}</span>
              <span className="tabular-nums">{stat.base}</span>
            </li>
            {stat.modifiers.map((m, i) => (
              <li key={i} className="flex justify-between gap-2">
                <span className="truncate text-zinc-500" title={m.source}>
                  {m.source}
                </span>
                <span className={`tabular-nums ${m.value < 0 ? "text-red-600" : "text-emerald-700"}`}>{signed(m.value)}</span>
              </li>
            ))}
            <li className="mt-1 flex justify-between gap-2 border-t border-zinc-200 pt-1 font-semibold text-zinc-900">
              <span>Total</span>
              <span className="tabular-nums">{stat.total}</span>
            </li>
          </ul>
        </div>
      )}
    </span>
  );
}
