drop table if exists public.classes;

create table public.classes (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null,
  description text not null,

  domain_1_id bigint not null references public.domains(id),
  domain_2_id bigint not null references public.domains(id),

  subclass_1_id bigint not null references public.subclasses(id),
  subclass_2_id bigint not null references public.subclasses(id),

  starting_evasion int not null,
  starting_hit_points int not null,
  class_items text not null,

  hope_feature text not null,
  class_features text not null,

  created_at timestamptz not null default now()
);

insert into public.classes (
  slug,
  name,
  description,
  domain_1_id,
  domain_2_id,
  subclass_1_id,
  subclass_2_id,
  starting_evasion,
  starting_hit_points,
  class_items,
  hope_feature,
  class_features
) values
(
  'bard',
  'Bard',
  'Bards are masters of captivation and performance, thriving in social situations and wielding the power of story, song, and charm.',
  (select id from domains where slug = 'grace'),
  (select id from domains where slug = 'codex'),
  (select id from subclasses where slug = 'troubadour'),
  (select id from subclasses where slug = 'wordsmith'),
  10,
  5,
  'A romance novel or a letter never opened',
  'Make a Scene: Spend 3 Hope to temporarily Distract a target within Close range, giving them a -2 penalty to their Difficulty.',
  'Rally: Once per session, give yourself and each ally a Rally Die (d6 at level 1, d8 at level 5) usable on rolls, damage, or to clear Stress.'
),
(
  'druid',
  'Druid',
  'Druids are stewards of the wild who learn from and protect nature, transforming into beasts and shaping the world around them.',
  (select id from domains where slug = 'sage'),
  (select id from domains where slug = 'arcana'),
  (select id from subclasses where slug = 'warden-of-the-elements'),
  (select id from subclasses where slug = 'warden-of-renewal'),
  10,
  6,
  'A small bag of rocks and bones or a strange pendant found in the dirt',
  'Evolution: Spend 3 Hope to transform into a Beastform without marking Stress and gain +1 to a trait.',
  'Beastform: Mark a Stress to transform into a beast.\n\nWildtouch: Perform subtle, harmless nature magic at will.'
),
(
  'guardian',
  'Guardian',
  'Guardians are stalwart defenders who fight with unbreakable resolve to protect those they care about.',
  (select id from domains where slug = 'valor'),
  (select id from domains where slug = 'blade'),
  (select id from subclasses where slug = 'stalwart'),
  (select id from subclasses where slug = 'vengeance'),
  9,
  7,
  'A totem from your mentor or a secret key',
  'Frontline Tank: Spend 3 Hope to clear 2 Armor Slots.',
  'Unstoppable: Once per long rest, enter a state that reduces incoming damage, increases damage dealt, and prevents Restrained or Vulnerable.'
),
(
  'ranger',
  'Ranger',
  'Rangers are expert hunters and tacticians who pursue their prey with patience, skill, and deep wilderness knowledge.',
  (select id from domains where slug = 'bone'),
  (select id from domains where slug = 'sage'),
  (select id from subclasses where slug = 'beastbound'),
  (select id from subclasses where slug = 'wayfinder'),
  12,
  6,
  'A trophy from your first kill or a seemingly broken compass',
  'Hold Them Off: Spend 3 Hope to apply a successful weapon attack roll to two additional targets.',
  'Ranger’s Focus: Spend a Hope to mark a target as your Focus, gaining tracking and combat benefits.'
),
(
  'rogue',
  'Rogue',
  'Rogues are masters of deception, stealth, and shadow, striking where enemies least expect it.',
  (select id from domains where slug = 'midnight'),
  (select id from domains where slug = 'grace'),
  (select id from subclasses where slug = 'nightwalker'),
  (select id from subclasses where slug = 'syndicate'),
  12,
  6,
  'A set of forgery tools or a grappling hook',
  'Rogue’s Dodge: Spend 3 Hope to gain +2 Evasion until an attack succeeds or until your next rest.',
  'Cloaked: Enhanced stealth while hidden.\n\nSneak Attack: Add bonus damage when attacking from stealth or alongside allies.'
),
(
  'seraph',
  'Seraph',
  'Seraphs are divine champions empowered by gods to heal, protect, and smite in service of sacred purpose.',
  (select id from domains where slug = 'splendor'),
  (select id from domains where slug = 'valor'),
  (select id from subclasses where slug = 'divine-wielder'),
  (select id from subclasses where slug = 'winged-sentinel'),
  9,
  7,
  'A bundle of offerings or a sigil of your god',
  'Life Support: Spend 3 Hope to clear a Hit Point on an ally within Close range.',
  'Prayer Dice: Roll d4s at session start to reduce damage, boost rolls, or gain Hope.'
),
(
  'sorcerer',
  'Sorcerer',
  'Sorcerers wield innate magic passed through bloodlines, learning to control immense and volatile power.',
  (select id from domains where slug = 'arcana'),
  (select id from domains where slug = 'midnight'),
  (select id from subclasses where slug = 'elemental-origin'),
  (select id from subclasses where slug = 'primal-origin'),
  10,
  6,
  'A whispering orb or a family heirloom',
  'Volatile Magic: Spend 3 Hope to reroll any number of magic damage dice.',
  'Arcane Sense: Detect magic nearby.\n\nMinor Illusion: Create small illusions.\n\nChannel Raw Power: Sacrifice domain cards for power.'
),
(
  'warrior',
  'Warrior',
  'Warriors are masters of combat who dedicate their lives to weapon mastery and battlefield dominance.',
  (select id from domains where slug = 'blade'),
  (select id from domains where slug = 'bone'),
  (select id from subclasses where slug = 'call-of-the-brave'),
  (select id from subclasses where slug = 'call-of-the-slayer'),
  11,
  6,
  'The drawing of a lover or a sharpening stone',
  'No Mercy: Spend 3 Hope to gain +1 to attack rolls until your next rest.',
  'Attack of Opportunity: Punish foes who disengage.\n\nCombat Training: Ignore weapon burden and gain bonus physical damage.'
),
(
  'wizard',
  'Wizard',
  'Wizards pursue magical mastery through rigorous study, uncovering secrets that shape the fate of the realms.',
  (select id from domains where slug = 'codex'),
  (select id from domains where slug = 'splendor'),
  (select id from subclasses where slug = 'school-of-knowledge'),
  (select id from subclasses where slug = 'school-of-war'),
  11,
  5,
  'A book you’re trying to translate or a tiny, harmless elemental pet',
  'Not This Time: Spend 3 Hope to force an adversary to reroll an attack or damage roll.',
  'Prestidigitation: Perform minor magic at will.\n\nStrange Patterns: Gain Hope or clear Stress on chosen die rolls.'
);
