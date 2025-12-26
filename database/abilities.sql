drop table if exists public.abilities;

create table public.abilities (
  id bigint generated always as identity primary key,

  slug text not null unique,
  name text not null,

  domain_id bigint not null references public.domains(id) on delete cascade,

  level int not null,
  ability_type text not null,   -- Ability | Spell | Grimoire
  recall_cost int not null,

  description text not null,

  created_at timestamptz not null default now()
);
insert into public.abilities (
  slug,
  name,
  domain_id,
  level,
  ability_type,
  recall_cost,
  description
)
values
(
  'a-soldiers-bond',
  'A Soldier’s Bond',
  (select id from public.domains where slug = 'blade'),
  2,
  'Ability',
  1,
  'Once per long rest, when you compliment someone or ask them about something they’re good at, you can both gain 3 Hope.'
),
(
  'adjust-reality',
  'Adjust Reality',
  (select id from public.domains where slug = 'arcana'),
  10,
  'Spell',
  1,
  'After you or a willing ally make any roll, you can spend 5 Hope to change the numerical result of that roll to a result of your choice instead. The result must be plausible within the range of the dice.'
),
(
  'arcana-touched',
  'Arcana-Touched',
  (select id from public.domains where slug = 'arcana'),
  7,
  'Ability',
  2,
  'When 4 or more domain cards in your loadout are Arcana: +1 to Spellcast Rolls; once per rest you may switch Hope and Fear Dice results.'
),
(
  'arcane-reflection',
  'Arcane Reflection',
  (select id from public.domains where slug = 'arcana'),
  8,
  'Spell',
  1,
  'When you would take magic damage, spend any number of Hope and roll that many d6s. If any roll a 6, the attack is reflected back to the caster.'
),
(
  'armorer',
  'Armorer',
  (select id from public.domains where slug = 'valor'),
  5,
  'Ability',
  1,
  'While wearing armor, gain +1 Armor Score. When repairing armor during a rest, allies also clear an Armor Slot.'
),
(
  'astral-projection',
  'Astral Projection',
  (select id from public.domains where slug = 'grace'),
  8,
  'Spell',
  0,
  'Once per long rest, mark Stress to create a projected copy of yourself at a previously visited location. Lasts until rest or damaged.'
),
(
  'banish',
  'Banish',
  (select id from public.domains where slug = 'codex'),
  6,
  'Spell',
  0,
  'Spellcast Roll vs target. On failure, target is banished once per rest. Fear reduces Difficulty and may allow return.'
),
(
  'bare-bones',
  'Bare Bones',
  (select id from public.domains where slug = 'valor'),
  1,
  'Ability',
  0,
  'Without armor, base Armor Score is 3 + Strength. Defines custom damage thresholds by tier.'
),
(
  'battle-cry',
  'Battle Cry',
  (select id from public.domains where slug = 'blade'),
  8,
  'Ability',
  2,
  'Once per long rest, allies clear Stress, gain Hope, and have advantage on attacks until a Fear failure occurs.'
),
(
  'battle-monster',
  'Battle Monster',
  (select id from public.domains where slug = 'blade'),
  10,
  'Ability',
  0,
  'On a successful attack, mark 4 Stress to deal damage equal to your currently marked Hit Points.'
),
(
  'battle-hardened',
  'Battle-Hardened',
  (select id from public.domains where slug = 'blade'),
  6,
  'Ability',
  2,
  'Once per long rest when making a Death Move, spend a Hope to clear a Hit Point instead.'
),
(
  'blade-touched',
  'Blade-Touched',
  (select id from public.domains where slug = 'blade'),
  7,
  'Ability',
  1,
  'When 4+ Blade cards: +2 attack rolls, +4 Severe damage threshold.'
),
(
  'blink-out',
  'Blink Out',
  (select id from public.domains where slug = 'arcana'),
  4,
  'Spell',
  1,
  'Spellcast Roll (12). Teleport within Far range; bring nearby allies at extra Hope cost.'
),
(
  'body-basher',
  'Body Basher',
  (select id from public.domains where slug = 'valor'),
  2,
  'Ability',
  1,
  'On a successful Melee attack, gain bonus damage equal to Strength.'
),
(
  'bold-presence',
  'Bold Presence',
  (select id from public.domains where slug = 'valor'),
  2,
  'Ability',
  0,
  'Spend Hope to add Strength to Presence Rolls. Once per rest, avoid gaining a condition.'
),
(
  'bolt-beacon',
  'Bolt Beacon',
  (select id from public.domains where slug = 'splendor'),
  1,
  'Spell',
  1,
  'Spellcast Roll. On success, deal 6d8+2 magic damage and apply Vulnerable with glowing effect.'
),
(
  'bone-touched',
  'Bone-Touched',
  (select id from public.domains where slug = 'bone'),
  7,
  'Ability',
  2,
  'When 4+ Bone cards: +1 Agility; once per rest spend 3 Hope to negate a successful attack.'
);
insert into public.abilities (
  slug,
  name,
  domain_id,
  level,
  ability_type,
  recall_cost,
  description
)
values
(
  'book-of-ava',
  'Book of Ava',
  (select id from public.domains where slug = 'codex'),
  1,
  'Grimoire',
  2,
  'Power Push: Spellcast vs target in Melee range; on success, knock them to Far range and deal d10+2 magic damage. 
   Tova’s Armor: Spend a Hope to grant +1 Armor Score until next rest or recast.
   Ice Spike: Spellcast Roll (12) to summon an ice spike; on success, deal d6 physical damage.'
),
(
  'book-of-exota',
  'Book of Exota',
  (select id from public.domains where slug = 'codex'),
  4,
  'Grimoire',
  3,
  'Repudiate: Reaction roll using Spellcast to interrupt a magical effect; once per rest on success, negate it.
   Create Construct: Spend Hope to animate nearby objects; they share your traits, deal 2d10+3 physical damage, and collapse when damaged.'
),
(
  'book-of-grynn',
  'Book of Grynn',
  (select id from public.domains where slug = 'codex'),
  4,
  'Grimoire',
  2,
  'Arcane Deflection: Once per long rest, spend Hope to negate damage to you or an ally in Very Close range.
   Time Lock: Freeze an object in time until next rest.
   Wall of Flame: Spellcast Roll (15); create a wall that deals 4d10+3 magic damage when crossed.'
),
(
  'book-of-homet',
  'Book of Homet',
  (select id from public.domains where slug = 'codex'),
  7,
  'Grimoire',
  0,
  'Pass Through: Spellcast Roll (13); once per rest, pass through a wall or door with all touching creatures.
   Plane Gate: Spellcast Roll (14); once per long rest, open a gate to a previously visited plane until next rest.'
),
(
  'book-of-illiat',
  'Book of Illiat',
  (select id from public.domains where slug = 'codex'),
  1,
  'Grimoire',
  2,
  'Slumber: Spellcast vs target in Very Close range; they fall asleep until damaged or Fear is spent.
   Arcane Barrage: Once per rest, spend Hope to deal that many d6 magic damage.
   Telepathy: Spend Hope to open mental communication until next rest.'
),
(
  'book-of-korvax',
  'Book of Korvax',
  (select id from public.domains where slug = 'codex'),
  3,
  'Grimoire',
  2,
  'Levitation: Spellcast to lift and move a target within Close range.
   Recant: Spend Hope; target forgets last minute on failed Reaction Roll (15).
   Rune Circle: Mark Stress to create a damaging magical circle dealing 2d12+4 magic damage.'
),
(
  'book-of-norai',
  'Book of Norai',
  (select id from public.domains where slug = 'codex'),
  3,
  'Grimoire',
  2,
  'Mystic Tether: Spellcast vs Far target; restrains and grounds flying creatures.
   Fireball: Spellcast vs Very Far target; explosion forces Reaction Rolls (13), dealing 4d20+5 magic damage on failure.'
);
insert into public.abilities (
  slug,
  name,
  domain_id,
  level,
  ability_type,
  recall_cost,
  description
)
values
(
  'book-of-ronin',
  'Book of Ronin',
  (select id from public.domains where slug = 'codex'),
  9,
  'Grimoire',
  4,
  'Transform: Spellcast Roll (15) to transform into an inanimate object up to twice your size until damaged.
   Eternal Enervation: Once per long rest, Spellcast vs Close target; on success they become permanently Vulnerable.'
),
(
  'book-of-sitil',
  'Book of Sitil',
  (select id from public.domains where slug = 'codex'),
  2,
  'Grimoire',
  2,
  'Adjust Appearance: Magically alter your appearance and clothing.
   Parallecta: Spend 2 Hope; next attack may target an additional valid creature.
   Illusion: Spellcast Roll (14) to create a sustained visual illusion within Close range.'
),
(
  'book-of-tyfar',
  'Book of Tyfar',
  (select id from public.domains where slug = 'codex'),
  1,
  'Grimoire',
  2,
  'Wild Flame: Spellcast vs up to three Melee targets; 2d6 magic damage and mark Stress.
   Magic Hand: Conjure a magical hand within Far range.
   Mysterious Mist: Spellcast Roll (13) to create heavily obscuring fog.'
),
(
  'book-of-vagras',
  'Book of Vagras',
  (select id from public.domains where slug = 'codex'),
  2,
  'Grimoire',
  2,
  'Runic Lock: Spellcast Roll (15) to magically lock an object once per rest.
   Arcane Door: Spellcast Roll (13) to create a temporary portal.
   Reveal: Spellcast Roll to reveal magically hidden effects within Close range.'
),
(
  'book-of-vyola',
  'Book of Vyola',
  (select id from public.domains where slug = 'codex'),
  8,
  'Grimoire',
  2,
  'Memory Delve: Spellcast vs Far target to access relevant memories.
   Shared Clarity: Once per long rest, split Stress between two willing creatures.'
),
(
  'book-of-yarrow',
  'Book of Yarrow',
  (select id from public.domains where slug = 'codex'),
  10,
  'Grimoire',
  2,
  'Timejammer: Spellcast Roll (18) to halt time for others until you act.
   Magic Immunity: Spend 5 Hope to become immune to magic damage until next rest.'
),
(
  'boost',
  'Boost',
  (select id from public.domains where slug = 'bone'),
  4,
  'Ability',
  1,
  'Mark Stress to launch from an ally, perform an aerial attack within Far range with advantage and +d10 damage.'
),
(
  'brace',
  'Brace',
  (select id from public.domains where slug = 'bone'),
  3,
  'Ability',
  1,
  'When marking an Armor Slot to reduce damage, mark Stress to mark an additional Armor Slot.'
),
(
  'breaking-blow',
  'Breaking Blow',
  (select id from public.domains where slug = 'bone'),
  8,
  'Ability',
  3,
  'After a successful attack, mark Stress to make your next successful attack against the same target deal +2d12 damage.'
),
(
  'chain-lightning',
  'Chain Lightning',
  (select id from public.domains where slug = 'arcana'),
  5,
  'Spell',
  1,
  'Mark 2 Stress and Spellcast to deal 2d8+4 magic damage in a chaining effect across nearby adversaries.'
),
(
  'champions-edge',
  'Champion’s Edge',
  (select id from public.domains where slug = 'blade'),
  5,
  'Ability',
  1,
  'On a critical success, spend up to 3 Hope to clear HP, clear Armor, or force the target to mark HP (no duplicates).'
),
(
  'chokehold',
  'Chokehold',
  (select id from public.domains where slug = 'midnight'),
  3,
  'Ability',
  1,
  'Mark Stress to restrain a similar-sized creature from behind, making them Vulnerable and increasing damage taken.'
),
(
  'cinder-grasp',
  'Cinder Grasp',
  (select id from public.domains where slug = 'arcana'),
  2,
  'Spell',
  1,
  'Spellcast vs Melee target; on success deal 12d20+3 magic damage and set them On Fire.'
),
(
  'cloaking-blast',
  'Cloaking Blast',
  (select id from public.domains where slug = 'arcana'),
  7,
  'Spell',
  2,
  'After successfully casting another spell, spend Hope to become Cloaked while stationary.'
),
(
  'codex-touched',
  'Codex-Touched',
  (select id from public.domains where slug = 'codex'),
  7,
  'Ability',
  2,
  'When 4+ Codex cards: mark Stress to add Proficiency to Spellcast; once per rest swap this card from vault free.'
),
(
  'confusing-aura',
  'Confusing Aura',
  (select id from public.domains where slug = 'arcana'),
  8,
  'Spell',
  2,
  'Spellcast Roll (14) to create illusion layers that can negate incoming attacks.'
),
(
  'conjure-swarm',
  'Conjure Swarm',
  (select id from public.domains where slug = 'sage'),
  2,
  'Spell',
  1,
  'Choose beetles to reduce damage severity or fire flies to deal 2d8+3 magic damage to nearby targets.'
),
(
  'conjured-steeds',
  'Conjured Steeds',
  (select id from public.domains where slug = 'sage'),
  6,
  'Spell',
  0,
  'Spend Hope to conjure mounts that enhance travel speed and combat mobility until damaged or next long rest.'
),
(
  'copycat',
  'Copycat',
  (select id from public.domains where slug = 'grace'),
  9,
  'Spell',
  3,
  'Once per long rest, mimic another player’s level 8 or lower domain card by spending Hope.'
),
(
  'corrosive-projectile',
  'Corrosive Projectile',
  (select id from public.domains where slug = 'sage'),
  3,
  'Spell',
  1,
  'Spellcast vs Far target; deal 6d4 magic damage and optionally apply permanent Corroded penalties.'
),
(
  'counterspell',
  'Counterspell',
  (select id from public.domains where slug = 'arcana'),
  3,
  'Spell',
  2,
  'Reaction Spellcast to interrupt a magical effect; on success negate it and place this card in your vault.'
),
(
  'critical-inspiration',
  'Critical Inspiration',
  (select id from public.domains where slug = 'valor'),
  3,
  'Ability',
  1,
  'Once per rest on a critical success, allies within Very Close range clear Stress or gain Hope.'
),
(
  'cruel-precision',
  'Cruel Precision',
  (select id from public.domains where slug = 'bone'),
  7,
  'Ability',
  1,
  'On a successful weapon attack, add either Finesse or Agility to your damage roll.'
),
(
  'dark-whispers',
  'Dark Whispers',
  (select id from public.domains where slug = 'midnight'),
  6,
  'Spell',
  0,
  'Telepathic link with a touched creature; optional Spellcast to ask the GM probing questions.'
);
insert into public.abilities (
  slug,
  name,
  domain_id,
  level,
  ability_type,
  recall_cost,
  description
)
values
(
  'deadly-focus',
  'Deadly Focus',
  (select id from public.domains where slug = 'blade'),
  4,
  'Ability',
  2,
  'Once per rest, focus on a chosen target to gain +1 Proficiency until you switch targets, defeat them, or combat ends.'
),
(
  'death-grip',
  'Death Grip',
  (select id from public.domains where slug = 'sage'),
  4,
  'Spell',
  1,
  'Spellcast vs Close target; pull, constrict for 2 Stress, or damage intervening foes. On success, target is temporarily Restrained.'
),
(
  'deathrun',
  'Deathrun',
  (select id from public.domains where slug = 'bone'),
  10,
  'Ability',
  1,
  'Spend 3 Hope to run through the battlefield, attacking multiple foes in sequence with decreasing damage dice.'
),
(
  'deft-deceiver',
  'Deft Deceiver',
  (select id from public.domains where slug = 'grace'),
  1,
  'Ability',
  0,
  'Spend a Hope to gain advantage on a roll to deceive or trick someone.'
),
(
  'deft-maneuvers',
  'Deft Maneuvers',
  (select id from public.domains where slug = 'bone'),
  1,
  'Ability',
  0,
  'Once per rest, mark Stress to sprint within Far range without rolling; gain +1 attack bonus if engaging immediately.'
),
(
  'disintegration-wave',
  'Disintegration Wave',
  (select id from public.domains where slug = 'codex'),
  9,
  'Spell',
  4,
  'Spellcast Roll (18). Once per long rest, instantly kill selected adversaries with Difficulty 18 or lower.'
),
(
  'divination',
  'Divination',
  (select id from public.domains where slug = 'splendor'),
  4,
  'Spell',
  1,
  'Once per long rest, spend 3 Hope to ask a yes-or-no question about the near future.'
),
(
  'earthquake',
  'Earthquake',
  (select id from public.domains where slug = 'arcana'),
  9,
  'Spell',
  2,
  'Spellcast Roll (16). Targets in Very Far range take heavy physical damage and terrain becomes difficult.'
),
(
  'eclipse',
  'Eclipse',
  (select id from public.domains where slug = 'midnight'),
  10,
  'Spell',
  2,
  'Spellcast Roll (16) to shroud area in magical darkness allies can see through, imposing disadvantage on enemies.'
),
(
  'encore',
  'Encore',
  (select id from public.domains where slug = 'grace'),
  10,
  'Spell',
  1,
  'After an ally deals damage, Spellcast vs same target to duplicate that damage.'
),
(
  'endless-charisma',
  'Endless Charisma',
  (select id from public.domains where slug = 'grace'),
  7,
  'Ability',
  1,
  'After persuading or deceiving, spend Hope to reroll the Hope or Fear die.'
),
(
  'enrapture',
  'Enrapture',
  (select id from public.domains where slug = 'grace'),
  1,
  'Spell',
  1,
  'Spellcast vs Close target to Enrapture them; once per rest you may force them to mark Stress.'
),
(
  'falling-sky',
  'Falling Sky',
  (select id from public.domains where slug = 'arcana'),
  10,
  'Spell',
  1,
  'Spellcast vs all Far-range foes; mark Stress to deal massive magic damage per Stress spent.'
),
(
  'fane-of-the-wilds',
  'Fane of the Wilds',
  (select id from public.domains where slug = 'sage'),
  9,
  'Ability',
  2,
  'Gain and spend tokens to enhance Sage Spellcast Rolls; tokens reset on long rest.'
),
(
  'ferocity',
  'Ferocity',
  (select id from public.domains where slug = 'bone'),
  2,
  'Ability',
  2,
  'After causing HP loss, spend Hope to gain temporary Evasion equal to HP marked.'
),
(
  'final-words',
  'Final Words',
  (select id from public.domains where slug = 'splendor'),
  2,
  'Spell',
  1,
  'Spellcast Roll (13) to briefly animate a corpse to answer questions before turning to dust.'
),
(
  'flight',
  'Flight',
  (select id from public.domains where slug = 'arcana'),
  3,
  'Spell',
  1,
  'Spellcast Roll (15) to gain flight using expendable Agility-based tokens.'
),
(
  'floating-eye',
  'Floating Eye',
  (select id from public.domains where slug = 'arcana'),
  2,
  'Spell',
  0,
  'Spend Hope to create a remote viewing orb within Very Far range.'
),
(
  'forager',
  'Forager',
  (select id from public.domains where slug = 'sage'),
  6,
  'Ability',
  1,
  'Additional downtime move to forage consumables with various restorative effects.'
),
(
  'force-of-nature',
  'Force of Nature',
  (select id from public.domains where slug = 'sage'),
  10,
  'Spell',
  2,
  'Transform into a nature spirit with massive damage bonuses and immunity to restraint.'
),
(
  'forceful-push',
  'Forceful Push',
  (select id from public.domains where slug = 'valor'),
  1,
  'Ability',
  0,
  'Melee attack that knocks target back; bonus damage on Hope and optional Vulnerable.'
),
(
  'forest-sprites',
  'Forest Sprites',
  (select id from public.domains where slug = 'sage'),
  8,
  'Spell',
  2,
  'Spellcast Roll (13) to summon sprites that boost ally attacks and armor mitigation.'
),
(
  'fortified-armor',
  'Fortified Armor',
  (select id from public.domains where slug = 'blade'),
  4,
  'Ability',
  0,
  'While wearing armor, gain +2 to damage thresholds.'
),
(
  'frenzy',
  'Frenzy',
  (select id from public.domains where slug = 'blade'),
  8,
  'Ability',
  3,
  'Once per long rest, enter Frenzy for massive damage bonuses but lose access to Armor Slots.'
);
insert into public.abilities (
  slug,
  name,
  domain_id,
  level,
  ability_type,
  recall_cost,
  description
)
values
(
  'full-surge',
  'Full Surge',
  (select id from public.domains where slug = 'valor'),
  8,
  'Ability',
  1,
  'Once per long rest, mark 3 Stress to gain +2 to all character traits until your next rest.'
),
(
  'get-back-up',
  'Get Back Up',
  (select id from public.domains where slug = 'blade'),
  1,
  'Ability',
  1,
  'When you take Severe damage, mark a Stress to reduce the severity by one threshold.'
),
(
  'gifted-tracker',
  'Gifted Tracker',
  (select id from public.domains where slug = 'sage'),
  1,
  'Ability',
  0,
  'Spend Hope while tracking to ask the GM questions; gain +1 Evasion against tracked creatures.'
),
(
  'glancing-blow',
  'Glancing Blow',
  (select id from public.domains where slug = 'blade'),
  7,
  'Ability',
  1,
  'On a failed attack, mark Stress to deal weapon damage using half your Proficiency.'
),
(
  'glyph-of-nightfall',
  'Glyph of Nightfall',
  (select id from public.domains where slug = 'midnight'),
  4,
  'Spell',
  1,
  'Spellcast vs Very Close target; spend Hope to reduce their Difficulty by your Knowledge (min 1).'
),
(
  'goad-them-on',
  'Goad Them On',
  (select id from public.domains where slug = 'valor'),
  4,
  'Ability',
  1,
  'Presence Roll to taunt a target; on success they mark Stress and must attack you with disadvantage.'
),
(
  'gore-and-glory',
  'Gore and Glory',
  (select id from public.domains where slug = 'blade'),
  9,
  'Ability',
  2,
  'On critical weapon success gain Hope or clear Stress; defeating an enemy grants the same.'
),
(
  'grace-touched',
  'Grace-Touched',
  (select id from public.domains where slug = 'grace'),
  7,
  'Ability',
  2,
  'When 4+ Grace cards: mark Armor instead of Stress; convert forced HP marks into Stress.'
),
(
  'ground-pound',
  'Ground Pound',
  (select id from public.domains where slug = 'valor'),
  8,
  'Ability',
  2,
  'Spend 2 Hope; Strength Roll vs nearby targets to knock them back and deal heavy damage.'
),
(
  'healing-field',
  'Healing Field',
  (select id from public.domains where slug = 'sage'),
  4,
  'Spell',
  2,
  'Once per long rest, heal all allies in Close range; spend Hope to increase healing.'
),
(
  'healing-hands',
  'Healing Hands',
  (select id from public.domains where slug = 'splendor'),
  2,
  'Spell',
  1,
  'Spellcast Roll (13) to heal HP or Stress on another creature; reduced effect on failure.'
),
(
  'healing-strike',
  'Healing Strike',
  (select id from public.domains where slug = 'splendor'),
  7,
  'Spell',
  1,
  'When you deal damage, spend 2 Hope to clear a Hit Point on an ally within Close range.'
),
(
  'hold-the-line',
  'Hold the Line',
  (select id from public.domains where slug = 'valor'),
  9,
  'Ability',
  1,
  'Spend Hope to Restrict enemies entering Very Close range; ends on movement, Fear, or GM action.'
),
(
  'hush',
  'Hush',
  (select id from public.domains where slug = 'midnight'),
  5,
  'Spell',
  1,
  'Spellcast vs Close target to create a mobile Silenced area preventing sound and spellcasting.'
),
(
  'hypnotic-shimmer',
  'Hypnotic Shimmer',
  (select id from public.domains where slug = 'grace'),
  3,
  'Spell',
  1,
  'Spellcast vs foes in Close range; on success Stun them and force Stress.'
),
(
  'i-am-your-shield',
  'I Am Your Shield',
  (select id from public.domains where slug = 'valor'),
  1,
  'Ability',
  1,
  'Intercept damage for an ally within Very Close range and absorb it using Armor Slots.'
),
(
  'i-see-it-coming',
  'I See It Coming',
  (select id from public.domains where slug = 'bone'),
  1,
  'Ability',
  1,
  'When attacked from range, mark Stress to roll d4 and gain that much Evasion.'
),
(
  'inevitable',
  'Inevitable',
  (select id from public.domains where slug = 'valor'),
  6,
  'Ability',
  1,
  'After failing an action roll, your next action roll has advantage.'
),
(
  'inspirational-words',
  'Inspirational Words',
  (select id from public.domains where slug = 'grace'),
  1,
  'Ability',
  1,
  'Gain Presence-based tokens after rest; spend them to heal, restore Stress, or grant Hope.'
),
(
  'invigoration',
  'Invigoration',
  (select id from public.domains where slug = 'splendor'),
  10,
  'Spell',
  3,
  'Spend Hope and roll d6s; on a 6, refresh an exhausted feature.'
),
(
  'invisibility',
  'Invisibility',
  (select id from public.domains where slug = 'grace'),
  3,
  'Spell',
  1,
  'Spellcast Roll (10) to render a creature Invisible using expendable Spellcast-based tokens.'
),
(
  'know-thy-enemy',
  'Know Thy Enemy',
  (select id from public.domains where slug = 'bone'),
  5,
  'Ability',
  1,
  'Instinct Roll to learn enemy stats, abilities, or features; may reduce GM Fear Pool.'
),
(
  'lead-by-example',
  'Lead by Example',
  (select id from public.domains where slug = 'valor'),
  9,
  'Ability',
  3,
  'After damaging an enemy, encourage allies; next attacker clears Stress or gains Hope.'
),
(
  'lean-on-me',
  'Lean On Me',
  (select id from public.domains where slug = 'valor'),
  3,
  'Ability',
  1,
  'Once per long rest, console an ally after failure; both clear 2 Stress.'
);
insert into public.abilities (
  slug,
  name,
  domain_id,
  level,
  ability_type,
  recall_cost,
  description
)
values
(
  'life-ward',
  'Life Ward',
  (select id from public.domains where slug = 'splendor'),
  4,
  'Spell',
  1,
  'Spend 3 Hope to protect an ally; when they would make a Death Move, they instead clear a Hit Point.'
),
(
  'manifest-wall',
  'Manifest Wall',
  (select id from public.domains where slug = 'codex'),
  5,
  'Spell',
  2,
  'Spellcast Roll (15) to create a large temporary magical wall until next rest.'
),
(
  'mass-disguise',
  'Mass Disguise',
  (select id from public.domains where slug = 'midnight'),
  6,
  'Spell',
  0,
  'Mark Stress to disguise all willing creatures in Close range; disguise drops when Countdown (8) completes.'
),
(
  'mass-enrapture',
  'Mass Enrapture',
  (select id from public.domains where slug = 'grace'),
  8,
  'Spell',
  3,
  'Spellcast vs Far targets to Enrapture them; mark Stress to force all to mark Stress and end the effect.'
),
(
  'master-of-the-craft',
  'Master of the Craft',
  (select id from public.domains where slug = 'grace'),
  9,
  'Ability',
  0,
  'Gain permanent Experience bonuses; this card is placed in your vault permanently.'
),
(
  'mending-touch',
  'Mending Touch',
  (select id from public.domains where slug = 'splendor'),
  1,
  'Spell',
  1,
  'Spend Hope to heal HP or Stress with increased effect when sharing or learning during downtime.'
),
(
  'midnight-spirit',
  'Midnight Spirit',
  (select id from public.domains where slug = 'midnight'),
  2,
  'Spell',
  1,
  'Summon a spirit to carry objects or attack a distant target for Spellcast-based damage.'
),
(
  'midnight-touched',
  'Midnight-Touched',
  (select id from public.domains where slug = 'midnight'),
  7,
  'Ability',
  2,
  'When meeting Midnight card conditions: gain Hope instead of GM Fear; add Fear die to damage.'
),
(
  'natural-familiar',
  'Natural Familiar',
  (select id from public.domains where slug = 'sage'),
  2,
  'Spell',
  1,
  'Summon a nature familiar; gain bonus damage when fighting near it and optional flight.'
),
(
  'natures-tongue',
  'Nature’s Tongue',
  (select id from public.domains where slug = 'sage'),
  1,
  'Ability',
  0,
  'Speak with plants and animals; gain +2 to Spellcast in natural environments.'
),
(
  'never-upstaged',
  'Never Upstaged',
  (select id from public.domains where slug = 'grace'),
  6,
  'Ability',
  2,
  'Convert marked Hit Points into damage-boosting tokens for your next successful attack.'
),
(
  'night-terror',
  'Night Terror',
  (select id from public.domains where slug = 'midnight'),
  9,
  'Spell',
  2,
  'Once per long rest, Horrify nearby targets, steal GM Fear, and deal damage based on it.'
),
(
  'not-good-enough',
  'Not Good Enough',
  (select id from public.domains where slug = 'blade'),
  1,
  'Ability',
  1,
  'Reroll damage dice results of 1s or 2s.'
),
(
  'notorious',
  'Notorious',
  (select id from public.domains where slug = 'grace'),
  10,
  'Ability',
  0,
  'Spend Stress to gain massive social bonuses; this card ignores loadout limits and vault rules.'
),
(
  'on-the-brink',
  'On the Brink',
  (select id from public.domains where slug = 'bone'),
  9,
  'Ability',
  1,
  'When at 2 or fewer unmarked Hit Points, you ignore Minor damage.'
),
(
  'onslaught',
  'Onslaught',
  (select id from public.domains where slug = 'blade'),
  10,
  'Ability',
  3,
  'Weapon attacks always deal at least Major damage; punish enemies who attack allies.'
),
(
  'overwhelming-aura',
  'Overwhelming Aura',
  (select id from public.domains where slug = 'splendor'),
  9,
  'Spell',
  2,
  'Spellcast Roll (15) to empower your Presence and punish attackers with Stress.'
),
(
  'phantom-retreat',
  'Phantom Retreat',
  (select id from public.domains where slug = 'midnight'),
  5,
  'Spell',
  2,
  'Spend Hope to mark a return point and later teleport back to it.'
),
(
  'pick-and-pull',
  'Pick and Pull',
  (select id from public.domains where slug = 'midnight'),
  1,
  'Ability',
  0,
  'Gain advantage on rolls to pick locks, disarm traps, or steal items.'
),
(
  'plant-dominion',
  'Plant Dominion',
  (select id from public.domains where slug = 'sage'),
  9,
  'Spell',
  1,
  'Spellcast Roll (18) to reshape plant life across a wide area.'
),
(
  'premonition',
  'Premonition',
  (select id from public.domains where slug = 'arcana'),
  5,
  'Spell',
  2,
  'Once per long rest, undo a move and its consequences after seeing the outcome.'
),
(
  'preservation-blast',
  'Preservation Blast',
  (select id from public.domains where slug = 'arcana'),
  4,
  'Spell',
  2,
  'Spellcast vs Melee targets to blast them back and deal heavy magic damage.'
),
(
  'rage-up',
  'Rage Up',
  (select id from public.domains where slug = 'blade'),
  6,
  'Ability',
  1,
  'Before attacking, mark Stress to gain bonus damage equal to twice your Strength.'
),
(
  'rain-of-blades',
  'Rain of Blades',
  (select id from public.domains where slug = 'midnight'),
  1,
  'Spell',
  1,
  'Spellcast to strike all Very Close targets; deal extra damage to Vulnerable foes.'
);
insert into public.abilities (
  slug,
  name,
  domain_id,
  level,
  ability_type,
  recall_cost,
  description
)
values
(
  'rapid-riposte',
  'Rapid Riposte',
  (select id from public.domains where slug = 'bone'),
  6,
  'Ability',
  0,
  'When a Melee attack against you fails, mark Stress to immediately deal weapon damage to the attacker.'
),
(
  'reapers-strike',
  'Reaper’s Strike',
  (select id from public.domains where slug = 'blade'),
  9,
  'Ability',
  3,
  'Once per long rest, make an attack roll; choose a valid target and force them to mark 5 Hit Points.'
),
(
  'reassurance',
  'Reassurance',
  (select id from public.domains where slug = 'splendor'),
  1,
  'Ability',
  0,
  'Once per rest, allow an ally to reroll an action roll before consequences resolve.'
),
(
  'reckless',
  'Reckless',
  (select id from public.domains where slug = 'blade'),
  2,
  'Ability',
  1,
  'Mark Stress to gain advantage on an attack.'
),
(
  'recovery',
  'Recovery',
  (select id from public.domains where slug = 'bone'),
  6,
  'Ability',
  1,
  'During a short rest, take a long-rest downtime move; spend Hope to extend this to an ally.'
),
(
  'redirect',
  'Redirect',
  (select id from public.domains where slug = 'bone'),
  4,
  'Ability',
  1,
  'When a ranged attack against you fails, roll d6s; on a 6, mark Stress to redirect damage.'
),
(
  'rejuvenation-barrier',
  'Rejuvenation Barrier',
  (select id from public.domains where slug = 'sage'),
  8,
  'Spell',
  1,
  'Spellcast Roll (15) to create a moving barrier that heals and grants physical resistance.'
),
(
  'restoration',
  'Restoration',
  (select id from public.domains where slug = 'splendor'),
  6,
  'Spell',
  2,
  'Gain Spellcast-based tokens after rest; spend to heal HP, Stress, or remove conditions.'
),
(
  'resurrection',
  'Resurrection',
  (select id from public.domains where slug = 'splendor'),
  10,
  'Spell',
  2,
  'Spellcast Roll (20) to restore a long-dead creature; risk permanent vaulting on success.'
),
(
  'rift-walker',
  'Rift Walker',
  (select id from public.domains where slug = 'arcana'),
  6,
  'Spell',
  2,
  'Spellcast Roll (15) to place and later reopen a spatial rift for safe travel.'
),
(
  'rise-up',
  'Rise Up',
  (select id from public.domains where slug = 'valor'),
  6,
  'Ability',
  2,
  'Gain bonus Severe threshold equal to Proficiency; clear Stress when marking Hit Points.'
),
(
  'rousing-strike',
  'Rousing Strike',
  (select id from public.domains where slug = 'valor'),
  5,
  'Ability',
  1,
  'Once per rest on a critical hit, you and allies clear HP or Stress.'
),
(
  'rune-ward',
  'Rune Ward',
  (select id from public.domains where slug = 'arcana'),
  1,
  'Spell',
  0,
  'Protective trinket allows Hope to reduce damage by 1d8; recharges on rest.'
),
(
  'safe-haven',
  'Safe Haven',
  (select id from public.domains where slug = 'codex'),
  8,
  'Spell',
  3,
  'Spend Hope to summon a secure extradimensional refuge and gain extra downtime benefits.'
),
(
  'sage-touched',
  'Sage-Touched',
  (select id from public.domains where slug = 'sage'),
  7,
  'Ability',
  2,
  'When 4+ Sage cards: boost Spellcast in nature and double Agility or Instinct once per rest.'
),
(
  'salvation-beam',
  'Salvation Beam',
  (select id from public.domains where slug = 'splendor'),
  9,
  'Spell',
  2,
  'Spellcast Roll (16) to heal allies in a line by distributing cleared Hit Points.'
),
(
  'scramble',
  'Scramble',
  (select id from public.domains where slug = 'blade'),
  3,
  'Ability',
  1,
  'Once per rest, avoid an incoming Melee attack and move safely away.'
),
(
  'second-wind',
  'Second Wind',
  (select id from public.domains where slug = 'splendor'),
  3,
  'Ability',
  2,
  'On successful attack, clear Stress or HP; on Hope, also heal a nearby ally.'
),
(
  'sensory-projection',
  'Sensory Projection',
  (select id from public.domains where slug = 'arcana'),
  9,
  'Spell',
  0,
  'Spellcast Roll (15) to remotely perceive a previously visited location.'
),
(
  'shadowbind',
  'Shadowbind',
  (select id from public.domains where slug = 'midnight'),
  2,
  'Spell',
  0,
  'Spellcast vs nearby foes to temporarily Restrict them with shadows.'
),
(
  'shadowhunter',
  'Shadowhunter',
  (select id from public.domains where slug = 'midnight'),
  8,
  'Ability',
  2,
  'Gain Evasion and advantage on attacks while in darkness or low light.'
),
(
  'shape-material',
  'Shape Material',
  (select id from public.domains where slug = 'splendor'),
  5,
  'Spell',
  1,
  'Spend Hope to reshape natural material you are touching into useful forms.'
),
(
  'share-the-burden',
  'Share the Burden',
  (select id from public.domains where slug = 'grace'),
  6,
  'Spell',
  0,
  'Once per rest, absorb Stress from an ally and gain Hope per Stress transferred.'
),
(
  'shield-aura',
  'Shield Aura',
  (select id from public.domains where slug = 'splendor'),
  8,
  'Spell',
  2,
  'Protective aura enhances Armor Slot mitigation; ends if damage is fully negated.'
);
insert into public.abilities (
  slug,
  name,
  domain_id,
  level,
  ability_type,
  recall_cost,
  description
)
values
(
  'shrug-it-off',
  'Shrug It Off',
  (select id from public.domains where slug = 'valor'),
  7,
  'Ability',
  1,
  'When taking damage, mark Stress to reduce severity by one threshold; on d6 ≤ 3, this card is vaulted.'
),
(
  'sigil-of-retribution',
  'Sigil of Retribution',
  (select id from public.domains where slug = 'codex'),
  6,
  'Spell',
  2,
  'Mark an adversary; accumulate d8s when they deal damage, then add the total to your next successful attack.'
),
(
  'signature-move',
  'Signature Move',
  (select id from public.domains where slug = 'bone'),
  5,
  'Ability',
  1,
  'Once per rest, roll a d20 as your Hope Die when performing your signature move; clear Stress on success.'
),
(
  'smite',
  'Smite',
  (select id from public.domains where slug = 'splendor'),
  5,
  'Spell',
  2,
  'Once per rest, spend 3 Hope; your next successful weapon attack deals double damage as magic.'
),
(
  'soothing-speech',
  'Soothing Speech',
  (select id from public.domains where slug = 'grace'),
  4,
  'Ability',
  1,
  'During a short rest, enhance Tend to Wounds to heal extra Hit Points for both target and yourself.'
),
(
  'specter-of-the-dark',
  'Specter of the Dark',
  (select id from public.domains where slug = 'midnight'),
  10,
  'Spell',
  1,
  'Become Spectral: immune to physical damage and able to pass through objects until you act.'
),
(
  'spellcharge',
  'Spellcharge',
  (select id from public.domains where slug = 'midnight'),
  8,
  'Spell',
  1,
  'Store damage-based tokens when hit by magic; spend them to add d6s to a successful attack.'
),
(
  'splendor-touched',
  'Splendor-Touched',
  (select id from public.domains where slug = 'splendor'),
  7,
  'Ability',
  2,
  'When 4+ Splendor cards: boost Severe threshold and convert HP damage to Stress or Hope once per long rest.'
),
(
  'splintering-strike',
  'Splintering Strike',
  (select id from public.domains where slug = 'bone'),
  9,
  'Ability',
  3,
  'Once per long rest, attack all targets in range and distribute weapon damage with bonus dice.'
),
(
  'stealth-expertise',
  'Stealth Expertise',
  (select id from public.domains where slug = 'midnight'),
  4,
  'Ability',
  0,
  'When sneaking and rolling with Fear, mark Stress to roll with Hope instead; may aid allies similarly.'
),
(
  'strategic-approach',
  'Strategic Approach',
  (select id from public.domains where slug = 'bone'),
  2,
  'Ability',
  1,
  'Gain Knowledge-based tokens after rest; spend for advantage, ally relief, or bonus damage.'
),
(
  'stunning-sunlight',
  'Stunning Sunlight',
  (select id from public.domains where slug = 'splendor'),
  8,
  'Spell',
  2,
  'Spellcast to blast foes with sunlight; heavy damage and Stun on failed reactions.'
),
(
  'support-tank',
  'Support Tank',
  (select id from public.domains where slug = 'valor'),
  4,
  'Ability',
  2,
  'Spend Hope to allow a nearby ally to reroll a Hope or Fear die.'
),
(
  'swift-step',
  'Swift Step',
  (select id from public.domains where slug = 'bone'),
  10,
  'Ability',
  2,
  'When an attack against you fails, clear Stress or gain Hope if none can be cleared.'
),
(
  'tactician',
  'Tactician',
  (select id from public.domains where slug = 'bone'),
  3,
  'Ability',
  1,
  'When helping allies or making Tag Team Rolls, enhance rolls using your Experiences or a d20 Hope Die.'
),
(
  'telekinesis',
  'Telekinesis',
  (select id from public.domains where slug = 'arcana'),
  6,
  'Spell',
  0,
  'Spellcast to move creatures; may throw them for significant physical damage.'
),
(
  'teleport',
  'Teleport',
  (select id from public.domains where slug = 'codex'),
  5,
  'Spell',
  2,
  'Once per long rest, teleport willing creatures; success depends on familiarity with destination.'
),
(
  'tell-no-lies',
  'Tell No Lies',
  (select id from public.domains where slug = 'grace'),
  2,
  'Spell',
  1,
  'Spellcast vs target to prevent lying while nearby; refusal causes Stress and ends the effect.'
),
(
  'tempest',
  'Tempest',
  (select id from public.domains where slug = 'sage'),
  10,
  'Spell',
  2,
  'Invoke Blizzard, Hurricane, or Sandstorm to damage and control all targets in range.'
),
(
  'thorn-skin',
  'Thorn Skin',
  (select id from public.domains where slug = 'sage'),
  5,
  'Spell',
  1,
  'Gain thorn tokens to reduce incoming damage and reflect it to adjacent attackers.'
),
(
  'thought-delver',
  'Thought Delver',
  (select id from public.domains where slug = 'grace'),
  5,
  'Spell',
  2,
  'Read surface and deeper thoughts of distant targets; Fear may alert them.'
),
(
  'through-your-eyes',
  'Through Your Eyes',
  (select id from public.domains where slug = 'grace'),
  4,
  'Spell',
  1,
  'See and hear through another creature’s senses until rest or another spell.'
),
(
  'towering-stalk',
  'Towering Stalk',
  (select id from public.domains where slug = 'sage'),
  3,
  'Spell',
  1,
  'Conjure a climbable stalk; may be used offensively to lift and drop enemies.'
),
(
  'transcendent-union',
  'Transcendent Union',
  (select id from public.domains where slug = 'codex'),
  10,
  'Spell',
  1,
  'Link willing creatures so Stress and Hit Points can be shared freely until next rest.'
);
insert into public.abilities (
  slug,
  name,
  domain_id,
  level,
  ability_type,
  recall_cost,
  description
)
values
(
  'troublemaker',
  'Troublemaker',
  (select id from public.domains where slug = 'grace'),
  2,
  'Ability',
  2,
  'Once per rest, taunt a target within Far range; roll d4s equal to Proficiency and deal Stress equal to the highest roll.'
),
(
  'twilight-toll',
  'Twilight Toll',
  (select id from public.domains where slug = 'midnight'),
  9,
  'Ability',
  1,
  'Build tokens by succeeding on non-damaging actions; spend them to add d12s to damage against the marked target.'
),
(
  'unbreakable',
  'Unbreakable',
  (select id from public.domains where slug = 'valor'),
  10,
  'Ability',
  4,
  'When you would make a Death Move, roll d6 to clear that many Hit Points and vault this card.'
),
(
  'uncanny-disguise',
  'Uncanny Disguise',
  (select id from public.domains where slug = 'midnight'),
  1,
  'Spell',
  0,
  'Mark Stress to assume a humanoid disguise; spend Spellcast-based tokens per action.'
),
(
  'unleash-chaos',
  'Unleash Chaos',
  (select id from public.domains where slug = 'arcana'),
  1,
  'Spell',
  1,
  'Spend tokens to roll d10s for magic damage; replenish tokens by marking Stress.'
),
(
  'untouchable',
  'Untouchable',
  (select id from public.domains where slug = 'bone'),
  1,
  'Ability',
  1,
  'Gain an Evasion bonus equal to half your Agility.'
),
(
  'unyielding-armor',
  'Unyielding Armor',
  (select id from public.domains where slug = 'valor'),
  10,
  'Ability',
  1,
  'When marking an Armor Slot, roll d6s; a 6 reduces severity without marking armor.'
),
(
  'valor-touched',
  'Valor-Touched',
  (select id from public.domains where slug = 'valor'),
  7,
  'Ability',
  1,
  'When 4+ Valor cards: +1 Armor Score and clear an Armor Slot when taking HP damage without armor.'
),
(
  'vanishing-dodge',
  'Vanishing Dodge',
  (select id from public.domains where slug = 'midnight'),
  7,
  'Spell',
  1,
  'Spend Hope when a physical attack fails to become Hidden and teleport near the attacker.'
),
(
  'veil-of-night',
  'Veil of Night',
  (select id from public.domains where slug = 'midnight'),
  3,
  'Spell',
  1,
  'Spellcast Roll (13) to create a veil of darkness only you can see through.'
),
(
  'versatile-fighter',
  'Versatile Fighter',
  (select id from public.domains where slug = 'blade'),
  3,
  'Ability',
  1,
  'Use alternate traits for weapons; mark Stress to maximize one damage die.'
),
(
  'vicious-entangle',
  'Vicious Entangle',
  (select id from public.domains where slug = 'sage'),
  1,
  'Spell',
  1,
  'Spellcast vs Far target to deal damage and Restrain; may Restrain a second nearby foe.'
),
(
  'vitality',
  'Vitality',
  (select id from public.domains where slug = 'blade'),
  5,
  'Ability',
  0,
  'Permanently gain two durability bonuses and vault this card.'
),
(
  'voice-of-reason',
  'Voice of Reason',
  (select id from public.domains where slug = 'splendor'),
  3,
  'Ability',
  1,
  'Advantage on de-escalation rolls; gain damage Proficiency bonus when fully Stressed.'
),
(
  'wall-walk',
  'Wall Walk',
  (select id from public.domains where slug = 'arcana'),
  1,
  'Spell',
  1,
  'Spend Hope to allow a touched creature to walk on walls and ceilings for the scene.'
),
(
  'whirlwind',
  'Whirlwind',
  (select id from public.domains where slug = 'blade'),
  1,
  'Ability',
  0,
  'Spend Hope after a successful attack to strike all Very Close targets for half damage.'
),
(
  'wild-fortress',
  'Wild Fortress',
  (select id from public.domains where slug = 'sage'),
  5,
  'Spell',
  1,
  'Spellcast Roll (13) to grow a protective dome with its own damage thresholds.'
),
(
  'wild-surge',
  'Wild Surge',
  (select id from public.domains where slug = 'sage'),
  7,
  'Spell',
  2,
  'Mark Stress to gain an escalating d6 bonus to all actions until it collapses.'
),
(
  'words-of-discord',
  'Words of Discord',
  (select id from public.domains where slug = 'grace'),
  5,
  'Spell',
  1,
  'Force a target to attack another adversary; repeated use imposes penalties.'
),
(
  'wrangle',
  'Wrangle',
  (select id from public.domains where slug = 'bone'),
  8,
  'Ability',
  1,
  'Agility Roll to reposition enemies and willing allies within Close range.'
),
(
  'zone-of-protection',
  'Zone of Protection',
  (select id from public.domains where slug = 'splendor'),
  6,
  'Spell',
  2,
  'Create a scaling damage-reduction zone for allies that ends when its die exceeds 6.'
);
