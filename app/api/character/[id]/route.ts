import { NextResponse } from "next/server";
import { createClient } from "@/supabase/server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();

  const p = await params;
  const characterId = Number(p.id);

  // 1. Auth check

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse payload
  const { character } = await request.json();

  if (!character || character.id !== characterId) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // 3. Ownership check
  const { data: existing, error: fetchError } = await supabase.from("characters").select("id, owner_id").eq("id", characterId).single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Character not found" }, { status: 404 });
  }

  if (existing.owner_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 4. Update (explicit whitelist is intentional)
  const { error: updateError } = await supabase
    .from("characters")
    .update({
      name: character.name,
      level: character.level,
      proficiency: character.proficiency,
      agility: character.agility,
      strength: character.strength,
      finesse: character.finesse,
      instinct: character.instinct,
      presence: character.presence,
      knowledge: character.knowledge,
      gold: character.gold,
      hp: character.hp,
      maxHp: character.maxHp,
      hope: character.hope,
      maxHope: character.maxHope,
      stress: character.stress,
      maxStress: character.maxStress,
      armor: character.armor,
      maxArmor: character.maxArmor,
      notes: character.notes,
      weapon_primary_id: character.weapon_primary_id?.id ?? null,
      weapon_secondary_id: character.weapon_secondary_id?.id ?? null,
      equipped_armor_id: character.equipped_armor_id?.id ?? null,
    })
    .eq("id", characterId);

  if (updateError) {
    console.log(updateError);
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
