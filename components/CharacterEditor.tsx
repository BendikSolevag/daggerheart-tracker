"use client";

import { Character, Inventory, InventoryAbilities, InventoryArmors, InventoryWeapons } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import { Header } from "./Header";
import { HealthHopePanel } from "./HealthHopePanel";
import { AttributesPanel } from "./AttributesPanel";
import { Weapons } from "./Weapons";
import { Armor } from "./Armor";
import { GoldCounter } from "./Gold";
import { IdentityPanel } from "./Identity";
import { InventoryManager } from "./InventoryManager";
import { InventoryWeaponsManager } from "./InventoryWeaponsManager";
import { InventoryArmorsManager } from "./InventoryArmorsManager";
import { InventoryAbilitiesManager } from "./InventoryAbilitiesManager";

export function CharacterEditor({
  character,
  inventory,
  inventoryWeapons,
  inventoryArmors,
  inventoryAbilities,
}: {
  character: Character;
  inventory: Inventory;
  inventoryWeapons: InventoryWeapons;
  inventoryArmors: InventoryArmors;
  inventoryAbilities: InventoryAbilities;
}) {
  const [char, setChar] = useState<Character>(character);
  const [inv, setInv] = useState<Inventory>(inventory);

  const isFirstRenderChar = useRef(true);
  const isFirstRenderItems = useRef(true);

  useEffect(() => {
    // Avoid firing on initial hydration
    if (isFirstRenderChar.current) {
      isFirstRenderChar.current = false;
      return;
    }

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      try {
        await fetch(`/api/character/${char.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            character: char,
          }),
          signal: controller.signal,
        });
      } catch (err) {
        if ((err as any).name !== "AbortError") {
          console.error("Failed to save character", err);
        }
      }
    }, 500); // debounce window

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [char]);

  useEffect(() => {
    // Avoid firing on initial hydration
    if (isFirstRenderItems.current) {
      isFirstRenderItems.current = false;
      return;
    }

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      try {
        await fetch(`/api/character/${char.id}/inventory`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inv: inv,
          }),
          signal: controller.signal,
        });
      } catch (err) {
        if ((err as any).name !== "AbortError") {
          console.error("Failed to save inventory", err);
        }
      }
    }, 500); // debounce window

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [inv]);

  return (
    <>
      <Header char={char} setChar={setChar} />
      <AttributesPanel char={char} setChar={setChar} />
      <GoldCounter char={char} setChar={setChar} />
      <HealthHopePanel char={char} setChar={setChar} />
      <Weapons char={char} setChar={setChar} />
      <Armor char={char} />
      <InventoryManager inv={inv} char={char} setInv={setInv} />
      <IdentityPanel char={char} />

      <InventoryWeaponsManager invWeapons={inventoryWeapons} char={char} setChar={setChar} />
      <InventoryArmorsManager invArmors={inventoryArmors} char={char} setChar={setChar} />
      <InventoryAbilitiesManager invAbilities={inventoryAbilities} char={char} setChar={setChar} />
    </>
  );
}
