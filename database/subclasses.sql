drop table if exists public.subclasses;
create table public.subclasses (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null,
  description text not null,

  spellcast_trait text,

  foundation_features text not null,
  specialization_features text,
  mastery_features text,

  created_at timestamptz not null default now()
);

insert into public.subclasses (
  slug,
  name,
  description,
  spellcast_trait,
  foundation_features,
  specialization_features,
  mastery_features
) values
(
  'beastbound',
  'Beastbound',
  'Play the Beastbound if you want to form a deep bond with an animal ally.',
  'Agility',
  'Companion: You have an animal companion of your choice (at the GM’s discretion). They stay by your side unless you tell them otherwise. Take the Ranger Companion sheet. When you level up your character, choose a level-up option for your companion from this sheet as well.',
  'Expert Training: Choose an additional level-up option for your companion.\n\nBattle-Bonded: When an adversary attacks you while they’re within your companion’s Melee range, you gain a +2 bonus to your Evasion against the attack.',
  'Advanced Training: Choose two additional level-up options for your companion.\n\nLoyal Friend: Once per long rest, when the damage from an attack would mark your companion’s last Stress or your last Hit Point and you’re within Close range of each other, you or your companion can rush to the other’s side and take that damage instead.'
),
(
  'call-of-the-brave',
  'Call of the Brave',
  'Play the Call of the Brave if you want to use the might of your enemies to fuel your own power.',
  null,
  'Courage: When you fail a roll with Fear, you gain a Hope.\n\nBattle Ritual: Once per long rest, before you attempt something incredibly dangerous or face off against a foe who clearly outmatches you, describe what ritual you perform or preparations you make. When you do, clear 2 Stress and gain 2 Hope.',
  'Rise to the Challenge: While you have 2 or fewer Hit Points unmarked, you can roll a d20 as your Hope Die.',
  'Camaraderie: You can initiate a Tag Team Roll one additional time per session. Additionally, when an ally initiates a Tag Team Roll with you, they only need to spend 2 Hope.'
),
(
  'call-of-the-slayer',
  'Call of the Slayer',
  'Play the Call of the Slayer if you want to strike down adversaries with immense force.',
  null,
  'Slayer: You gain a pool of Slayer Dice. On a roll with Hope, you can place a d6 on this card instead of gaining a Hope. You can store a number of Slayer Dice equal to your Proficiency. You can spend these dice on attack or damage rolls.',
  'Weapon Specialist: When you succeed on an attack, you can spend a Hope to add one of the damage dice from your secondary weapon to the damage roll. Once per long rest, reroll any 1s when rolling Slayer Dice.',
  'Martial Preparation: Your party gains access to the Martial Preparation downtime move. You and each ally who takes it gain a d6 Slayer Die usable on an attack or damage roll.'
),
(
  'divine-wielder',
  'Divine Wielder',
  'Play the Divine Wielder if you want to dominate the battlefield with a legendary weapon.',
  'Strength',
  'Spirit Weapon: Your equipped Melee or Very Close weapon can fly to attack a target within Close range and return to you. Mark a Stress to target an additional adversary.\n\nSparing Touch: Once per long rest, touch a creature and clear 2 Hit Points or 2 Stress from them.',
  'Devout: Roll an additional Prayer Die and discard the lowest. You can also use Sparing Touch twice per long rest.',
  'Sacred Resonance: When rolling damage for Spirit Weapon, if any dice match, double the value of each matching die.'
),
(
  'elemental-origin',
  'Elemental Origin',
  'Play the Elemental Origin if you want to channel raw magic to take the shape of a particular element.',
  'Instinct',
  'Elementalist: Choose an element (air, earth, fire, lightning, water). You can create harmless effects. Spend a Hope to gain +2 to a roll or +3 to damage when the element helps.',
  'Natural Evasion: When an attack succeeds against you, mark a Stress, roll a d6, and add it to your Evasion.',
  'Transcendence: Once per long rest, transform into your element and choose two benefits: +4 Severe threshold, +1 trait, +1 Proficiency, or +2 Evasion.'
),
(
  'nightwalker',
  'Nightwalker',
  'Play the Nightwalker if you want to manipulate shadows to maneuver through the environment.',
  'Finesse',
  'Shadow Stepper: Mark a Stress to move between shadows within Far range and become Cloaked.',
  'Dark Cloud: Create a Close-range cloud of darkness that blocks vision.\n\nAdrenaline: While Vulnerable, add your level to damage rolls.',
  'Fleeting Shadow: +1 permanent Evasion and Shadow Stepper reaches Very Far.\n\nVanishing Act: Mark a Stress to become Cloaked and clear Restrained.'
),
(
  'primal-origin',
  'Primal Origin',
  'Play the Primal Origin if you want to extend the versatility of your spells in powerful ways.',
  'Instinct',
  'Manipulate Magic: After casting a spell or magic attack, mark a Stress to extend range, gain +2 to the roll, double a damage die, or hit another target.',
  'Enchanted Aid: When helping a Spellcast Roll, roll a d8. Once per long rest, you may swap an ally’s Duality Dice.',
  'Arcane Charge: Become Charged when taking magic damage or spending 2 Hope. Spend Charge to gain +10 damage or +3 reaction difficulty.'
),
(
  'school-of-knowledge',
  'School of Knowledge',
  'Play the School of Knowledge if you want a keen understanding of the world around you.',
  'Knowledge',
  'Prepared: Take an additional domain card of your level or lower.\n\nAdept: When using an Experience, mark a Stress instead of spending Hope and double the modifier.',
  'Accomplished: Take an additional domain card.\n\nPerfect Recall: Once per rest, reduce a recalled domain card’s Recall Cost by 1.',
  'Brilliant: Take another additional domain card.\n\nHoned Expertise: When using an Experience, roll a d6; on 5+, spend no Hope.'
);

insert into public.subclasses (
  slug,
  name,
  description,
  spellcast_trait,
  foundation_features,
  specialization_features,
  mastery_features
) values
(
  'school-of-war',
  'School of War',
  'Play the School of War if you want to utilize trained magic for violence.',
  'Knowledge',
  'Battlemage: Gain an additional Hit Point slot.\n\nFace Your Fear: When you succeed with Fear on an attack roll, you deal an extra 1d10 magic damage.',
  'Conjure Shield: While you have at least 2 Hope, add your Proficiency to your Evasion.\n\nFueled by Fear: The extra damage from Face Your Fear increases to 2d10.',
  'Thrive in Chaos: After you succeed on an attack, you can mark a Stress to force the target to mark an additional Hit Point.\n\nHave No Fear: The extra damage from Face Your Fear increases to 3d10.'
),
(
  'stalwart',
  'Stalwart',
  'Play the Stalwart if you want to take heavy blows and keep fighting.',
  null,
  'Unwavering: Gain a permanent +1 bonus to your damage thresholds.\n\nIron Will: When you take physical damage, you can mark an additional Armor Slot to reduce the severity.',
  'Unrelenting: Gain a permanent +2 bonus to your damage thresholds.\n\nPartners-in-Arms: When an ally within Very Close range takes damage, you can mark an Armor Slot to reduce the severity by one threshold.',
  'Undaunted: Gain a permanent +3 bonus to your damage thresholds.\n\nLoyal Protector: When an ally within Close range has 2 or fewer Hit Points and would take damage, you can mark a Stress to sprint to their side and take the damage instead.'
),
(
  'syndicate',
  'Syndicate',
  'Play the Syndicate if you want to have a web of contacts everywhere you go.',
  'Finesse',
  'Well-Connected: When you arrive in a prominent location, you know someone who lives there. Define your relationship and choose a complication.',
  'Contacts Everywhere: Once per session, call on a shady contact to gain gold, a bonus to a roll, or extra damage.',
  'Reliable Backup: You can use Contacts Everywhere three times per session and gain additional protective and social benefits.'
),
(
  'troubadour',
  'Troubadour',
  'Play the Troubadour if you want to play music to bolster your allies.',
  'Presence',
  'Gifted Performer: You can perform three different songs once each per long rest—Relaxing, Epic, and Heartbreaking—each granting a unique benefit.',
  'Maestro: When you give a Rally Die to an ally, they can gain a Hope or clear a Stress.',
  'Virtuoso: You can perform each Gifted Performer song twice per long rest.'
),
(
  'vengeance',
  'Vengeance',
  'Play the Vengeance if you want to strike down enemies who harm you or your allies.',
  null,
  'At Ease: Gain an additional Stress slot.\n\nRevenge: When an adversary within Melee range succeeds on an attack against you, you can mark 2 Stress to force them to mark a Hit Point.',
  'Act of Reprisal: When an adversary damages an ally within Melee range, gain +1 Proficiency for your next successful attack against that adversary.',
  'Nemesis: Spend 2 Hope to Prioritize an adversary. When attacking them, you can swap your Hope and Fear Dice.'
),
(
  'warden-of-renewal',
  'Warden of Renewal',
  'Play the Warden of Renewal if you want to use powerful magic to heal your party.',
  'Instinct',
  'Clarity of Nature: Once per long rest, create a restorative natural space to clear Stress.\n\nRegeneration: Spend 3 Hope to touch a creature and clear 1d4 Hit Points.',
  'Regenerative Reach: Regeneration can target Very Close range.\n\nWarden’s Protection: Once per long rest, spend 2 Hope to clear 2 Hit Points on 1d4 allies.',
  'Defender: While in Beastform, you can mark a Stress to reduce Hit Points an ally marks.'
),
(
  'warden-of-the-elements',
  'Warden of the Elements',
  'Play the Warden of the Elements if you want to embody the natural elements of the wild.',
  'Instinct',
  'Elemental Incarnation: Mark a Stress to Channel Fire, Earth, Water, or Air, each granting a distinct benefit.',
  'Elemental Aura: Once per rest while Channeling, project an aura matching your element that affects targets within Close range.',
  'Elemental Dominion: While Channeling, gain a powerful passive benefit based on your chosen element.'
),
(
  'wayfinder',
  'Wayfinder',
  'Play the Wayfinder if you want to hunt your prey and strike with deadly force.',
  'Agility',
  'Ruthless Predator: Mark a Stress to gain +1 Proficiency on damage rolls; Severe damage forces Stress.\n\nPath Forward: You can always identify the shortest route to a familiar destination.',
  'Elusive Predator: When your Focus attacks you, gain +2 Evasion against that attack.',
  'Apex Predator: Spend a Hope before attacking your Focus to remove a Fear from the GM’s pool on a success.'
),
(
  'winged-sentinel',
  'Winged Sentinel',
  'Play the Winged Sentinel if you want to take flight and strike crushing blows from the sky.',
  'Strength',
  'Wings of Light: You can fly. While flying, you can carry allies or spend Hope to deal extra damage.',
  'Ethereal Visage: While flying, you have advantage on Presence Rolls and can remove Fear instead of gaining Hope.',
  'Ascendant: Gain +4 Severe threshold.\n\nPower of the Gods: While flying, deal an extra 1d12 damage instead of 1d8.'
),
(
  'wordsmith',
  'Wordsmith',
  'Play the Wordsmith if you want to use clever wordplay and captivate crowds.',
  'Presence',
  'Rousing Speech: Once per long rest, all allies within Far range clear 2 Stress.\n\nHeart of a Poet: Spend a Hope after social rolls to add a d4.',
  'Eloquent: Once per session, encourage an ally to grant a utility or rest-related benefit.',
  'Epic Poetry: Your Rally Die becomes a d10, and when Helping an Ally you roll a d10 as your advantage die.'
);
