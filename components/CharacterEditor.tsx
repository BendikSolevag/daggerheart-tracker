"use client";

import { Character, Inventory } from "@/app/types";
import { useState } from "react";
import { Header } from "./Header";
import { HealthHopePanel } from "./HealthHopePanel";
import { AttributesPanel } from "./AttributesPanel";
import { Weapons } from "./Weapons";
import { Armor } from "./Armor";
import { GoldCounter } from "./Gold";
import { IdentityPanel } from "./Identity";
import { InventoryManager } from "./InventoryManager";

export function CharacterEditor({ character, inventory }: { character: Character; inventory: Inventory }) {
  const [char, setChar] = useState<Character>(character);
  const [inv, setInv] = useState<Inventory>(inventory);

  return (
    <>
      <Header char={char} setChar={setChar} />
      <IdentityPanel char={char} />
      <AttributesPanel char={char} setChar={setChar} />
      <GoldCounter char={char} setChar={setChar} />
      <HealthHopePanel char={char} setChar={setChar} />
      <Weapons char={char} />
      <Armor char={char} />
      <InventoryManager inv={inv} setInv={setInv} />
    </>
  );
}
