import { z } from "zod";

/* ---------- Core subtypes ---------- */

export const DomainSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const ClassSchema = z.object({
  id: z.number(),
  name: z.string(),
  domain_1_id: DomainSchema,
  domain_2_id: DomainSchema,
  hope_feature: z.string(),
  class_features: z.string(),
});

export const SubclassSchema = z.object({
  id: z.number(),
  name: z.string(),
  spellcast_trait: z.string(),
  foundation_features: z.string(),
  specialization_features: z.string(),
  mastery_features: z.string(),
});

export const AncestrySchema = z.object({
  id: z.number(),
  name: z.string(),
  feature_1_name: z.string(),
  feature_1_description: z.string(),
  feature_2_name: z.string(),
  feature_2_description: z.string(),
});

export const CommunitySchema = z.object({
  id: z.number(),
  name: z.string(),
  feature_name: z.string(),
  feature_description: z.string(),
});

/* ---------- Equipment ---------- */

export const WeaponSchema = z.object({
  id: z.number(),
  name: z.string(),
  tier: z.number(),
  range: z.string(),
  trait: z.string(),
  burden: z.string(),
  damage: z.string(),
  weapon_type: z.string(),
  feature_name: z.string().nullable(),
  feature_description: z.string().nullable(),
});

export const ArmorSchema = z.object({
  id: z.number(),
  name: z.string(),
  tier: z.number(),
  base_score: z.number(),
  base_threshold_low: z.number(),
  base_threshold_high: z.number(),
  feature_name: z.string().nullable(),
  feature_description: z.string().nullable(),
});

/* ---------- Join tables ---------- */

export const CharacterWeaponSchema = z.object({
  id: z.number(),
  weapon_id: WeaponSchema,
});

export const CharacterArmorSchema = z.object({
  id: z.number(),
  armors: ArmorSchema,
});

/* ---------- Character ---------- */

export const CharacterSchema = z.object({
  id: z.number(),
  name: z.string(),
  level: z.number(),
  proficiency: z.number(),

  agility: z.number(),
  strength: z.number(),
  finesse: z.number(),
  instinct: z.number(),
  presence: z.number(),
  knowledge: z.number(),

  evasion: z.number(),

  gold: z.number(),
  stress: z.number(),
  maxStress: z.number(),
  hp: z.number(),
  maxHp: z.number(),
  hope: z.number(),
  maxHope: z.number(),
  armor: z.number(),
  maxArmor: z.number(),

  class_id: ClassSchema,
  subclass_id: SubclassSchema,
  ancestry_id: AncestrySchema,
  community_id: CommunitySchema,

  weapon_primary_id: CharacterWeaponSchema.nullable(),
  weapon_secondary_id: CharacterWeaponSchema.nullable(),
  equipped_armor_id: CharacterArmorSchema.nullable(),
});

export type Character = z.infer<typeof CharacterSchema>;

export const InventorySchema = z.array(
  z.object({
    id: z.number(),
    item: z.string(),
  })
);

export type Inventory = z.infer<typeof InventorySchema>;

export const InventoryWeaponsSchema = z.array(
  z.object({
    id: z.number(),
    weapon_id: WeaponSchema,
  })
);

export type InventoryWeapons = z.infer<typeof InventoryWeaponsSchema>;

export const InventoryArmorsSchema = z.array(
  z.object({
    id: z.number(),
    armors: ArmorSchema,
  })
);
export type InventoryArmors = z.infer<typeof InventoryArmorsSchema>;
