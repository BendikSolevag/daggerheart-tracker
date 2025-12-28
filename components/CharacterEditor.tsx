"use client";

import { Character, Inventory, InventoryArmors, InventoryWeapons } from "@/app/types";
import { useState } from "react";
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

export function CharacterEditor({
  character,
  inventory,
  inventoryWeapons,
  inventoryArmors,
}: {
  character: Character;
  inventory: Inventory;
  inventoryWeapons: InventoryWeapons;
  inventoryArmors: InventoryArmors;
}) {
  const [char, setChar] = useState<Character>(character);
  const [inv, setInv] = useState<Inventory>(inventory);

  return (
    <>
      <Header char={char} setChar={setChar} />
      <IdentityPanel char={char} />
      <AttributesPanel char={char} setChar={setChar} />
      <GoldCounter char={char} setChar={setChar} />
      <HealthHopePanel char={char} setChar={setChar} />
      <Weapons char={char} setChar={setChar} />
      <Armor char={char} />
      <InventoryManager inv={inv} setInv={setInv} />
      <InventoryWeaponsManager invWeapons={inventoryWeapons} char={char} setChar={setChar} />
      <InventoryArmorsManager invArmors={inventoryArmors} char={char} setChar={setChar} />
    </>
  );
}
