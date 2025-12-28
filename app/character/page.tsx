import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import { CharacterSchema, InventorySchema } from "../types";
import { CharacterEditor } from "@/components/CharacterEditor";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">
        <main className="w-full max-w-3xl space-y-4">
          <div>no user bitch</div>
        </main>
      </div>
    );
  }

  const { data, error } = await supabase
    .from("characters")
    .select(
      `
      id,
      name,
      level,
      proficiency,
      agility,
      strength,
      finesse,
      instinct,
      presence,
      knowledge,
      evasion,
      gold,
      stress,
      maxStress,
      hp,
      maxHp,
      hope,
      maxHope,
      armor,
      maxArmor,
      class_id (
        id,
        name,
        domain_1_id (
          id,
          name
        ),
        domain_2_id (
          id,
          name
        ),
        hope_feature,
        class_features
      ),
      subclass_id (
        id,
        name,
        spellcast_trait,
        foundation_features,
        specialization_features,
        mastery_features
      ),
      ancestry_id (
        id,
        name,
        feature_1_name,
        feature_1_description,
        feature_2_name,
        feature_2_description
      ),
      community_id (   
        id,     
        name,
        feature_name,
        feature_description
      ),
      weapon_primary_id (
        id,
        name,
        tier,
        range,
        trait,
        burden,
        damage,
        weapon_type,
        feature_name,
        feature_description
      ),
      weapon_secondary_id (
        id,
        name,
        tier,
        range,
        trait,
        burden,
        damage,
        weapon_type,
        feature_name,
        feature_description
      ),
      armor_id (
        id,
        name,
        tier,
        base_score,
        base_threshold_low,
        base_threshold_high,
        feature_name,
        feature_description
      )
    `
    )
    .eq("id", 1)
    .single();

  console.log(data);
  console.log(error);

  const character = CharacterSchema.parse(data);

  const { data: inventoryData, error: errorInventory } = await supabase
    .from("inventory")
    .select(
      `
        id,
        item,
      `
    )
    .eq("character_id", 1);

  const inventory = InventorySchema.parse(inventoryData);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">
      <main className="w-full max-w-3xl space-y-4">
        <CharacterEditor character={character} inventory={inventory} />
      </main>
    </div>
  );
}
