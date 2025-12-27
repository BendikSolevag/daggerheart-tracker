import { Character } from "@/app/types";
import { Dispatch, SetStateAction } from "react";

/* Health & Hope Panel */
export function HealthHopePanel({ char, setChar }: { char: Character; setChar: Dispatch<SetStateAction<Character>> }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm w-full">
      <h2 className="font-semibold mb-2">Damage & Health</h2>

      <div className="space-y-3">
        <label className="text-xs text-zinc-500">HP</label>
        <div className="flex gap-2 items-center mt-1">
          {Array.from({ length: char.maxHp }).map((_, i) => {
            const filled = i < char.hp;
            return (
              <button
                key={i}
                onClick={() => setChar({ ...char, hp: i + 1 })}
                className={`w-6 h-6 rounded-sm border flex items-center justify-center text-xs ${filled ? "bg-yellow-400" : "bg-transparent"}`}
                title={`Set hope to ${i + 1}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={filled ? "currentColor" : "orange"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="8" />

                  <path d="M12 6c-3 0-5 2-5 4s2 4 5 4 5 2 5 4-2 4-5 4" />
                </svg>
              </button>
            );
          })}
        </div>

        <label className="text-xs text-zinc-500">Stress</label>
        <div className="flex gap-2 items-center mt-1">
          {Array.from({ length: char.maxStress }).map((_, i) => {
            const filled = i < char.stress;
            return (
              <button
                key={i}
                onClick={() => setChar({ ...char, stress: i + 1 })}
                className={`w-6 h-6 rounded-sm border flex items-center justify-center text-xs ${filled ? "bg-yellow-400" : "bg-transparent"}`}
                title={`Set hope to ${i + 1}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={filled ? "currentColor" : "orange"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="8" />

                  <path d="M12 6c-3 0-5 2-5 4s2 4 5 4 5 2 5 4-2 4-5 4" />
                </svg>
              </button>
            );
          })}
        </div>

        <label className="text-xs text-zinc-500">Hope</label>
        <div className="flex gap-2 items-center mt-1">
          {Array.from({ length: char.maxHope }).map((_, i) => {
            const filled = i < char.hope;
            return (
              <button
                key={i}
                onClick={() => setChar({ ...char, hope: i + 1 })}
                className={`w-6 h-6 rounded-sm border flex items-center justify-center text-xs ${filled ? "bg-yellow-400" : "bg-transparent"}`}
                title={`Set hope to ${i + 1}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={filled ? "currentColor" : "#00FFFF"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z" />

                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="15" x2="12" y2="17" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                </svg>
              </button>
            );
          })}
        </div>

        <label className="text-xs text-zinc-500">Armor</label>
        <div className="flex gap-2 items-center mt-1">
          {Array.from({ length: char.maxArmor }).map((_, i) => {
            const filled = i < char.armor;
            return (
              <button
                key={i}
                onClick={() => setChar({ ...char, armor: i + 1 })}
                className={`w-6 h-6 rounded-sm border flex items-center justify-center text-xs ${filled ? "bg-yellow-400" : "bg-transparent"}`}
                title={`Set hope to ${i + 1}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={filled ? "currentColor" : "#FF55FF"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2l7 3v6c0 5-3.5 9.5-7 11-3.5-1.5-7-6-7-11V5l7-3z" />
                </svg>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
