import { Character, InventoryAbilities } from "@/app/types";

/**
 * Derived character statistics.
 *
 * The database stores *base* values (traits, evasion, max HP/Stress) that the
 * player edits directly, plus references to equipped gear and domain cards.
 * Everything that modifies those values is layered on here so the sheet shows
 * the numbers the player actually rolls with. Every modifier records its
 * source so the UI can explain the total.
 *
 * Sources handled:
 *  - Equipped armor / weapon feature text (parsed: "+1 to Evasion", "−1 to Finesse",
 *    "+2 to Armor Score", "+3 to Severe damage threshold", "Gain a bonus to your
 *    damage thresholds equal to your Spellcast trait", ...).
 *  - Character level (added to damage thresholds; unarmored rule from the SRD).
 *  - Class, subclass, ancestry features and domain cards with permanent,
 *    unconditional bonuses (curated tables below, keyed by name).
 *
 * Situational bonuses ("against attacks made by...", "spend a Hope to...",
 * "until your next rest") are intentionally not applied.
 */

export const TRAITS = ["agility", "strength", "finesse", "instinct", "presence", "knowledge"] as const;
export type Trait = (typeof TRAITS)[number];

export type StatKey = Trait | "evasion" | "armorScore" | "thresholdMajor" | "thresholdSevere" | "maxHp" | "maxStress";

export type Modifier = {
  stat: StatKey;
  value: number;
  /** Human readable origin, e.g. "Chainmail Armor · Heavy". */
  source: string;
};

export type StatValue = {
  base: number;
  total: number;
  modifiers: Modifier[];
};

export type DerivedStats = {
  tier: number;
  spellcastTrait: Trait | null;
  stats: Record<StatKey, StatValue>;
  /** Effects that change stats but need the player to apply them manually. */
  notes: string[];
};

/** Domain ids as seeded in the database (see database/upserts/01_domains.sql). */
export const DOMAIN_NAMES: Record<number, string> = {
  1: "Arcana",
  2: "Blade",
  3: "Bone",
  4: "Codex",
  5: "Grace",
  6: "Midnight",
  7: "Sage",
  8: "Splendor",
  9: "Valor",
};

export const MAX_ARMOR_SCORE = 12;

export function tierFromLevel(level: number): number {
  if (level >= 8) return 4;
  if (level >= 5) return 3;
  if (level >= 2) return 2;
  return 1;
}

function asTrait(name: string | null | undefined): Trait | null {
  const lower = name?.trim().toLowerCase();
  return (TRAITS as readonly string[]).includes(lower ?? "") ? (lower as Trait) : null;
}

/** Effective value of a trait by name ("Finesse", "Spellcast", ...); null if it isn't a trait. */
export function traitValueFor(stats: DerivedStats, traitName: string): number | null {
  const trait = traitName.trim().toLowerCase() === "spellcast" ? stats.spellcastTrait : asTrait(traitName);
  return trait ? stats.stats[trait].total : null;
}

/* ---------- Feature text parsing (equipment) ---------- */

const THRESHOLDS: StatKey[] = ["thresholdMajor", "thresholdSevere"];

/** Lower-cased target phrase → stats it modifies. */
const FLAT_TARGETS: Record<string, StatKey[]> = {
  evasion: ["evasion"],
  "armor score": ["armorScore"],
  "damage thresholds": THRESHOLDS,
  "severe damage threshold": ["thresholdSevere"],
  "severe threshold": ["thresholdSevere"],
  "major damage threshold": ["thresholdMajor"],
  "major threshold": ["thresholdMajor"],
  "all character traits and evasion": [...TRAITS, "evasion"],
  ...Object.fromEntries(TRAITS.map((t) => [t, [t]])),
};

// "+1 to Evasion", "−2 to Evasion", "+1 Evasion", "+1 to your Armor Score"
const FLAT_RE = /^([+\-−–])\s*(\d+)\s+(?:to\s+)?(?:your\s+)?(.+)$/;
// "Gain a bonus to your damage thresholds equal to your Spellcast trait"
const SCALING_RE = /^gain a bonus to your (damage thresholds|armor score|evasion|severe damage threshold) equal to your (spellcast trait|tier|proficiency|level|agility|strength|finesse|instinct|presence|knowledge)$/;

type Resolve = (reference: string) => number;

/** Parse the flat (fixed number) modifiers out of an equipment feature description. */
function parseFlatModifiers(description: string | null | undefined, source: string): Modifier[] {
  if (!description) return [];
  const out: Modifier[] = [];

  for (const raw of description.split(";")) {
    const clause = raw.trim().replace(/\.$/, "").toLowerCase();
    const match = FLAT_RE.exec(clause);
    if (!match) continue;

    const [, sign, amount, target] = match;
    const stats = FLAT_TARGETS[target];
    if (!stats) continue; // attack rolls, primary weapon damage, Spellcast Rolls, ... aren't tracked here

    const value = (sign === "+" ? 1 : -1) * Number(amount);
    for (const stat of stats) out.push({ stat, value, source });
  }

  return out;
}

/** Parse modifiers whose size depends on another stat ("equal to your Presence"). */
function parseScalingModifiers(description: string | null | undefined, source: string, resolve: Resolve): Modifier[] {
  if (!description) return [];
  const out: Modifier[] = [];

  for (const raw of description.split(";")) {
    const clause = raw.trim().replace(/\.$/, "").toLowerCase();
    const match = SCALING_RE.exec(clause);
    if (!match) continue;

    const [, target, reference] = match;
    const stats = FLAT_TARGETS[target];
    const value = resolve(reference);
    if (!stats || value === 0) continue;

    for (const stat of stats) out.push({ stat, value, source: `${source} (${reference})` });
  }

  return out;
}

/* ---------- Main computation ---------- */

export function computeStats(char: Character, abilities: InventoryAbilities): DerivedStats {
  const mods: Modifier[] = [];
  const notes: string[] = [];
  const add = (stat: StatKey | StatKey[], value: number, source: string) => {
    if (value === 0) return;
    for (const s of Array.isArray(stat) ? stat : [stat]) mods.push({ stat: s, value, source });
  };

  const level = char.level;
  const tier = tierFromLevel(level);
  const armor = char.equipped_armor_id?.armors ?? null;
  const primary = char.weapon_primary_id?.weapon_id ?? null;
  const secondary = char.weapon_secondary_id?.weapon_id ?? null;
  const equipment = [armor, primary, secondary].filter((e) => e !== null).map((e) => ({
    source: e.feature_name ? `${e.name} · ${e.feature_name}` : e.name,
    description: e.feature_description,
  }));

  const abilityNames = new Set(abilities.map((a) => a.ability_id.name));
  const has = (name: string) => abilityNames.has(name);
  const domainCount = (domain: string) => abilities.filter((a) => DOMAIN_NAMES[a.ability_id.domain_id] === domain).length;

  // Subclass specialization/mastery aren't tracked on the character, so use the
  // earliest level they can be taken (tier 3 and tier 4 advancements).
  const hasSpecialization = level >= 5;
  const hasMastery = level >= 8;

  /* 1. Flat equipment modifiers (these are the only things that change traits) */
  for (const e of equipment) mods.push(...parseFlatModifiers(e.description, e.source));

  const sum = (stat: StatKey) => mods.filter((m) => m.stat === stat).reduce((acc, m) => acc + m.value, 0);
  const traitTotal = (t: Trait) => char[t] + sum(t);
  const spellcastTrait = asTrait(char.subclass_id.spellcast_trait);

  const resolve: Resolve = (reference) => {
    switch (reference) {
      case "tier":
        return tier;
      case "proficiency":
        return char.proficiency;
      case "level":
        return level;
      case "spellcast trait":
        return spellcastTrait ? traitTotal(spellcastTrait) : 0;
      default: {
        const trait = asTrait(reference);
        return trait ? traitTotal(trait) : 0;
      }
    }
  };

  /* 2. Scaling equipment modifiers */
  for (const e of equipment) mods.push(...parseScalingModifiers(e.description, e.source, resolve));

  /* 3. Level → damage thresholds (SRD: unarmored Major = level, Severe = 2 × level) */
  const bareBones = !armor && has("Bare Bones");
  if (armor || bareBones) {
    add(THRESHOLDS, level, "Level");
  } else {
    add("thresholdMajor", level, "Level (unarmored)");
    add("thresholdSevere", level * 2, "Level ×2 (unarmored)");
  }

  /* 4. Class */
  switch (char.class_id.name) {
    case "Brawler":
      if (!primary && !secondary) add("evasion", 1, "Brawler · I Am the Weapon");
      break;
  }

  /* 5. Subclass */
  const sub = char.subclass_id.name;
  switch (sub) {
    case "Juggernaut":
      add("thresholdSevere", 3, `${sub} · Rugged`);
      break;
    case "Stalwart":
      add(THRESHOLDS, 1, `${sub} · Unwavering`);
      if (hasSpecialization) add(THRESHOLDS, 2, `${sub} · Unrelenting`);
      if (hasMastery) add(THRESHOLDS, 3, `${sub} · Undaunted`);
      break;
    case "Vengeance":
      add("maxStress", 1, `${sub} · At Ease`);
      break;
    case "Nightwalker":
      if (hasMastery) add("evasion", 1, `${sub} · Fleeting Shadow`);
      break;
    case "Winged Sentinel":
      if (hasMastery) add("thresholdSevere", 4, `${sub} · Ascendant`);
      break;
    case "School of War":
      add("maxHp", 1, `${sub} · Battlemage`);
      if (hasSpecialization && char.hope >= 2) add("evasion", char.proficiency, `${sub} · Conjure Shield (2+ Hope)`);
      break;
  }

  /* 6. Ancestry */
  const anc = char.ancestry_id.name;
  switch (anc) {
    case "Earthkin":
      add(["armorScore", ...THRESHOLDS], 1, `${anc} · Stoneskin`);
      break;
    case "Galapa":
      add(THRESHOLDS, char.proficiency, `${anc} · Shell`);
      break;
    case "Giant":
      add("maxHp", 1, `${anc} · Endurance`);
      break;
    case "Human":
      add("maxStress", 1, `${anc} · High Stamina`);
      break;
    case "Simiah":
      add("evasion", 1, `${anc} · Nimble`);
      break;
  }

  /* 7. Domain cards in the loadout */
  if (has("Untouchable")) add("evasion", Math.ceil(traitTotal("agility") / 2), "Untouchable (½ Agility)");
  if (has("Fortified Armor") && armor) add(THRESHOLDS, 2, "Fortified Armor");
  if (has("Armorer") && armor) add("armorScore", 1, "Armorer");
  if (has("Rise Up")) add("thresholdSevere", char.proficiency, "Rise Up (Proficiency)");
  if (has("Eldritch Flesh")) add(THRESHOLDS, char.stress, "Eldritch Flesh (marked Stress)");
  if (has("Blade-Touched") && domainCount("Blade") >= 4) add("thresholdSevere", 4, "Blade-Touched");
  if (has("Splendor-Touched") && domainCount("Splendor") >= 4) add("thresholdSevere", 3, "Splendor-Touched");
  if (has("Valor-Touched") && domainCount("Valor") >= 4) add("armorScore", 1, "Valor-Touched");
  if (bareBones) add("armorScore", traitTotal("strength"), "Bare Bones (Strength)");
  if (has("Vitality")) notes.push("Vitality: choose two of +1 Stress slot, +1 Hit Point slot, +2 damage thresholds and apply them to the base values manually.");

  /* 8. Base values */
  const BARE_BONES_THRESHOLDS: Record<number, [number, number]> = { 1: [9, 19], 2: [11, 24], 3: [13, 31], 4: [15, 38] };
  const [bbMajor, bbSevere] = BARE_BONES_THRESHOLDS[tier];

  const bases: Record<StatKey, number> = {
    agility: char.agility,
    strength: char.strength,
    finesse: char.finesse,
    instinct: char.instinct,
    presence: char.presence,
    knowledge: char.knowledge,
    evasion: char.evasion,
    armorScore: armor ? armor.base_score : bareBones ? 3 : 0,
    thresholdMajor: armor ? armor.base_threshold_low : bareBones ? bbMajor : 0,
    thresholdSevere: armor ? armor.base_threshold_high : bareBones ? bbSevere : 0,
    maxHp: char.maxHp,
    maxStress: char.maxStress,
  };

  const stats = Object.fromEntries(
    (Object.keys(bases) as StatKey[]).map((key) => {
      const modifiers = mods.filter((m) => m.stat === key);
      const total = bases[key] + modifiers.reduce((acc, m) => acc + m.value, 0);
      return [key, { base: bases[key], total, modifiers }];
    })
  ) as Record<StatKey, StatValue>;

  if (stats.armorScore.total > MAX_ARMOR_SCORE) {
    notes.push(`Armor Score capped at ${MAX_ARMOR_SCORE} (would be ${stats.armorScore.total}).`);
    stats.armorScore.total = MAX_ARMOR_SCORE;
  }

  return { tier, spellcastTrait, stats, notes };
}
