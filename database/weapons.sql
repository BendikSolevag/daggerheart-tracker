create table public.weapons (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null,

  tier int not null,
  weapon_type text not null, -- e.g. Primary, Secondary (future-proof)

  trait text not null,        -- Strength, Agility, Finesse, etc.
  range text not null,        -- Melee, Far, Very Far
  damage text not null,       -- stored as text: "d8+7 phy"
  burden text not null,       -- One-Handed, Two-Handed

  feature_name text,
  feature_description text,

  created_at timestamptz not null default now()
);
