"use client";

import { Character } from "@/app/types";
import { useState } from "react";
import { Header } from "./Header";
import { HealthHopePanel } from "./HealthHopePanel";
import { AttributesPanel } from "./AttributesPanel";
import { Weapons } from "./Weapons";
import { Armor } from "./Armor";

export function CharacterEditor({ character }: { character: Character }) {
  const [char, setChar] = useState<Character>(character);

  return (
    <>
      <Header char={char} setChar={setChar} />
      <AttributesPanel char={char} setChar={setChar} />
      <HealthHopePanel char={char} setChar={setChar} />
      <Weapons char={char} />
      <Armor char={char} />
    </>
  );
}
