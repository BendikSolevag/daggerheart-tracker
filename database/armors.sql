create table public.armors (
  id bigint generated always as identity primary key,

  slug text not null unique,
  name text not null,

  tier int not null,

  base_threshold_low int not null,
  base_threshold_high int not null,
  base_score int not null,

  feature_name text,
  feature_description text,

  created_at timestamptz not null default now()
);
insert into public.armors
(slug, name, tier, base_threshold_low, base_threshold_high, base_score, feature_name, feature_description)
values
('advanced-chainmail-armor','Advanced Chainmail Armor',3,13,31,6,'Heavy','-1 to Evasion'),
('advanced-full-plate-armor','Advanced Full Plate Armor',3,15,35,6,'Very Heavy','-2 to Evasion; -1 to Agility'),
('advanced-gambeson-armor','Advanced Gambeson Armor',3,9,23,5,'Flexible','+1 to Evasion'),
('advanced-leather-armor','Advanced Leather Armor',3,11,27,5,null,null),
('bellamie-fine-armor','Bellamie Fine Armor',3,11,27,5,'Gilded','+1 to Presence'),
('bladefare-armor','Bladefare Armor',3,16,39,6,'Physical','You can’t mark an Armor Slot to reduce magic damage'),
('chainmail-armor','Chainmail Armor',1,7,15,4,'Heavy','-1 to Evasion'),
('channeling-armor','Channeling Armor',4,13,36,5,'Channeling','+1 to Spellcast Rolls'),
('dragonscale-armor','Dragonscale Armor',3,11,27,5,'Impenetrable','Once per short rest, when you would mark your last Hit Point, you can instead mark a Stress'),
('dunamis-silkchain','Dunamis Silkchain',4,13,36,7,'Timeslowing','Mark an Armor Slot to roll a d4 and add its result as a bonus to your Evasion against an incoming attack'),
('elundrian-chain-armor','Elundrian Chain Armor',2,9,21,4,'Warded','You reduce incoming magic damage by your Armor Score before applying it to your damage thresholds'),
('emberwoven-armor','Emberwoven Armor',4,13,36,6,'Burning','When an adversary attacks you within Melee range, they mark a Stress'),
('full-fortified-armor','Full Fortified Armor',4,15,40,4,'Fortified','When you mark an Armor Slot, you reduce the severity of an attack by two thresholds instead of one'),
('full-plate-armor','Full Plate Armor',1,8,17,4,'Very Heavy','-2 to Evasion; -1 to Agility'),
('gambeson-armor','Gambeson Armor',1,5,11,3,'Flexible','+1 to Evasion'),
('harrowbone-armor','Harrowbone Armor',2,9,21,4,'Resilient','Before you mark your last Armor Slot, roll a d6. On a 6, reduce the severity by one threshold without marking an Armor Slot'),
('improved-chainmail-armor','Improved Chainmail Armor',2,11,24,5,'Heavy','-1 to Evasion'),
('improved-full-plate-armor','Improved Full Plate Armor',2,13,28,5,'Very Heavy','-2 to Evasion; -1 to Agility'),
('improved-gambeson-armor','Improved Gambeson Armor',2,7,16,4,'Flexible','+1 to Evasion'),
('improved-leather-armor','Improved Leather Armor',2,9,20,4,null,null),
('irontree-breastplate-armor','Irontree Breastplate Armor',2,9,20,4,'Reinforced','When you mark your last Armor Slot, increase your damage thresholds by +2 until you clear at least 1 Armor Slot'),
('leather-armor','Leather Armor',1,6,13,3,null,null),
('legendary-chainmail-armor','Legendary Chainmail Armor',4,15,40,7,'Heavy','-1 to Evasion'),
('legendary-full-plate-armor','Legendary Full Plate Armor',4,17,44,7,'Very Heavy','-2 to Evasion; -1 to Agility'),
('legendary-gambeson-armor','Legendary Gambeson Armor',4,11,32,6,'Flexible','+1 to Evasion'),
('legendary-leather-armor','Legendary Leather Armor',4,13,36,6,null,null),
('monetts-cloak','Monett’s Cloak',3,16,39,6,'Magic','You can’t mark an Armor Slot to reduce physical damage'),
('rosewild-armor','Rosewild Armor',2,11,23,5,'Hopeful','When you would spend a Hope, you can mark an Armor Slot instead'),
('runes-of-fortification','Runes of Fortification',3,17,43,6,'Painful','Each time you mark an Armor Slot, you must mark a Stress'),
('runetan-floating-armor','Runetan Floating Armor',2,9,20,4,'Shifting','When you are targeted for an attack, you can mark an Armor Slot to give the attack roll against you disadvantage'),
('savior-chainmail','Savior Chainmail',4,18,48,8,'Difficult','-1 to all character traits and Evasion'),
('spiked-plate-armor','Spiked Plate Armor',3,10,25,5,'Sharp','On a successful attack against a target within Melee range, add a d4 to the damage roll'),
('tyris-soft-armor','Tyris Soft Armor',2,8,18,5,'Quiet','You gain a +2 bonus to rolls you make to move silently'),
('veritas-opal-armor','Veritas Opal Armor',4,13,36,6,'Truthseeking','This armor glows when another creature within Close range tells a lie');
