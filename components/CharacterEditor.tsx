"use client";

import { Character, Inventory, InventoryWeapons } from "@/app/types";
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

export function CharacterEditor({
  character,
  inventory,
  inventoryWeapons,
}: {
  character: Character;
  inventory: Inventory;
  inventoryWeapons: InventoryWeapons;
}) {
  const [char, setChar] = useState<Character>(character);
  const [inv, setInv] = useState<Inventory>(inventory);
  const [invWeapons, setInvWeapons] = useState<InventoryWeapons>(inventoryWeapons);
  return (
    <>
      <Header char={char} setChar={setChar} />
      <IdentityPanel char={char} />
      <AttributesPanel char={char} setChar={setChar} />
      <GoldCounter char={char} setChar={setChar} />
      <HealthHopePanel char={char} setChar={setChar} />
      <Weapons char={char} setChar={setChar} setInvWeapons={setInvWeapons} />
      <Armor char={char} />
      <InventoryManager inv={inv} setInv={setInv} />
      <InventoryWeaponsManager invWeapons={invWeapons} setInvWeapons={setInvWeapons} char={char} setChar={setChar} />
    </>
  );
}
