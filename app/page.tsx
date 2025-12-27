import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: character, error: readsError } = await supabase
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
      gold,

      class_id (
        name,
        domain_1_id (
          name
        ),
        domain_2_id (
          name
        ),
        hope_feature,
        class_features
      ),
      subclass_id (
        name,
        spellcast_trait,
        foundation_features,
        specialization_features,
        mastery_features
      ),
      ancestry_id (
        name,
        feature_1_name,
        feature_1_description,
        feature_2_name,
        feature_2_description
      ),
      community_id (        
        name,
        feature_name,
        feature_description
      ),
      weapon_primary_id (
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
    .eq("id", 1);

  console.log(character);
  console.log(readsError);
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">welcome, {JSON.stringify(character, null, 2)}</div>
  );
}
