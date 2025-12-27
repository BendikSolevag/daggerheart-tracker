drop table if exists public.characters;

create table public.characters (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null,
  party_id bigint not null references public.parties(id) on delete cascade,

  class_id bigint not null references public.classes(id) on delete cascade,
  subclass_id bigint not null references public.subclasses(id) on delete cascade,
  ancestry_id bigint not null references public.ancestries(id) on delete cascade,
  community_id bigint not null references public.communities(id) on delete cascade,

  level int8 not null,
  proficiency int8 not null,
  agility int8 not null,
  strength int8 not null,
  finesse int8 not null,
  instinct int8 not null,
  presence int8 not null,
  knowledge int8 not null,
  gold bigint not null,


  weapon_primary_id bigint not null references public.weapons(id) on delete cascade,
  weapon_secondary_id bigint not null references public.weapons(id) on delete cascade,
  armor_id  bigint not null references public.armors(id) on delete cascade,


  created_at timestamptz not null default now()
);
